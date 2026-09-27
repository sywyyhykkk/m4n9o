<script setup lang="ts">
useSeoMeta({
  title: 'Lab — M4N9O',
  description: 'Small experiments and useful tools by Mango.',
})
</script>

<template>
  <main class="lab-page">
    <section class="lab-shell" aria-labelledby="lab-title">
      <TerminalSectionHeader section="lab" />

      <div class="lab-intro">
        <p class="lab-path">./lab</p>
        <h1 id="lab-title">Lab</h1>
        <p>Small things made to be used.</p>
      </div>

      <article class="lab-card">
        <span class="lab-card__number">001</span>
        <div>
          <h2>Cross-device clipboard</h2>
          <p>Send text on one device. Copy it on another. Clears after 10 minutes.</p>
          <div class="lab-card__links">
            <NuxtLink to="/c">Send text ↗</NuxtLink>
            <NuxtLink to="/p">Copy text ↗</NuxtLink>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.lab-page { min-height: 100dvh; padding: clamp(1.25rem, 4vw, 3.5rem); background: #000; color: #d9ffe4; }
.lab-shell { width: min(100%, 62rem); margin: 0 auto; }
.lab-intro { margin: clamp(3rem, 8vh, 6rem) 0 2.5rem; }
.lab-path { margin: 0 0 .75rem; color: #52735c; font-size: .875rem; }
.lab-intro h1 { margin: 0; color: #45f47b; font-size: clamp(2.5rem, 7vw, 4.5rem); font-weight: 560; letter-spacing: -.05em; }
.lab-intro > p:last-child { color: #8da895; }
.lab-card { display: grid; grid-template-columns: 3.5rem 1fr; gap: 1rem; padding: 1.5rem; border: 1px solid #1f3526; border-radius: .35rem; background: #07110a; }
.lab-card__number { color: #52735c; font-size: .875rem; }
.lab-card h2 { margin: 0; color: #d9ffe4; font-size: 1.25rem; font-weight: 560; }
.lab-card p { margin: .75rem 0 1.5rem; color: #8da895; line-height: 1.6; }
.lab-card__links { display: flex; flex-wrap: wrap; gap: 1.5rem; }
.lab-card__links a { color: #45f47b; text-decoration: none; }
.lab-card__links a:hover { color: #8de8a8; }
@media (max-width: 620px) { .lab-page { padding: 1.25rem 1rem 2rem; } .lab-card { grid-template-columns: 1fr; } }
</style>
