// Imports
import App from '../../src/App.vue'
import Vuetify from 'vuetify'

// Utilities
import { createLocalVue, mount } from '@vue/test-utils'

describe('App.vue', () => {
  // DO NOT use Vuetify on the localInstance
  // This is bootstrapped in the jest setup
  // file located in ./tests/setup.js
  //
  // localVue.use(Vuetify)

  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('should have a custom title and match snapshot', () => {
    const wrapper = mount(App, {
      localVue,
      vuetify,
      propsData: {},
    })

    expect(wrapper).toBe('Foobar')
  })
})
