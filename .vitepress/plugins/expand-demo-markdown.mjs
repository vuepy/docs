/**
 * 将 :::ipywui-demo / :::textual-vuepy-demo 容器展开为可阅读的 Markdown
 *（供 dist_md / LLM 使用，不产出站点 HTML）。
 */
import fs from 'node:fs'
import path from 'node:path'

function extractCellSource(cell) {
  if (!cell) return ''
  return Array.isArray(cell.source) ? cell.source.join('') : cell.source || ''
}

function fence(lang, code) {
  const body = (code ?? '').replace(/\n$/, '')
  return `\`\`\`${lang}\n${body}\n\`\`\`\n`
}

/** ipynb → markdown（markdown / code / raw cells） */
export function ipynbToMarkdown(nbPath) {
  const nb = JSON.parse(fs.readFileSync(nbPath, 'utf-8'))
  const parts = []

  for (const cell of nb.cells || []) {
    const source = extractCellSource(cell)
    if (!source.trim()) continue

    if (cell.cell_type === 'markdown') {
      parts.push(source.replace(/\n$/, '') + '\n')
      continue
    }

    if (cell.cell_type === 'raw') {
      parts.push(fence('', source))
      continue
    }

    if (cell.cell_type !== 'code') continue

    // ##ignore：运行环境 setup，文档中隐藏
    if (source.trimStart().startsWith('##ignore')) continue

    let code = null
    if (source.trimStart().startsWith('##controls')) {
      code = { vue: '', setup: source }
    } else {
      for (const output of cell.outputs || []) {
        if (output.output_type !== 'stream') continue
        if (output.name === 'stderr') continue
        const text = Array.isArray(output.text) ? output.text.join('') : output.text
        if (!text) continue
        try {
          code = JSON.parse(Array.isArray(output.text) ? output.text[0] : text)
          break
        } catch {
          // ignore non-json stream
        }
      }
    }

    if (!code) continue
    if (code.vue) parts.push(fence('vue', code.vue))
    if (code.setup) parts.push(fence('python', code.setup))
  }

  return parts.join('\n').trim() + (parts.length ? '\n' : '')
}

/** 展开单个 :::ipywui-demo 块 */
function expandIpywuiDemo(body, cwd) {
  const sourceFile = body
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('```'))
  if (!sourceFile) {
    return '<!-- ipywui-demo: missing notebook path -->\n'
  }
  const nbPath = path.resolve(cwd, `${sourceFile}.ipynb`)
  if (!fs.existsSync(nbPath)) {
    return `<!-- ipywui-demo: notebook not found: ${nbPath} -->\n`
  }
  return ipynbToMarkdown(nbPath)
}

/** 展开单个 :::textual-vuepy-demo 块 */
function expandTextualDemo(demoName, mdFilePath) {
  const baseDir = path.dirname(mdFilePath)
  const vueFile = path.resolve(baseDir, `${demoName}.vue`)
  if (!fs.existsSync(vueFile)) {
    return `<!-- textual-vuepy-demo: source not found: ${vueFile} -->\n`
  }
  const vueSource = fs.readFileSync(vueFile, 'utf-8').trimEnd()
  return fence('vue', `<!-- ${demoName}.vue -->\n${vueSource}`)
}

const RESERVED_BADGE_RE = /data-text=["']Reserved["']/
const RESERVED_END_RE = /<!--\s*end\s+(?:revered_text|Reserved)\s*-->/i
const HEADING_RE = /^(#{1,6})\s+/

/**
 * 删除预留语法块：
 * - 带 data-text="Reserved" 的标题 → 下一同级/更高级标题之前
 *   （部分文档把 <!-- end revered_text --> 写在 warning 后、正文前，
 *    不能以 end 注释作为块结束，否则会留下无标题的残留正文）
 * - 以「请注意，这是一个预留的语法」开头的 :::warning 容器
 * - 残留的 end 注释与 Reserved 角标
 */
export function stripReservedSections(content) {
  const lines = content.split('\n')
  const out = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const hm = line.match(HEADING_RE)

    if (hm && RESERVED_BADGE_RE.test(line)) {
      const level = hm[1].length
      i++
      while (i < lines.length) {
        const next = lines[i].match(HEADING_RE)
        if (next && next[1].length <= level) break
        i++
      }
      continue
    }

    // :::warning … 预留的语法 … :::（无 Reserved 标题包裹时）
    if (/^:::warning\b/.test(line)) {
      let j = i + 1
      const body = []
      while (j < lines.length && !/^:::\s*$/.test(lines[j])) {
        body.push(lines[j])
        j++
      }
      const bodyText = body.join('\n').trimStart()
      if (bodyText.startsWith('请注意，这是一个预留的语法')) {
        i = j < lines.length ? j + 1 : j
        continue
      }
    }

    if (RESERVED_END_RE.test(line)) {
      i++
      continue
    }

    // 行内残留角标（如列表项里的 Reserved badge）
    out.push(
      line.replace(
        /\s*<sup\b[^>]*data-text=["']Reserved["'][^>]*\s*\/>/g,
        ''
      )
    )
    i++
  }

  return out.join('\n')
}

/**
 * @param {string} content 原始 md
 * @param {{ mdFilePath: string, cwd?: string }} ctx
 */
export function expandDemoMarkdown(content, ctx) {
  const cwd = ctx.cwd ?? process.cwd()
  const mdFilePath = ctx.mdFilePath

  let out = content

  // :::ipywui-demo ... :::
  out = out.replace(
    /^:::ipywui-demo[^\n]*\n([\s\S]*?)^:::\s*$/gm,
    (_m, body) => expandIpywuiDemo(body, cwd)
  )

  // :::textual-vuepy-demo name ... :::
  out = out.replace(
    /^:::textual-vuepy-demo\s+(\S+)[^\n]*\n([\s\S]*?)^:::\s*$/gm,
    (_m, demoName) => expandTextualDemo(demoName.trim(), mdFilePath)
  )

  // 占位标题：内容已由 ipynb 提供真实标题
  out = out.replace(/^##\s+#header-mark#\s*$/gm, '')

  out = stripReservedSections(out)

  // 清理多余空行
  out = out.replace(/\n{3,}/g, '\n\n')

  return out
}
