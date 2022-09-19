// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  {
    theme: {
      defaultTheme: 'myCustomTheme',
      themes: {
        myCustomTheme: {
          dark: false,
          colors: {
            'primary': '#ff9800',
            'secondary': '#cddc39',
            'accent': '#8bc34a',
            'error': '#f44336',
            'warning': '#e91e63',
            'info': '#00bcd4',
            'success': '#795548',
            'anchor': '#cddc39'
          }
        }
      }
    }
  }
)
