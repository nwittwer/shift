import Vue from 'vue'
import Vuex from 'vuex'

// Configure our Vuex Store
Vue.use(Vuex)

// Make Store accessible from components
export default new Vuex.Store({
  state: {
    url: "",
    panzoom: {}
  },
  mutations: {
    changeURL(state, val) {
      // Update the URL based on the incoming value
      state.url = val;

      // eslint-disable-next-line
      console.log("New URL:", this.state.url);
    },
    updatePanzoom(state, val) {
      state.panzoom = val;
    }
  }
})