const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Lyra✨",
  tagline: "An immutable, edge, full-text search engine",
  url: "https://docs.lyrasearch.io",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "/img/black-hole-light.svg",
  deploymentBranch: "gh-pages",
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "lyrasearch", // Usually your GitHub org/user name.
  projectName: "lyra", // Usually your repo name.
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: "./sidebars.js",
          sidebarCollapsible: false,
          routeBasePath: "/",
          lastVersion: "current",
          versions: {
            current: {
              label: 'v.0.4.0',
              badge: false,
              banner: 'none'
            },
            '0.3.1': {
              label: 'v.0.3.1',
              badge: true,
            }
          },
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: "Lyra Logo",
          src: "/img/lyra-logo-dark.png",
          srcDark: "/img/lyra-logo-white.svg",
        },
        items: [
          {
            href: "https://github.com/nearform/lyra",
            position: "right",
            label: "GitHub",
            "aria-label": "Lyra on GitHub",
          },
          {
            href: "https://join.slack.com/t/lyrasearch/shared_invite/zt-1gzvj0mmt-yJhJ6pnrSGuwqPmPx9uO5Q",
            position: "right",
            label: "Slack",
            "aria-label": "Lyra on Slack",
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
        ],
      },
      metadata: [
        {
          name: "og:image",
          content: "https://lyrasearch.io/images/og-image.png",
        },
        {
          name: "og:title",
          content: "Lyra, a fast, in-memory, typo-tolerant, full-text search engine written in TypeScript.",
        },
      ],
      footer: {
        style: "light",
        copyright: `Copyright © ${new Date().getFullYear()}\n Lyra`,
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  plugins: ["@lyrasearch/plugin-docusaurus"],
};

module.exports = config;
