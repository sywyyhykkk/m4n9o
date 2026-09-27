<script setup lang="ts">
const route = useRoute()
const value = route.params.text
const initialText = Array.isArray(value) ? value.join('/') : value
</script>

<template>
  <ClipboardSend :initial-text="initialText" auto-send />
</template>
