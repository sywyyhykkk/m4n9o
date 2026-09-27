import { writeClipboard } from '../utils/clipboard'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')

  const body = await readBody<{ text?: unknown }>(event)
  if (typeof body?.text !== 'string' || body.text.length === 0 || new TextEncoder().encode(body.text).length > 32768) {
    throw createError({ statusCode: 400, statusMessage: 'Text must be between 1 and 32768 bytes' })
  }

  return await writeClipboard(event, body.text)
})
