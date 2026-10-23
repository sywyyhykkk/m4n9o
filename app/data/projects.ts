export interface Project {
  name: string
  repository: string
  role: string
  url: `https://github.com/${string}` | `/${string}`
}

export const projects: Project[] = [
  {
    name: 'Magpie Screen',
    repository: 'sywyyhykkk/magpie-screen',
    role: 'Own project',
    url: 'https://github.com/sywyyhykkk/magpie-screen',
  },
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
