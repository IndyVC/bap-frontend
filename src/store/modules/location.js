import axios from "axios";

const state = {
  locations: []
};

const getters = {
  getLocations: state => state.locations
};

const actions = {
  async $fetchLocations({ commit }) {
    const response = await axios.get(
      "https://indy-bap-backend.herokuapp.com/api/locations"
    );
    commit("SET_LOCATIONS", response.data.data);
  }
};

const mutations = {
  SET_LOCATIONS: (state, locs) => (state.locations = locs)
};

export default {
  state,
  getters,
  actions,
  mutations
};
