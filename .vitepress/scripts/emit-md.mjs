#!/usr/bin/env node
/**
 * 不跑完整 VitePress build，展开 demo 容器后写出 .vitepress/dist_md。
 * 用法: pnpm build:md
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expandDemoMarkdown } from '../plugins/expand-demo-markdown.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

function shouldExclude(relPosix) {
  if (relPosix === 'examples' || relPosix.startsWith('examples/')) return true
  if (relPosix.startsWith('tutorial/') && relPosix.endsWith('/description.md')) {
    return true
  }
  return false
}

function collectMarkdownFiles(srcDir) {
  const results = []
  const walk = (dir) => {
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

const srcDir = path.join(root, 'src')
const outDir = path.join(root, '.vitepress/dist_md')
fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })

let count = 0
for (const rel of collectMarkdownFiles(srcDir)) {
  const src = path.join(srcDir, rel)
  const dest = path.join(outDir, rel)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  const raw = fs.readFileSync(src, 'utf-8')
  const expanded = expandDemoMarkdown(raw, { mdFilePath: src, cwd: root })
  if (!expanded.trim()) continue
  fs.writeFileSync(dest, expanded)
  count++
}
console.log(`emit ${count} markdown files → ${outDir}`)
