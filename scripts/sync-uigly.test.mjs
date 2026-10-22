import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { test } from 'node:test'

const exec = promisify(execFile)

test('syncs local interactive templates and rejects unsupported scripts', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'uigly-sync-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const source = join(root, 'source')
  const script = join(root, 'scripts/sync-uigly.mjs')
  await mkdir(join(root, 'scripts'))
  await mkdir(join(source, 'templates/demo'), { recursive: true })
  await copyFile(new URL('./sync-uigly.mjs', import.meta.url), script)
  await writeFile(join(source, 'templates/catalog.json'), JSON.stringify([
    { id: 'demo', title: 'Demo', category: 'Interaction', description: 'Local demo', previewHeight: 560 },
  ]))

  const run = () => exec(process.execPath, [script], {
    env: { ...process.env, UIGLY_SOURCE_DIR: source },
  })
  const writeTemplate = content => writeFile(join(source, 'templates/demo/index.html'),
    `<!doctype html><html><head><style>body { color: black; }</style></head><body>${content}</body></html>`)

  await t.test('preserves inline interaction code and preview height', async () => {
    await writeTemplate('<button>Run</button><script>document.querySelector("button").addEventListener("click", () => {});</script>')
    const result = await run()
    assert.match(result.stdout, /Synced 1 UIgly template/)
    const output = await readFile(join(root, 'server/api/uigly.get.ts'), 'utf8')
    const templates = JSON.parse(output.split('\n')[0].slice('const templates = '.length))
    assert.equal(templates[0].previewHeight, 560)
    assert.match(templates[0].html, /addEventListener/)
    assert.equal(templates[0].sourceUrl, 'https://github.com/sywyyhykkk/uigly/blob/main/templates/demo/index.html')
  })

  for (const [name, html, expectedError] of [
    ['external scripts', '<script src="https://example.com/demo.js"></script>', /scripts must be inline/],
    ['module scripts', '<script type="module">export {};</script>', /scripts must be inline/],
    ['broken JavaScript', '<script>const broken = ;</script>', /SyntaxError/],
    ['unclosed scripts', '<script>const unfinished = 1;', /incomplete script/],
    ['inline event attributes', '<button onclick="alert(1)">Run</button>', /blocked markup/],
  ]) {
    await t.test(`rejects ${name}`, async () => {
      await writeTemplate(html)
      await assert.rejects(run, expectedError)
    })
  }
})
