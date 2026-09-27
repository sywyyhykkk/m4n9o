<script setup lang="ts">
interface ClipboardValue {
  text: string | null
  expiresAt: string | null
}

const text = ref<string | null>(null)
const status = ref<'loading' | 'empty' | 'copied' | 'manual' | 'error'>('loading')

useSeoMeta({
  title: 'Copy text — M4N9O Lab',
  description: 'Copy text sent from another device.',
  robots: 'noindex, nofollow',
})

async function copy() {
  if (text.value === null) return

  try {
    await navigator.clipboard.writeText(text.value)
    status.value = 'copied'
  }
  catch {
    status.value = 'manual'
    const area = document.getElementById('received-text') as HTMLTextAreaElement | null
    area?.focus()
    area?.select()
  }
}

async function load() {
  status.value = 'loading'

  try {
    const value = await $fetch<ClipboardValue>('/api/clipboard')
    text.value = value.text
    status.value = value.text === null ? 'empty' : 'manual'
    if (value.text !== null) await copy()
  }
  catch {
    status.value = 'error'
  }
}

onMounted(() => { void load() })
</script>

<template>
  <main class="clipboard-page">
    <div class="clipboard-shell">
      <nav class="clipboard-nav" aria-label="Clipboard navigation">
        <NuxtLink to="/lab">← lab</NuxtLink>
        <span>m4n9o.com/p</span>
      </nav>

      <section class="clipboard-content" aria-labelledby="clipboard-title">
        <p class="clipboard-eyebrow">LAB / 001</p>
        <h1 id="clipboard-title">Copy text<span class="cursor">_</span></h1>
        <p class="clipboard-description">Text sent from <code>m4n9o.com/c</code> appears here and is copied to your clipboard when the browser allows it.</p>

        <p v-if="status === 'loading'" class="state-message" role="status">Loading...</p>
        <p v-else-if="status === 'empty'" class="state-message" role="status">The clipboard is empty. Send text from your other device first.</p>
        <p v-else-if="status === 'error'" class="state-message error" role="alert">Could not load the text. Please try again.</p>

        <div v-if="text !== null && status !== 'error' && status !== 'loading'" class="result">
          <label for="received-text">Received text</label>
          <textarea id="received-text" :value="text" readonly aria-label="Received text" />
          <p v-if="status === 'copied'" class="success" role="status">Copied to your clipboard.</p>
          <p v-else class="state-message" role="status">Automatic copying was blocked by your browser. Use the button below or select the text.</p>
          <button type="button" @click="copy">Copy text</button>
        </div>

        <button v-if="status === 'empty' || status === 'error'" type="button" @click="load">Refresh</button>
      </section>
    </div>
  </main>
</template>

<style scoped>
.clipboard-page { min-height: 100dvh; padding: clamp(1.25rem, 4vw, 3.5rem); background: #000; color: #d9ffe4; }
.clipboard-shell { width: min(100%, 62rem); margin: 0 auto; }
.clipboard-nav { display: flex; justify-content: space-between; gap: 1rem; padding-bottom: 1.25rem; border-bottom: 1px solid #1f3526; color: #52735c; font-size: .875rem; }
.clipboard-nav a { color: #8de8a8; text-decoration: none; }
.clipboard-nav a:hover { color: #d9ffe4; }
.clipboard-content { width: min(100%, 42rem); margin: clamp(4rem, 12vh, 8rem) auto 0; }
.clipboard-eyebrow { margin: 0 0 1rem; color: #52735c; font-size: .75rem; letter-spacing: .14em; }
h1 { margin: 0; color: #45f47b; font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 560; letter-spacing: -.05em; }
.cursor { color: #8de8a8; }
.clipboard-description { max-width: 35rem; margin: 1.25rem 0 2.5rem; color: #8da895; line-height: 1.7; }
code { color: #d9ffe4; }
.state-message { margin: 1.5rem 0; color: #8da895; line-height: 1.6; }
.error { color: #ff9c9c; }
.success { margin: 1rem 0; color: #8de8a8; font-size: .875rem; }
.result { display: grid; justify-items: start; gap: .75rem; }
label { color: #8de8a8; font-size: .875rem; }
textarea { box-sizing: border-box; width: 100%; min-height: 14rem; resize: vertical; padding: 1rem; border: 1px solid #31583b; border-radius: .35rem; background: #07110a; color: #d9ffe4; font: inherit; line-height: 1.6; }
button { padding: .75rem 1rem; border: 1px solid #45f47b; border-radius: .25rem; background: #45f47b; color: #001908; cursor: pointer; font-weight: 650; }
button:hover { background: #8de8a8; }
@media (max-width: 620px) { .clipboard-page { padding: 1.25rem 1rem 2rem; } .clipboard-content { margin-top: 3.5rem; } button { width: 100%; } }
</style>
