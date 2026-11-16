import fs from 'fs'
import path from 'path'
import type { Plugin, SiteConfig } from 'vitepress'
import { expandDemoMarkdown } from './expand-demo-markdown.mjs'

function shouldExclude(relPosix: string): boolean {
  if (relPosix === 'examples' || relPosix.startsWith('examples/')) return true
  if (relPosix.startsWith('tutorial/') && relPosix.endsWith('/description.md')) {
    return true
  }
  return false
}

function collectMarkdownFiles(srcDir: string): string[] {
  const results: string[] = []
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name)
      const rel = path.relative(srcDir, abs).split(path.sep).join('/')
      if (entry.isDirectory()) {
        if (shouldExclude(rel)) continue
        walk(abs)
        continue
      }
      if (!entry.name.endsWith('.md')) continue
      if (shouldExclude(rel)) continue
      results.push(rel)
    }
  }
  walk(srcDir)
  return results
}

/**
 * 把文档 Markdown 经 demo 容器展开后写入 .vitepress/dist_md。
 */
export function emitMarkdownToDistMd(options?: {
  root?: string
  srcDir?: string
  pages?: string[]
}) {
  const root = options?.root ?? process.cwd()
  const srcDir = options?.srcDir ?? path.resolve(root, 'src')
  const outDir = path.resolve(root, '.vitepress/dist_md')

  fs.rmSync(outDir, { recursive: true, force: true })
  fs.mkdirSync(outDir, { recursive: true })

  let rels: string[]
  if (options?.pages?.length) {
    rels = options.pages.map((page) =>
      page.endsWith('.md') ? page : `${page}.md`
    )
  } else {
    rels = collectMarkdownFiles(srcDir)
  }

  let count = 0
  for (const rel of rels) {
    const src = path.join(srcDir, rel)
    if (!fs.existsSync(src)) continue
    const dest = path.join(outDir, rel)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    const raw = fs.readFileSync(src, 'utf-8')
    const expanded = expandDemoMarkdown(raw, { mdFilePath: src, cwd: root })
    // 整页皆为预留语法时跳过，避免产出空文件
    if (!expanded.trim()) continue
    fs.writeFileSync(dest, expanded)
    count++
  }

  console.log(`emit ${count} markdown files → ${outDir}`)
  return count
}

export async function emitMarkdownBuildEnd(siteConfig: SiteConfig) {
  emitMarkdownToDistMd({
    root: siteConfig.root,
    srcDir: siteConfig.srcDir,
    pages: siteConfig.pages,
  })
}

export function emitMarkdownPlugin(): Plugin {
  let done = false
  return {
    name: 'emit-markdown-to-dist-md',
    buildEnd() {
      if (done) return
      done = true
      emitMarkdownToDistMd()
    },
  }
}
