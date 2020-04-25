import axios from "axios";

const state = {
  locations: [],
  gsm: [],
  poc: [],
};

const getters = {
  getLocations: (state) => state.locations,
  getGSM: (state) => state.gsm,
  getPOC: (state) => state.poc,
};

const actions = {
  async $fetchLocations({ commit }) {
    const response = await axios.get(
      "https://indy-bap-backend.herokuapp.com/api/locations"
    );
    commit("SET_LOCATIONS", response.data.data);
  },

  async $deleteLocations({ commit }) {
    await axios.delete("https://indy-bap-backend.herokuapp.com/api/locations");
    commit("SET_LOCATIONS", []);
  },
};

const mutations = {
  SET_LOCATIONS: (state, locs) => {
    state.locations = locs;
    state.gsm = locs.filter((l) => l.device == "gsm");
    state.poc = locs.filter((l) => l.device == "poc");
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
