import {
  defineConfig,
  getEnv,
  NodeModulesCompilePlugin,
  CrossOriginPlugin,
  RaptorSourceMapUploadPlugin,
  TailwindCssPlugin,
  React18Plugin,
  OwlPlugin,
} from '@finfe/cli2';
import path from 'path';

const raptorProject = 'com.sankuai.finweb.xxx';
const { PUBLIC_PATH } = getEnv();
const publicPath = PUBLIC_PATH ?? `/`;

export default defineConfig({
  entry: './app/src/index.tsx',
  html: './app/src/index.html',
  build: {
    outDir: `./dist`,
    publicPath,
  },
  resolve: {
    alias: {
      'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime.js'),
      'react/jsx-dev-runtime': path.resolve(__dirname, 'node_modules/react/jsx-dev-runtime.js'),
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  server: {
    path: '/training/home',
    port: 6001,
    proxy: {
      target: 'https://finfe.it.test.sankuai.com',
      pathFilter: ['/api', '/portal'],
    },
  },
  plugin: [
    new React18Plugin(),
    new RaptorSourceMapUploadPlugin(raptorProject),
    new CrossOriginPlugin(),
    new NodeModulesCompilePlugin(),
    new TailwindCssPlugin(),
    new OwlPlugin({
      project: raptorProject,
      sailor: false,
      autoCatch: {
        ajax: false,
        fetch: false,
      },
    }),
  ],
});
