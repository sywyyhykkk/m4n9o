<script setup lang="ts">
import type { TerminalDirectory, TerminalHistoryEntry } from '~/types/terminal'
import { terminalDirectories } from '~/data/terminal'

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

const directoryNames = terminalDirectories.map(directory => directory.name).join('   ')
const helpLines = [
  'Available commands:',
  '  help                 Show this help',
  '  ls                   List directories',
  '  whoami               Print the current user',
  '  cd <directory>       Open a directory in a new tab',
  '  history              Show command history',
  '  date                 Show the local date and time',
  '  clear                Clear terminal output',
  '  exit                 Close this page',
]

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

function findDirectory(name: string): TerminalDirectory | undefined {
  return terminalDirectories.find(directory => directory.name === name)
}

function commandNotFound(value: string) {
  return [`m4n9o: command not found: ${value}`]
}

function runCommand(value: string): string[] {
  const [name, ...args] = value.split(/\s+/)

  if (name === 'help' && args.length === 0) {
    return helpLines
  }

  if (name === 'ls' && args.length === 0) {
    return [directoryNames]
  }

  if (name === 'whoami' && args.length === 0) {
    return ['mango']
  }

  if (name === 'history' && args.length === 0) {
    return commandHistory.value.map((item, index) => (
      `${String(index + 1).padStart(3, ' ')}  ${item}`
    ))
  }

  if (name === 'date' && args.length === 0) {
    return [new Date().toString()]
  }

  if (name === 'exit' && args.length === 0) {
    closePage()
    return []
  }

  if (name === 'cd' && args.length === 1) {
    const directory = findDirectory(args[0] ?? '')

    if (directory) {
      window.open(directory.path, '_blank', 'noopener,noreferrer')
      return []
    }
  }

  return commandNotFound(value)
}

async function submitCommand() {
  const value = command.value.trim().replace(/\s+/g, ' ')

  if (!value) {
    return
  }

  commandHistory.value.push(value)
  commandHistoryIndex = commandHistory.value.length
  commandDraft = ''

  if (value === 'clear') {
    history.value = []
    command.value = ''
    return
  }

  history.value.push({
    id: historyId++,
    command: value,
    output: runCommand(value),
  })
  command.value = ''

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
  <main class="terminal-page">
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
  display: grid;
  min-height: 100dvh;
  padding: 1.25rem;
  background: #000;
  place-items: center;
}

.terminal-window {
  display: grid;
  grid-template-rows: 2.5rem minmax(0, 1fr);
  width: 40vw;
  height: 42vh;
  min-width: 36rem;
  min-height: 22rem;
  overflow: hidden;
  border: 1px solid #2a2d2b;
  border-radius: 0.8rem;
  background: #050706;
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
  border-bottom: 1px solid #292c2a;
  background: #171918;
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
  outline: 2px solid #d9ffe4;
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
  color: #45f47b;
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
  color: #d9ffe4;
  caret-color: #45f47b;
  line-height: inherit;
  outline: 2px solid transparent;
}

.terminal__line--active:focus-within :deep(.terminal-prompt__symbol) {
  color: #d9ffe4;
}

.terminal__output {
  color: #2fbd5b;
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
