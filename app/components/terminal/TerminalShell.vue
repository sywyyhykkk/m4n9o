<script setup lang="ts">
import type { TerminalHistoryEntry } from '~/types/terminal'
import { useTerminalCommands } from '~/composables/useTerminalCommands'

const command = ref('')
const promptTime = ref<string | null>(null)
const history = ref<TerminalHistoryEntry[]>([])
const commandHistory = ref<string[]>([])
const isMaximized = ref(false)
const input = useTemplateRef<HTMLInputElement>('input')
const screen = useTemplateRef<HTMLElement>('screen')

let historyId = 0
let commandHistoryIndex = 0
let commandDraft = ''

const { runCommand, theme } = useTerminalCommands({
  clearHistory: () => {
    history.value = []
  },
  closePage,
  commandHistory,
})

function formatPromptTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0')

  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    ' ',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('')
}

async function submitCommand() {
  const value = command.value.trim().replace(/\s+/g, ' ')

  if (!value) {
    return
  }

  commandHistory.value.push(value)
  commandHistoryIndex = commandHistory.value.length
  commandDraft = ''

  const entry: TerminalHistoryEntry = {
    id: historyId++,
    command: value,
    output: ['Working...'],
  }

  history.value.push(entry)
  command.value = ''

  const outputPromise = runCommand(value)

  await nextTick()
  const output = await outputPromise
  const pendingEntry = history.value.find(item => item.id === entry.id)

  if (pendingEntry) {
    pendingEntry.output = output
  }

  await nextTick()
  screen.value?.scrollTo({
    top: screen.value.scrollHeight,
    behavior: 'smooth',
  })
}

async function navigateCommandHistory(direction: 'previous' | 'next') {
  const historyLength = commandHistory.value.length

  if (historyLength === 0) {
    return
  }

  if (direction === 'previous') {
    if (commandHistoryIndex === historyLength) {
      commandDraft = command.value
    }

    if (commandHistoryIndex > 0) {
      commandHistoryIndex -= 1
    }
  }
  else {
    if (commandHistoryIndex >= historyLength) {
      return
    }

    commandHistoryIndex += 1
  }

  command.value = commandHistoryIndex === historyLength
    ? commandDraft
    : (commandHistory.value[commandHistoryIndex] ?? '')

  await nextTick()
  input.value?.setSelectionRange(command.value.length, command.value.length)
}

function focusInput() {
  input.value?.focus()
}

function closePage() {
  window.close()

  window.setTimeout(() => {
    if (!window.closed) {
      window.location.replace('about:blank')
    }
  }, 100)
}

function toggleMaximized() {
  isMaximized.value = !isMaximized.value

  nextTick(() => {
    focusInput()
  })
}

onMounted(async () => {
  promptTime.value = formatPromptTime(new Date())
  await nextTick()
  focusInput()
})
</script>

<template>
  <main
    class="terminal-page"
    :class="`terminal-page--theme-${theme}`"
  >
    <section
      class="terminal-window"
      :class="{ 'terminal-window--maximized': isMaximized }"
      aria-label="M4N9O terminal"
    >
      <header
        class="terminal-window__titlebar"
        @dblclick="toggleMaximized"
      >
        <div class="terminal-window__controls">
          <button
            type="button"
            class="terminal-window__control terminal-window__control--close"
            aria-label="Close page"
            title="Close"
            @click.stop="closePage"
          />
          <button
            type="button"
            class="terminal-window__control terminal-window__control--maximize"
            :aria-label="isMaximized ? 'Restore terminal window' : 'Maximize terminal window'"
            :title="isMaximized ? 'Restore' : 'Maximize'"
            @click.stop="toggleMaximized"
          />
        </div>
      </header>

      <div
        ref="screen"
        class="terminal"
        @click="focusInput"
      >
        <div
          v-for="entry in history"
          :key="entry.id"
          class="terminal__entry"
        >
          <div class="terminal__line">
            <TerminalPrompt :time="promptTime ?? '0000-00-00 00:00'" />
            <span>{{ entry.command }}</span>
          </div>

          <div
            v-for="(line, index) in entry.output"
            :key="index"
            class="terminal__output"
          >
            {{ line }}
          </div>
        </div>

        <form
          class="terminal__line terminal__line--active"
          :class="{ 'terminal__line--ready': promptTime !== null }"
          @submit.prevent="submitCommand"
        >
          <label for="terminal-command" class="sr-only">Terminal command</label>
          <TerminalPrompt
            :time="promptTime ?? '0000-00-00 00:00'"
            aria-hidden="true"
          />
          <input
            id="terminal-command"
            ref="input"
            v-model="command"
            class="terminal__input"
            type="text"
            name="command"
            autocomplete="off"
            autocapitalize="none"
            spellcheck="false"
            enterkeyhint="send"
            @keydown.up.prevent="navigateCommandHistory('previous')"
            @keydown.down.prevent="navigateCommandHistory('next')"
          >
        </form>

        <p class="sr-only" aria-live="polite">
          {{ history.at(-1)?.output.join(' ') }}
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.terminal-page {
  --terminal-page-bg: #000;
  --terminal-window-bg: #050706;
  --terminal-titlebar-bg: #171918;
  --terminal-border: #2a2d2b;
  --terminal-titlebar-border: #292c2a;
  --terminal-text: #45f47b;
  --terminal-output: #2fbd5b;
  --terminal-bright: #d9ffe4;
  --terminal-muted: #52735c;

  display: grid;
  min-height: 100dvh;
  padding: 1.25rem;
  background: var(--terminal-page-bg);
  transition: background-color 180ms ease;
  place-items: center;
}

.terminal-page--theme-amber {
  --terminal-page-bg: #090600;
  --terminal-window-bg: #0d0a04;
  --terminal-titlebar-bg: #1d170b;
  --terminal-border: #58451e;
  --terminal-titlebar-border: #473817;
  --terminal-text: #ffc857;
  --terminal-output: #d9a83e;
  --terminal-bright: #fff1c2;
  --terminal-muted: #8c7445;
}

.terminal-page--theme-blue {
  --terminal-page-bg: #00060b;
  --terminal-window-bg: #030a10;
  --terminal-titlebar-bg: #0b1821;
  --terminal-border: #1d4f68;
  --terminal-titlebar-border: #163e52;
  --terminal-text: #57d7ff;
  --terminal-output: #36a8d0;
  --terminal-bright: #d8f7ff;
  --terminal-muted: #477486;
}

.terminal-page--theme-violet {
  --terminal-page-bg: #08030c;
  --terminal-window-bg: #0d0711;
  --terminal-titlebar-bg: #1b1021;
  --terminal-border: #563169;
  --terminal-titlebar-border: #432652;
  --terminal-text: #d98cff;
  --terminal-output: #ad67cf;
  --terminal-bright: #f8e4ff;
  --terminal-muted: #80628d;
}

.terminal-window {
  display: grid;
  grid-template-rows: 2.5rem minmax(0, 1fr);
  width: 40vw;
  height: 42vh;
  min-width: 36rem;
  min-height: 22rem;
  overflow: hidden;
  border: 1px solid var(--terminal-border);
  border-radius: 0.8rem;
  background: var(--terminal-window-bg);
  box-shadow: 0 1.5rem 5rem rgb(0 0 0 / 0.6);
  transition:
    width 220ms ease,
    height 220ms ease;
}

.terminal-window--maximized {
  width: 70vw;
  height: 70vh;
}

.terminal-window__titlebar {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 0.9rem;
  border-bottom: 1px solid var(--terminal-titlebar-border);
  background: var(--terminal-titlebar-bg);
  user-select: none;
}

.terminal-window__controls {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.terminal-window__control {
  width: 0.78rem;
  height: 0.78rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  transition:
    filter 140ms ease,
    transform 140ms ease;
}

.terminal-window__control:hover {
  filter: brightness(1.12);
}

.terminal-window__control:active {
  transform: scale(0.9);
}

.terminal-window__control:focus-visible {
  outline: 2px solid var(--terminal-bright);
  outline-offset: 3px;
}

.terminal-window__control--close {
  background: #ff5f57;
}

.terminal-window__control--maximize {
  background: #28c840;
}

.terminal {
  min-height: 0;
  overflow: auto;
  padding: 1.1rem 1.25rem 1.4rem;
  color: var(--terminal-text);
  font-size: clamp(0.82rem, 1vw, 0.98rem);
  line-height: 1.7;
  letter-spacing: 0.01em;
}

.terminal__entry + .terminal__entry,
.terminal__entry + .terminal__line {
  margin-top: 0.4rem;
}

.terminal__line {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  min-width: 0;
}

.terminal__line--active {
  visibility: hidden;
}

.terminal__line--ready {
  visibility: visible;
}

.terminal__input {
  min-width: 4rem;
  flex: 1;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--terminal-bright);
  caret-color: var(--terminal-text);
  font-size: 1rem;
  line-height: inherit;
  outline: 2px solid transparent;
}

.terminal__line--active:focus-within :deep(.terminal-prompt__symbol) {
  color: var(--terminal-bright);
}

.terminal__output {
  color: var(--terminal-output);
  white-space: pre-wrap;
}

@media (max-width: 540px) {
  .terminal-window,
  .terminal-window--maximized {
    width: calc(100vw - 2rem);
    min-width: 0;
  }

  .terminal-window {
    height: 55vh;
  }

  .terminal-window--maximized {
    height: 78vh;
  }

  .terminal {
    font-size: 0.82rem;
  }

  .terminal__line {
    gap: 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .terminal-window,
  .terminal-window__control {
    transition: none;
  }
}

@media (max-width: 359px) {
  .terminal__line {
    flex-wrap: wrap;
  }

  .terminal__input {
    flex-basis: 100%;
  }
}
</style>
