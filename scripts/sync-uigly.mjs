import { mkdir, writeFile } from 'node:fs/promises'

const source = 'https://raw.githubusercontent.com/sywyyhykkk/uigly/main'
const output = new URL('../public/uigly/catalog.json', import.meta.url)

async function readSource(path) {
  const response = await fetch(`${source}/${path}`, { signal: AbortSignal.timeout(15000) })
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

  return {
    ...template,
    html: await readSource(`templates/${template.id}/index.html`),
    sourceUrl: `https://github.com/sywyyhykkk/uigly/blob/main/templates/${template.id}/index.html`,
  }
}))

await mkdir(new URL('.', output), { recursive: true })
await writeFile(output, `${JSON.stringify(templates)}\n`)
console.log(`Synced ${templates.length} UIgly template(s)`)
