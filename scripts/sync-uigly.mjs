import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Script } from 'node:vm'

const source = 'https://raw.githubusercontent.com/sywyyhykkk/uigly/main'
const localSource = process.env.UIGLY_SOURCE_DIR
const output = new URL('../server/api/uigly.get.ts', import.meta.url)
const buildRequest = Date.now()

async function readSource(path) {
  if (localSource) {
    return readFile(resolve(localSource, path), 'utf8')
  }
  const response = await fetch(`${source}/${path}?build=${buildRequest}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) {
    throw new Error(`Could not read UIgly ${path}: HTTP ${response.status}`)
  }
  return response.text()
}

const catalog = JSON.parse(await readSource('templates/catalog.json'))
if (!Array.isArray(catalog) || catalog.length === 0) {
  throw new Error('UIgly catalog is empty')
}

const templates = await Promise.all(catalog.map(async (template) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(template.id ?? '')) {
    throw new Error(`Invalid UIgly template id: ${template.id}`)
  }
  if (template.previewHeight !== undefined && (!Number.isInteger(template.previewHeight) || template.previewHeight < 420 || template.previewHeight > 760)) {
    throw new Error(`Invalid UIgly preview height: ${template.id}`)
  }

  const html = await readSource(`templates/${template.id}/index.html`)
  if (!/^<!doctype html>/i.test(html.trimStart()) || !/<style\b/i.test(html)) {
    throw new Error(`UIgly ${template.id} is not a standalone HTML template with inline CSS`)
  }
  if (/<link\b|<iframe\b|\son[a-z]+\s*=|javascript:|@import\b|url\s*\(/i.test(html)) {
    throw new Error(`UIgly ${template.id} contains blocked markup or URLs`)
  }
  // Match UIgly's validator: allow classic inline scripts, never external scripts.
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
  if (scripts.length !== (html.match(/<script\b/gi) ?? []).length) {
    throw new Error(`UIgly ${template.id} contains an incomplete script element`)
  }
  for (const [, attributes, script] of scripts) {
    if (attributes.trim()) {
      throw new Error(`UIgly ${template.id} scripts must be inline and have no attributes`)
    }
    new Script(script, { filename: `templates/${template.id}/index.html` })
  }

  return {
    ...template,
    html,
    sourceUrl: `https://github.com/sywyyhykkk/uigly/blob/main/templates/${template.id}/index.html`,
  }
}))

await mkdir(new URL('.', output), { recursive: true })
await writeFile(output, `const templates = ${JSON.stringify(templates)}\n\nexport default defineEventHandler(() => templates)\n`)
console.log(`Synced ${templates.length} UIgly template(s)`)
