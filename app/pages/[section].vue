<script setup lang="ts">
import { terminalDirectories } from '~/data/terminal'

const route = useRoute()
const section = Array.isArray(route.params.section)
  ? route.params.section[0]
  : route.params.section

const directory = terminalDirectories.find(item => item.name === section)

if (!directory) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Directory not found',
  })
}

useSeoMeta({
  title: `${directory.name} — WIP`,
  description: `${directory.name} is a work in progress on M4N9O.`,
  ogTitle: `${directory.name} — WIP`,
  ogDescription: `${directory.name} is a work in progress on M4N9O.`,
})
</script>

<template>
  <main class="wip-page">
    <section class="wip-shell" :aria-labelledby="`${directory.name}-title`">
      <TerminalSectionHeader :section="directory.name" />

      <div class="wip-content">
        <p class="wip-path">./{{ directory.name }}</p>
        <h1 :id="`${directory.name}-title`">WIP</h1>
      </div>
    </section>
  </main>
</template>

<style scoped>
.wip-page {
  min-height: 100dvh;
  padding: clamp(1.25rem, 4vw, 3.5rem);
  background: #000;
  color: #d9ffe4;
}

.wip-shell {
  width: min(100%, 62rem);
  margin: 0 auto;
}

.wip-content {
  display: grid;
  min-height: calc(100dvh - clamp(7rem, 12vw, 10rem));
  place-content: center;
  text-align: center;
}

.wip-path {
  margin: 0 0 0.75rem;
  color: #52735c;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
}

.wip-content h1 {
  margin: 0;
  color: #45f47b;
  font-size: clamp(2rem, 7vw, 4.5rem);
  font-weight: 560;
  letter-spacing: -0.04em;
}

@media (max-width: 620px) {
  .wip-page {
    padding: 1.25rem 1rem 2rem;
  }
}
</style>
