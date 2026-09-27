import { readClipboard } from '../utils/clipboard'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  return await readClipboard(event)
})
