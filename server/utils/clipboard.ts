export interface ClipboardValue {
  text: string | null
  expiresAt: string | null
}

function clipboardConfig(event: Parameters<typeof useRuntimeConfig>[0]) {
  const { clipboardServiceUrl, clipboardServiceToken } = useRuntimeConfig(event)

  if (!clipboardServiceUrl || !clipboardServiceToken) {
    throw createError({ statusCode: 503, statusMessage: 'Clipboard service is not configured' })
  }

  return {
    url: `${clipboardServiceUrl.replace(/\/$/, '')}/clipboard`,
    headers: { 'x-clipboard-token': clipboardServiceToken },
  }
}

export async function readClipboard(event: Parameters<typeof useRuntimeConfig>[0]): Promise<ClipboardValue> {
  const { url, headers } = clipboardConfig(event)

  try {
    return await $fetch<ClipboardValue>(url, { headers })
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'Clipboard service is unavailable' })
  }
}

export async function writeClipboard(event: Parameters<typeof useRuntimeConfig>[0], text: string): Promise<ClipboardValue> {
  const { url, headers } = clipboardConfig(event)

  try {
    return await $fetch<ClipboardValue>(url, { method: 'POST', headers, body: { text } })
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'Clipboard service is unavailable' })
  }
}
