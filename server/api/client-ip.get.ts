export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'private, no-store')

  return {
    ip: getRequestIP(event, { xForwardedFor: true }) ?? null,
  }
})
