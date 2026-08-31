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
    <p>WIP</p>
  </main>
</template>

<style scoped>
.wip-page {
  display: grid;
  min-height: 100dvh;
  padding: 1.5rem;
  background: #000;
  color: #45f47b;
  font-size: clamp(1rem, 2vw, 1.25rem);
  letter-spacing: 0.08em;
  place-items: center;
}
</style>
