<script setup lang="ts">
const props = withDefaults(defineProps<{
  initialText?: string
  autoSend?: boolean
}>(), {
  initialText: '',
  autoSend: false,
})

const text = ref(props.initialText)
const isSending = ref(false)
const state = ref<'idle' | 'saved' | 'error'>('idle')

useSeoMeta({
  title: 'Send text — M4N9O Lab',
  description: 'Send text from one device to another.',
  robots: 'noindex, nofollow',
})

async function send() {
  if (!text.value || isSending.value) return

  isSending.value = true
  state.value = 'idle'

  try {
    await $fetch('/api/clipboard', { method: 'POST', body: { text: text.value } })
    state.value = 'saved'
  }
  catch {
    state.value = 'error'
  }
  finally {
    isSending.value = false
  }
}

onMounted(() => {
  if (props.autoSend) void send()
})
</script>

<template>
  <main class="clipboard-page">
    <div class="clipboard-shell">
      <nav class="clipboard-nav" aria-label="Clipboard navigation">
        <NuxtLink to="/lab">← lab</NuxtLink>
        <span>m4n9o.com/c</span>
      </nav>

      <section class="clipboard-content" aria-labelledby="clipboard-title">
        <p class="clipboard-eyebrow">LAB / 001</p>
        <h1 id="clipboard-title">Send text<span class="cursor">_</span></h1>
        <p class="clipboard-description">Paste or type something here, then open <code>m4n9o.com/p</code> on your other device.</p>

        <form @submit.prevent="send">
          <label for="clipboard-text">Text to transfer</label>
          <textarea
            id="clipboard-text"
            v-model="text"
            autofocus
            spellcheck="false"
            placeholder="Paste text here..."
            :disabled="isSending"
            @input="state = 'idle'"
          />
          <div class="clipboard-actions">
            <span>Public clipboard · clears 10 minutes after saving</span>
            <button type="submit" :disabled="!text || isSending">{{ isSending ? 'Saving...' : 'Save text →' }}</button>
          </div>
        </form>

        <p v-if="state === 'saved'" class="clipboard-message success" role="status">Saved. Open <strong>m4n9o.com/p</strong> on your other device.</p>
        <p v-else-if="state === 'error'" class="clipboard-message error" role="alert">Could not save the text. Please try again.</p>
        <p class="clipboard-note">Anyone who opens /p can read the latest text. Avoid passwords or private information.</p>
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
form { display: grid; gap: .75rem; }
label { color: #8de8a8; font-size: .875rem; }
textarea { box-sizing: border-box; width: 100%; min-height: 14rem; resize: vertical; padding: 1rem; border: 1px solid #31583b; border-radius: .35rem; outline: none; background: #07110a; color: #d9ffe4; font: inherit; line-height: 1.6; }
textarea:focus { border-color: #45f47b; box-shadow: 0 0 0 2px rgb(69 244 123 / .12); }
textarea::placeholder { color: #52735c; }
.clipboard-actions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.clipboard-actions span { color: #52735c; font-size: .75rem; }
button { flex: none; padding: .75rem 1rem; border: 1px solid #45f47b; border-radius: .25rem; background: #45f47b; color: #001908; cursor: pointer; font-weight: 650; }
button:hover:not(:disabled) { background: #8de8a8; }
button:disabled { cursor: not-allowed; opacity: .5; }
.clipboard-message { margin-top: 1.5rem; font-size: .875rem; }
.success { color: #8de8a8; }
.error { color: #ff9c9c; }
.clipboard-note { margin-top: 2rem; color: #52735c; font-size: .75rem; line-height: 1.6; }
@media (max-width: 620px) { .clipboard-page { padding: 1.25rem 1rem 2rem; } .clipboard-content { margin-top: 3.5rem; } .clipboard-actions { align-items: stretch; flex-direction: column; } button { width: 100%; } }
</style>
