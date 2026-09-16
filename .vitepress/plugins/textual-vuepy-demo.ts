import type MarkdownIt from 'markdown-it'
import mdContainer, { ContainerOpts } from 'markdown-it-container'
import fs from 'fs'
import path from 'path'
import { REPO_URL } from '../config'

const CONTAINER_NAME = 'textual-vuepy-demo'
const INFO_RE = /^textual-vuepy-demo\s*(.*)$/

/**
 * 把容器内部的 token 置空，避免 md 中书写的示例代码被重复渲染。
 * markdown-it 的 fence 等规则不检查 token.hidden，因此改成渲染结果为空的 text token。
 */
function blankInnerTokens(tokens, idx: number) {
  let depth = 0
  for (let i = idx + 1; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.type === `container_${CONTAINER_NAME}_open`) {
      depth++
    } else if (token.type === `container_${CONTAINER_NAME}_close`) {
      if (depth === 0) break
      depth--
    }
    token.type = 'text'
    token.content = ''
    token.children = null
  }
}

/**
 * svg 内容会被当作 Vue 模板编译：
 * 1. <style>/<script> 是副作用标签，模板中会被忽略并报错，需要改写成动态组件；
 * 2. {{ }} 会被当作插值，转成实体避免求值。
 */
function svgToVueTemplate(svg: string) {
  return svg
    .replace(/<style/g, `<component :is="'style'"`)
    .replace(/<\/style>/g, '</component>')
    .replace(/<script/g, `<component :is="'script'"`)
    .replace(/<\/script>/g, '</component>')
    .replace(/\{\{/g, '&#123;&#123;')
}

function markAsDependency(env, file: string) {
  if (env && Array.isArray(env.includes)) {
    env.includes.push(file.replace(/\\/g, '/'))
  }
}

/** srcDir 为 src，public 目录下的文件按站点根路径提供服务 */
const CAST_PUBLIC_SUBDIR = 'casts'
const CAST_PUBLIC_DIR = path.resolve(process.cwd(), 'src', 'public', CAST_PUBLIC_SUBDIR)

/**
 * .cast 位于 md 同目录，不在 public 下，不会被当作静态资源。
 * 这里复制一份到 public/casts，返回可供 asciinema-player 请求的 URL。
 *
 * 发布名带 .txt 后缀：录屏里大量重复的 SGR 序列 gzip 后能小 30 倍，而 CDN
 * （GitHub Pages）按 content-type 决定是否压缩，未知的 .cast 会落到
 * application/octet-stream 而得不到压缩。播放器按文件内容里的 header.version
 * 选解析器，与扩展名无关。
 */
function publishCast(castFile: string, demoName: string) {
  const publicName = `${demoName}.cast.txt`
  const target = path.resolve(CAST_PUBLIC_DIR, publicName)
  fs.mkdirSync(CAST_PUBLIC_DIR, { recursive: true })

  const src = fs.statSync(castFile)
  const upToDate =
    fs.existsSync(target) && fs.statSync(target).mtimeMs >= src.mtimeMs
  if (!upToDate) {
    fs.copyFileSync(castFile, target)
  }

  return `/${CAST_PUBLIC_SUBDIR}/${publicName}`
}

/** 读取 asciicast v2 头部的终端尺寸，让播放器按录制尺寸渲染 */
function readCastSize(castFile: string): { cols?: number; rows?: number } {
  try {
    const firstLine = fs.readFileSync(castFile, 'utf-8').split('\n', 1)[0]
    const header = JSON.parse(firstLine)
    return { cols: header.width, rows: header.height }
  } catch {
    return {}
  }
}

type Marker = [number, string]

/**
 * 录制脚本生成的 <demo>.cast.json，形如 {"markers": [[1.5, "启动应用"], ...]}，
 * 也接受直接是数组的写法。
 */
function readCastMarkers(markersFile: string): Marker[] {
  if (!fs.existsSync(markersFile)) return []

  try {
    const parsed = JSON.parse(fs.readFileSync(markersFile, 'utf-8'))
    const markers = Array.isArray(parsed) ? parsed : parsed?.markers
    if (!Array.isArray(markers)) return []
    return markers
      .filter((m) => Array.isArray(m) && typeof m[0] === 'number')
      .map(([at, label]) => [at, String(label ?? '')] as Marker)
  } catch (e) {
    console.warn(`[${CONTAINER_NAME}] invalid markers file ${markersFile}: ${e}`)
    return []
  }
}

/** JSON 作为 Vue 绑定写进 HTML 属性 */
function toAttrValue(value: unknown) {
  return JSON.stringify(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

/**
 * 支持
 *
 * :::textual-vuepy-demo button_basic
 * ...
 * :::
 *
 * 读取 md 同目录下的 button_basic.vue 作为源码，运行结果优先用 button_basic.cast.txt
 * （asciinema 录屏，可播放交互过程），没有 .cast.txt 时回退到 button_basic.svg 截图。
 */
export const textualVuepyDemoPlugin = (md: MarkdownIt) => {
  md.use(mdContainer, CONTAINER_NAME, {
    validate(params: string) {
      return !!params.trim().match(INFO_RE)
    },
    render(tokens, idx, options, env, self) {
      if (tokens[idx].nesting !== 1 /* 1 means the tag is opening */) {
        return ''
      }

      const m = tokens[idx].info.trim().match(INFO_RE)
      const demoName = (m && m[1] ? m[1] : '').trim().split(/\s+/)[0]
      blankInnerTokens(tokens, idx)

      if (!demoName) {
        throw new Error(`[${CONTAINER_NAME}] missing demo name, usage: :::${CONTAINER_NAME} button_basic`)
      }

      const mdFile = env?.realPath ?? env?.path ?? ''
      const baseDir = mdFile ? path.dirname(mdFile) : process.cwd()
      const vueFile = path.resolve(baseDir, `${demoName}.vue`)
      const castFile = path.resolve(baseDir, `${demoName}.cast.txt`)
      const markersFile = path.resolve(baseDir, `${demoName}.cast.json`)
      const svgFile = path.resolve(baseDir, `${demoName}.svg`)

      if (!fs.existsSync(vueFile)) {
        throw new Error(`[${CONTAINER_NAME}] source file not found: ${vueFile}`)
      }
      markAsDependency(env, vueFile)
      const vueSource = fs.readFileSync(vueFile, 'utf-8').trimEnd()
      const vueHtml = md.render(`\`\`\`vue\n${vueSource}\n\`\`\`\n`, { headers: [] })

      let widgetHtml = ''
      if (fs.existsSync(castFile)) {
        // .cast.txt 优先：能回放交互过程
        markAsDependency(env, castFile)
        const castUrl = publishCast(castFile, demoName)
        const { cols, rows } = readCastSize(castFile)
        const sizeAttrs = cols && rows ? ` :cols="${cols}" :rows="${rows}"` : ''

        const markers = readCastMarkers(markersFile)
        if (markers.length) markAsDependency(env, markersFile)
        const markersAttr = markers.length
          ? ` :markers="${toAttrValue(markers)}"`
          : ''

        widgetHtml =
          `<div class="textual-vuepy-demo-output">\n` +
          `<AsciinemaPlayer src="${castUrl}"${sizeAttrs}${markersAttr} />\n` +
          `</div>`
      } else if (fs.existsSync(svgFile)) {
        markAsDependency(env, svgFile)
        const svg = svgToVueTemplate(fs.readFileSync(svgFile, 'utf-8').trimEnd())
        widgetHtml = `<div class="textual-vuepy-demo-output">\n${svg}\n</div>`
      } else {
        console.warn(`[${CONTAINER_NAME}] neither .cast nor .svg found for: ${demoName}`)
      }

      const demoUrl = `${REPO_URL}${path.relative(process.cwd(), vueFile)}`

      return `
    <IpywuiDemo demo-url='${demoUrl}'>
      <template #output>
        ${widgetHtml}\n
      </template>

      <template #src>
        ${vueHtml}\n
      </template>
    </IpywuiDemo>

    <noscript>
      ${vueHtml}\n
    </noscript>
    `
    },
  } as ContainerOpts)
}
