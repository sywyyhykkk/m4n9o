<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    },
  ],
  meta: [
    {
      name: 'theme-color',
      content: '#090a0b',
    },
  ],
})

useSeoMeta({
  title: 'M4N9O',
  description: 'M4N9O — Personal Lab for the Web',
  ogTitle: 'M4N9O',
  ogDescription: 'M4N9O — Personal Lab for the Web',
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>
