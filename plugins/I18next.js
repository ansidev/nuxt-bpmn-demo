import Vue from 'vue'
import i18next from 'i18next'
import VueI18Next from '@panter/vue-i18next'

import translations from '~/setup/translations.json'

Vue.use(VueI18Next)

i18next.init({
  lng: 'en',
  resources: { en: { translation: translations } }
})

const i18n = new VueI18Next(i18next)

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n
}
