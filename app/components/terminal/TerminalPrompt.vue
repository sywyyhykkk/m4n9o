<script setup lang="ts">
defineProps<{
  time: string
}>()
</script>

<template>
  <span class="terminal-prompt">
    <span class="terminal-prompt__time">[{{ time }}]</span>
    <span class="terminal-prompt__user">mango</span><span class="terminal-prompt__separator">@</span><span class="terminal-prompt__host">m4n9o</span><span class="terminal-prompt__path">:~</span>
    <span class="terminal-prompt__symbol">$</span>
  </span>
</template>

<style scoped>
.terminal-prompt {
  display: inline-flex;
  flex: none;
  align-items: baseline;
  white-space: nowrap;
}

.terminal-prompt__time {
  margin-right: 0.65rem;
  color: var(--terminal-muted, #52735c);
}

.terminal-prompt__user {
  color: var(--terminal-text, #45f47b);
  font-weight: 600;
}

.terminal-prompt__separator {
  color: var(--terminal-muted, #52735c);
}

.terminal-prompt__host {
  color: var(--terminal-bright, #8de8a8);
}

.terminal-prompt__path {
  color: var(--terminal-output, #38c864);
}

.terminal-prompt__symbol {
  margin-left: 0.55rem;
  color: var(--terminal-output, #2fbd5b);
}
</style>
