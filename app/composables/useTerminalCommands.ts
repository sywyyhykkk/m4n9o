import type { Ref } from 'vue'
import { terminalDirectories } from '~/data/terminal'

export type TerminalTheme = 'amber' | 'blue' | 'green' | 'violet'

type CommandOutput = string[]
type CommandHandlerResult = CommandOutput | Promise<CommandOutput>

interface CommandRequest {
  args: string[]
  raw: string
}

interface CommandDefinition {
  aliases?: string[]
  description: string
  handler: (request: CommandRequest) => CommandHandlerResult
  hidden?: boolean
  name: string
  usage: string
}

interface JokeApiResponse {
  delivery?: string
  error: boolean
  joke?: string
  setup?: string
  type?: 'single' | 'twopart'
}

interface TerminalCommandOptions {
  clearHistory: () => void
  closePage: () => void
  commandHistory: Ref<string[]>
}

const themes: TerminalTheme[] = ['green', 'amber', 'blue', 'violet']

function commandNotFound(value: string): CommandOutput {
  return [`m4n9o: command not found: ${value}`]
}

function formatUptime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts = [
    hours > 0 ? `${hours}h` : '',
    minutes > 0 || hours > 0 ? `${minutes}m` : '',
    `${seconds}s`,
  ]

  return parts.filter(Boolean).join(' ')
}

function noArgs(
  usage: string,
  handler: () => CommandHandlerResult,
): CommandDefinition['handler'] {
  return ({ args }) => args.length === 0 ? handler() : [`Usage: ${usage}`]
}

async function fetchJoke(): Promise<CommandOutput> {
  try {
    const response = await fetch('https://v2.jokeapi.dev/joke/Programming?safe-mode')

    if (!response.ok) {
      throw new Error(`JokeAPI returned ${response.status}`)
    }

    const joke = await response.json() as JokeApiResponse

    if (joke.error) {
      throw new Error('JokeAPI could not find a joke')
    }

    if (joke.type === 'twopart' && joke.setup && joke.delivery) {
      return [joke.setup, joke.delivery]
    }

    if (joke.joke) {
      return [joke.joke]
    }
  }
  catch {
    return ['The joke server is taking comedy too seriously. Try again later.']
  }

  return ['No joke found. The bugs must have fixed it.']
}

export function useTerminalCommands(options: TerminalCommandOptions) {
  const { public: publicConfig } = useRuntimeConfig()
  const theme = ref<TerminalTheme>('green')
  let mountedAt = Date.now()

  function setTheme(name: string): CommandOutput {
    if (!themes.includes(name as TerminalTheme)) {
      return [`Usage: theme <${themes.join('|')}>`]
    }

    theme.value = name as TerminalTheme
    localStorage.setItem('m4n9o-theme', theme.value)

    return [`Theme changed to ${theme.value}.`]
  }

  const commands: CommandDefinition[] = [
    {
      name: 'help',
      usage: 'help',
      description: 'Show this help',
      handler: noArgs('help', () => getHelpLines()),
    },
    {
      name: 'ls',
      usage: 'ls',
      description: 'List directories',
      handler: noArgs('ls', () => [terminalDirectories.map(item => item.name).join('   ')]),
    },
    {
      name: 'whoami',
      usage: 'whoami',
      description: 'Print the current user',
      handler: noArgs('whoami', () => ['mango']),
    },
    {
      name: 'cd',
      usage: 'cd <directory>',
      description: 'Open a directory in a new tab',
      handler: ({ args, raw }) => {
        const directory = args.length === 1
          ? terminalDirectories.find(item => item.name === args[0])
          : undefined

        if (!directory) {
          return commandNotFound(raw)
        }

        window.open(directory.path, '_blank', 'noopener,noreferrer')
        return []
      },
    },
    {
      name: 'tree',
      usage: 'tree',
      description: 'Show the site directory tree',
      handler: noArgs('tree', () => {
        const branches = terminalDirectories.map((directory, index) => {
          const connector = index === terminalDirectories.length - 1 ? '└──' : '├──'

          return `${connector} ${directory.name}/`
        })

        return ['~', ...branches]
      }),
    },
    {
      name: 'history',
      usage: 'history',
      description: 'Show command history',
      handler: noArgs('history', () => options.commandHistory.value.map((item, index) => (
        `${String(index + 1).padStart(3, ' ')}  ${item}`
      ))),
    },
    {
      name: 'date',
      usage: 'date',
      description: 'Show the local date and time',
      handler: noArgs('date', () => [new Date().toString()]),
    },
    {
      name: 'echo',
      usage: 'echo <text>',
      description: 'Print text',
      handler: ({ args }) => [args.join(' ')],
    },
    {
      name: 'uptime',
      usage: 'uptime',
      description: 'Show how long this terminal has been open',
      handler: noArgs('uptime', () => [`up ${formatUptime(Date.now() - mountedAt)}`]),
    },
    {
      name: 'version',
      aliases: ['-v', '--version'],
      usage: '-v | version | --version',
      description: 'Show the current version',
      handler: noArgs('version', () => [publicConfig.appVersion]),
    },
    {
      name: 'theme',
      usage: 'theme <name>',
      description: 'Change the terminal color theme',
      handler: ({ args }) => {
        if (args.length === 0) {
          return [`Current theme: ${theme.value}`, `Available themes: ${themes.join(', ')}`]
        }

        return args.length === 1 ? setTheme(args[0] ?? '') : [`Usage: theme <${themes.join('|')}>`]
      },
    },
    {
      name: 'contact',
      usage: 'contact',
      description: 'Show the contact email',
      handler: noArgs('contact', () => ['joe_zjy@outlook.com']),
    },
    {
      name: 'joke',
      usage: 'joke',
      description: 'Fetch a programming joke',
      handler: noArgs('joke', fetchJoke),
    },
    {
      name: 'coffee',
      usage: 'coffee',
      description: 'Brew some terminal coffee',
      handler: noArgs('coffee', () => [
        '      ( (',
        '       ) )',
        '    ........',
        '    |      |]',
        '    \\      /',
        '     `----\' ',
        'Coffee compiled successfully.',
      ]),
    },
    {
      name: 'banner',
      usage: 'banner <text>',
      description: 'Print text as a banner',
      handler: ({ args }) => {
        if (args.length === 0) {
          return ['Usage: banner <text>']
        }

        const text = args.join(' ').toUpperCase().slice(0, 48)
        const border = '═'.repeat(text.length + 2)

        return [`╔${border}╗`, `║ ${text} ║`, `╚${border}╝`]
      },
    },
    {
      name: 'sudo',
      usage: 'sudo <command>',
      description: 'Try to run a command as root',
      handler: ({ args }) => args.length === 0
        ? ['usage: sudo <command>']
        : ['mango is not in the sudoers file.', 'This incident will be reported. (Just kidding.)'],
    },
    {
      name: 'hack',
      usage: 'hack',
      description: 'Run a harmless hacker simulation',
      handler: noArgs('hack', () => [
        'Initializing totally legitimate hacker mode...',
        '[██████████] 100%',
        'ACCESS GRANTED',
        'Just kidding. No systems were harmed.',
      ]),
    },
    {
      name: 'konami',
      usage: 'konami',
      description: 'Open the hidden easter egg',
      handler: noArgs('konami', () => {
        window.open('https://b23.tv/xGvB7Db', '_blank', 'noopener,noreferrer')
        return ['Easter egg unlocked in a new tab.']
      }),
    },
    {
      name: '42',
      usage: '42',
      description: 'Find the answer',
      handler: noArgs('42', () => ['The answer to life, the universe, and everything.']),
    },
    {
      name: 'reload',
      usage: 'reload',
      description: 'Reload this page',
      handler: noArgs('reload', () => {
        window.location.reload()
        return []
      }),
    },
    {
      name: 'clear',
      usage: 'clear',
      description: 'Clear terminal output',
      handler: noArgs('clear', () => {
        options.clearHistory()
        return []
      }),
    },
    {
      name: 'exit',
      usage: 'exit',
      description: 'Close this page',
      handler: noArgs('exit', () => {
        options.closePage()
        return []
      }),
    },
    {
      name: 'rm',
      usage: 'rm',
      description: '',
      hidden: true,
      handler: ({ raw }) => raw === 'rm -rf /'
        ? ['rm: refusing to remove the universe', 'Nice try. This terminal has survival instincts.']
        : commandNotFound(raw),
    },
  ]

  function getHelpLines(): CommandOutput {
    const visibleCommands = commands.filter(command => !command.hidden)
    const usageWidth = Math.max(...visibleCommands.map(command => command.usage.length))

    return [
      'Available commands:',
      ...visibleCommands.map(command => (
        `  ${command.usage.padEnd(usageWidth + 2)}${command.description}`
      )),
    ]
  }

  function createRegistry() {
    const registry = new Map<string, CommandDefinition>()

    for (const command of commands) {
      for (const name of [command.name, ...(command.aliases ?? [])]) {
        if (registry.has(name)) {
          throw new Error(`Duplicate terminal command: ${name}`)
        }

        registry.set(name, command)
      }
    }

    return registry
  }

  const commandRegistry = createRegistry()

  function runCommand(value: string): CommandHandlerResult {
    const [name = '', ...args] = value.split(/\s+/)
    const command = commandRegistry.get(name)

    return command?.handler({ args, raw: value }) ?? commandNotFound(value)
  }

  onMounted(() => {
    mountedAt = Date.now()
    const storedTheme = localStorage.getItem('m4n9o-theme')

    if (themes.includes(storedTheme as TerminalTheme)) {
      theme.value = storedTheme as TerminalTheme
    }
  })

  return {
    runCommand,
    theme,
  }
}
