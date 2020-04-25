import axios from "axios";

const state = {
  locations: [],
  gsm: [],
  poc: [],
  show: 0, //0 = all, 1 = poc, 2 = gsm
  showMarkers: true,
};

const getters = {
  getLocations: (state) => state.locations,
  getGSM: (state) => state.gsm,
  getPOC: (state) => state.poc,
  getShow: (state) => state.show,
  getShowMarkers: (state) => state.showMarkers,
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
  $setShow({ commit }, payload) {
    commit("SET_SHOW", payload);
  },
  $toggleMarkers({ commit, state }) {
    const bool = state.showMarkers;
    commit("SET_SHOW_MARKERS", !bool);
  },
};

const mutations = {
  SET_LOCATIONS: (state, locs) => {
    state.locations = locs;
    state.gsm = locs
      .filter((l) => l.device == "gsm")
      .map((loc) => {
        return {
          lat: Number(loc.latitude),
          lng: Number(loc.longitude),
          date: new Date(loc.createdAt),
          speed: loc.speed,
          satellites: loc.satellites,
          device: loc.device,
        };
      });
    state.poc = locs
      .filter((l) => l.device == "poc")
      .map((loc) => {
        return {
          lat: Number(loc.latitude),
          lng: Number(loc.longitude),
          date: new Date(loc.createdAt),
          speed: loc.speed,
          satellites: loc.satellites,
          device: loc.device,
        };
      });
  },
  SET_SHOW: (state, payload) => (state.show = payload),
  SET_SHOW_MARKERS: (state, payload) => (state.showMarkers = payload),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
