export interface Project {
  name: string
  repository: string
  role: string
  url: `https://github.com/${string}` | `/${string}`
}

export const projects: Project[] = [
  {
    name: 'UIgly',
    repository: 'sywyyhykkk/uigly',
    role: 'Own project',
    url: '/project/uigly',
  },
  {
    name: 'another-me',
    repository: 'sywyyhykkk/another-me',
    role: 'Contributed project',
    url: 'https://github.com/sywyyhykkk/another-me',
  },
]
