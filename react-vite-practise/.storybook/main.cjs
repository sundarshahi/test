const { mergeConfig } = require("vite");
const vitePluginImp = require("vite-plugin-imp");
module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },
  reactOptions: {
    legacyRootApi: false,
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      plugins: [
        vitePluginImp({
          optimize: true,
          libList: [
            {
              libName: "antd",
              libDirectory: "es",
              style: (name) => `antd/es/${name}/style`,
            },
          ],
        }),
      ],
      css: {
        preprocessorOptions: {
          less: {
            javascriptEnabled: true, // 支持内联 JavaScript
          },
        },
      },

      optimizeDeps: {
        include: [
          "@storybook/addon-a11y/preview.js",
          "@storybook/addon-actions/preview.js",
          "@storybook/addon-backgrounds/preview.js",
          "babel-plugin-open-source/script.js",
          "chromatic/isChromatic",
          "storybook-dark-mode",
        ],
      },
    });
  },
};
