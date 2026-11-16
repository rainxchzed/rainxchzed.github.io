---
title: Projects
description: Things I've built and maintain.
wrapperClass: 'text-center'
projects:
  Apps:
    - name: 'Komi Store'
      link: 'https://github.com/komi-store/komi-store'
      desc: 'A cross-platform app store for releases on GitHub, Codeberg and other Forgejo or Gitea forges'
      image: '/komi-store.png'

  Compose:
    - name: 'RikkaUi'
      link: 'https://github.com/rainxchzed/RikkaUi'
      desc: 'A design system and component library for Jetpack Compose, inspired by shadcn/ui'
      icon: 'i-ri-palette-line'
    - name: 'RikkaIcons'
      link: 'https://github.com/rainxchzed/RikkaIcons'
      desc: 'A semantic icon library for Compose Multiplatform'
      icon: 'i-ri-shapes-line'
---

<ListProjects :projects="frontmatter.projects" />
