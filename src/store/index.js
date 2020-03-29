import Vue from "vue";
import Vuex from "vuex";
//modules
import location from "./modules/location";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    location
  }
});
