export interface TerminalDirectory {
  name: 'project' | 'lab' | 'notes' | 'contact'
  path: `/${string}`
}

export interface TerminalHistoryEntry {
  id: number
  command: string
  output: string[]
}
