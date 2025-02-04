import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: "Izzup",
    description: "Self-managed social",
    base: '/docs/',
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: 'Docs', link: '/' },
      ],

      sidebar: [
        {
          text: 'Cooperatively Owned',
          items: [
            { text: 'Dual Licensing', link: '/cooperatively-owned/licensing' },
            { text: 'Leadership', link: '/cooperatively-owned/leadership' }
          ]
        },
        {
          text: 'Community Managed',
          items: [
            { text: 'Overview', link: '/overview' },
            { text: 'App Flow', link: '/technical-docs/app-flow' }
          ]
        },
        {
          text: 'End User Docs',
          items: [
            { text: 'Overview', link: '/overview' },
            { text: 'App Flow', link: '/technical-docs/app-flow' }
          ]
        },
        {
          text: 'Technical Docs',
          items: [
            { text: 'Data Structure', link: '/technical-docs/data-structure' },
            { text: 'App Flow', link: '/technical-docs/app-flow' }
          ]
        }
      ],

      socialLinks: [
        { icon: 'github', link: 'https://github.com/izzup-world' }
      ]
    }
  })
)