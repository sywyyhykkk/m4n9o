<script setup lang="ts">
import type { TerminalDirectory } from '~/types/terminal'

withDefaults(defineProps<{
  command?: string
  section: TerminalDirectory['name']
}>(), {
  command: 'tree',
})
</script>

<template>
  <header class="section-header">
    <NuxtLink class="section-header__home" to="/">
      <span aria-hidden="true">←</span>
      cd ~
    </NuxtLink>

    <p class="section-header__command" aria-hidden="true">
      <span class="section-header__user">mango</span><span class="section-header__muted">@</span><span class="section-header__host">m4n9o</span><span class="section-header__path">:~/{{ section }}</span>
      <span class="section-header__symbol">$</span>
      {{ command }}
    </p>
  </header>
</template>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #1f3526;
  font-size: 0.875rem;
}

.section-header__home {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: #8de8a8;
  text-decoration: none;
}

.section-header__home:hover,
.section-header__home:focus-visible {
  color: #d9ffe4;
}

.section-header__home:focus-visible {
  border-radius: 0.2rem;
  outline: 2px solid #45f47b;
  outline-offset: 4px;
}

.section-header__command {
  margin: 0;
  color: #45f47b;
  white-space: nowrap;
}

.section-header__user,
.section-header__symbol {
  color: #45f47b;
  font-weight: 650;
}

.section-header__muted {
  color: #52735c;
}

.section-header__host {
  color: #8de8a8;
}

.section-header__path {
  color: #38c864;
}

.section-header__symbol {
  margin: 0 0.5rem;
}

@media (max-width: 620px) {
  .section-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.85rem;
  }

  .section-header__command {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
