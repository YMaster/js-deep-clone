const config = {
  presets: [
    ['@babel/preset-env', {
      // modules: false,
      targets: {
        chrome: 36,
        ie: 11,
        firefox: 36,
        safari: 20,
        node: 10,
      }
    }],
    '@babel/typescript'
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 3
      }
    ]
  ]
}

module.exports = config