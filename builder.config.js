const isFullBuild = !!process.env.FULLBUILD // true or false
const ICONS_DIR = 'build/icons/'

console.log('Is release?', isFullBuild)

const macOS = {
  mac: {
    target: 'dmg',
    icon: ICONS_DIR + 'icon.icns',
    // hardenedRuntime: true, // Required for MacOS Catalina. Now defaults to true.
    // gatekeeperAssess: false, // Required for MacOS Catalina. Now defaults to false.
    entitlements: 'build/entitlements.mac.plist', // Required for MacOS Catalina
    entitlementsInherit: 'build/entitlements.mac.plist', // Required for MacOS Catalina
    // signIgnore: '/node_modules/playwright/.local-browsers', // Waiting for a way to manually ignore Playwright's browser binaries https://github.com/electron-userland/electron-builder/issues/5500
    // signIgnore: ['.*/node_modules/playwright/.local-browsers'], // https://github.com/electron-userland/electron-builder/pull/5262
  },
  afterSign: isFullBuild ? 'scripts/notarize.js' : null, // Notarize Mac (ONLY for deploys)
  dmg: {
    sign: false, // Required for MacOS Catalina
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications',
      },
      {
        x: 130,
        y: 150,
        type: 'file',
      },
    ],
  },
}

const windowsOS = {
  win: {
    icon: ICONS_DIR + 'icon.ico',
    publisherName: 'Nick Wittwer',
    target: 'nsis',
    // verifyUpdateCodeSignature: false, // Don't codesign https://github.com/electron-userland/electron-builder/issues/2786#issuecomment-383813995
  },
  nsis: {
    differentialPackage: true,
  },
}

// The following will be placed inside of `build: { --> HERE <-- }`
module.exports = {
  productName: require('./package.json').productName,
  appId: 'com.reflex.app',
  // eslint-disable-next-line no-template-curly-in-string
  artifactName: 'Reflex-${version}.${ext}',
  publish: isFullBuild ? ['github'] : null, //  Publish artifacts to Github (release)
  directories: {
    output: 'build',
  },
  files: [
    'package.json',
    {
      from: 'dist/main/',
      to: 'dist/main/',
    },
    {
      from: 'dist/renderer',
      to: 'dist/renderer/',
    },
    {
      from: 'src/resources',
      to: 'dist/resources/',
    },
  ],
  // Copying Playwright's browser binaries (Chromium, Firefox, Webkit) to
  // the final build AND making sure it can be notarized.
  // Extra Resources see: https://stackoverflow.com/a/53011325/1114901
  // https://stackoverflow.com/a/56814459/1114901
  // extraResources: [
  //   {
  //     from: 'node_modules/playwright/.local-browsers',
  //     to: 'app/node_modules/playwright/.local-browsers',
  //     filter: ['**/*'], // Copy all the sub-directories and sub-files
  //   },
  // ],
  // Using ASAR
  // https://github.com/puppeteer/puppeteer/issues/2134#issuecomment-408221446
  // asar: false,
  asar: true, // Whether or not to package
  asarUnpack: 'node_modules/electron-playwright-browser-installer/dist/', // Unpack dir where browser binaries will be installed
  // asarUnpack: ['**/node_modules/playwright/**/*'], // Unpack the browser binaries
  // asarUnpack: ['node_modules/playwright/.local-browsers/'], // Unpack the browser binaries

  // Once unpacked, you can access the Playwright binaries in a few ways (cross-platform compatible)
  // 1. https://github.com/puppeteer/puppeteer/issues/2134#issuecomment-408221446
  // 2.

  // Or... you could try to access the user's own installation of a browser
  // See: https://medium.com/@alexanderruma/using-node-js-puppeteer-and-electronjs-to-create-a-web-scraping-app-with-a-desktop-interface-668493ced47d
  ...macOS,
  ...windowsOS,
}
