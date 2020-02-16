module.exports = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/I18next.js', ssr: false },
    { src: '~/plugins/VueDeepSet.js', ssr: false },
    { src: '~/plugins/Init.js', ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  styleResources: {
    scss: [
      '~/assets/scss/settings/_settings.variables.scss',
      '~/assets/scss/tools/_tools.chevron.scss'
    ]
  },
  /*
   ** Build configuration
   */
  build: {
    babel: {
      sourceType: 'unambiguous',
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 }
            }
          ]
        ]
      }
    },
    transpile: ['bpmnlint'],
    /*
     ** You can extend webpack config here
     */
    extend(config, _) {
      config.resolve.alias.jointjs$ =
        process.env.NODE_ENV === 'development'
          ? 'jointjs/dist/joint.js'
          : 'jointjs'
      config.module.rules.push({
        test: /\.bpmnlintrc$/,
        use: [
          {
            loader: 'bpmnlint-loader'
          }
        ]
      })
    }
  }
}
