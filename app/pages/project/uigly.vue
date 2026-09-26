<script setup lang="ts">
interface UiglyTemplate {
  id: string
  title: string
  category: string
  description: string
  html: string
  sourceUrl: string
  previewHeight?: number
}

useSeoMeta({
  title: 'UIgly — M4N9O',
  description: 'A collection of UI mistakes found in everyday development, shown with plain HTML and CSS.',
  ogTitle: 'UIgly — M4N9O',
  ogDescription: 'A collection of UI mistakes found in everyday development, shown with plain HTML and CSS.',
})

const { data: templates, error } = await useFetch<UiglyTemplate[]>('/api/uigly')
</script>

<template>
  <main class="uigly-page">
    <div class="uigly-shell">
      <TerminalSectionHeader section="project" />

      <NuxtLink class="uigly-back" to="/project">
        ← Back to projects
      </NuxtLink>

      <header class="uigly-intro">
        <p class="uigly-eyebrow">./project/uigly</p>
        <h1>UIgly</h1>
        <div class="uigly-contribute">
          <span>想要献丑？</span>
          <a href="https://github.com/sywyyhykkk/uigly" target="_blank" rel="noopener noreferrer">Contribute on GitHub ↗</a>
        </div>
      </header>

      <p v-if="error" class="uigly-state">Templates are temporarily unavailable.</p>
      <p v-else-if="!templates?.length" class="uigly-state">No templates yet.</p>

      <section v-for="(template, index) in templates" :key="template.id" class="uigly-template">
        <div class="uigly-template__heading">
          <span class="uigly-template__number">{{ String(index + 1).padStart(2, '0') }} / {{ template.category }}</span>
          <h2>{{ template.title }}</h2>
          <p>{{ template.description }}</p>
        </div>

        <div class="uigly-preview">
          <div class="uigly-preview__bar">LIVE PREVIEW · HTML + CSS</div>
          <div class="uigly-preview__viewport" :style="template.previewHeight ? { '--preview-height': `${template.previewHeight}px` } : undefined">
            <iframe :title="`${template.title} preview`" :srcdoc="template.html" sandbox="" loading="lazy" />
          </div>
        </div>

        <details class="uigly-source">
          <summary>View HTML and CSS</summary>
          <pre><code>{{ template.html }}</code></pre>
        </details>
        <a class="uigly-source-link" :href="template.sourceUrl" target="_blank" rel="noopener noreferrer">View source on GitHub ↗</a>
      </section>
    </div>
  </main>
</template>

<style scoped>
.uigly-page {
  min-height: 100dvh;
  padding: clamp(1.25rem, 4vw, 3.5rem);
  background: radial-gradient(circle at 50% 0%, rgb(28 76 42 / 0.18), transparent 38rem), #000;
  color: #d9ffe4;
}

.uigly-shell { width: min(100%, 62rem); margin: 0 auto; }
.uigly-back, .uigly-intro a, .uigly-source-link { color: #45f47b; text-decoration: none; }
.uigly-back { display: inline-block; margin-top: 2.5rem; }
.uigly-back:hover, .uigly-intro a:hover, .uigly-source-link:hover { text-decoration: underline; }
.uigly-intro { padding: clamp(2rem, 7vw, 5rem) 0 3rem; }
.uigly-eyebrow, .uigly-template__number { color: #45f47b; font-size: 0.85rem; letter-spacing: 0.08em; }
.uigly-intro h1 { margin: 0.5rem 0 1rem; font-size: clamp(3.5rem, 12vw, 7rem); font-weight: 560; letter-spacing: -0.075em; line-height: 1; }
.uigly-contribute { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.35rem 0.75rem; margin-top: 1rem; }
.uigly-contribute span { color: #91ae99; }
.uigly-state { color: #91ae99; }
.uigly-template { margin-bottom: 4rem; border-top: 1px solid #2a4933; padding-top: 2rem; }
.uigly-template__heading h2 { margin: 0.6rem 0; font-size: clamp(1.5rem, 4vw, 2.25rem); }
.uigly-template__heading p { margin: 0 0 1.5rem; color: #91ae99; }
.uigly-preview { overflow: hidden; border: 1px solid #34553e; border-radius: 0.5rem; background: #f4f3ef; }
.uigly-preview__bar { padding: 0.65rem 1rem; background: #102018; color: #91ae99; font-size: 0.75rem; letter-spacing: 0.08em; }
.uigly-preview__viewport { height: var(--preview-height, 420px); min-height: 420px; max-height: 760px; resize: vertical; overflow: auto; }
.uigly-preview iframe { display: block; width: 100%; height: 100%; border: 0; }
.uigly-source { margin-top: 1rem; border: 1px solid #2a4933; border-radius: 0.4rem; }
.uigly-source summary { padding: 0.8rem 1rem; color: #45f47b; cursor: pointer; }
.uigly-source pre { max-height: 30rem; overflow: auto; margin: 0; padding: 1rem; border-top: 1px solid #2a4933; color: #d9ffe4; font-size: 0.82rem; line-height: 1.5; }
.uigly-source-link { display: inline-block; margin-top: 1rem; }

@media (max-width: 600px) {
  .uigly-preview__viewport { min-height: 380px; height: var(--preview-height, 380px); }
}
</style>
