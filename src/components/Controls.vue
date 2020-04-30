<template>
  <section class="card">
    <div class="tab">
      <a class="poc-tab" @click="activeTab=0">POC tracker</a>
      <a class="gsm-tab" @click="activeTab=1">GSM tracker</a>
    </div>

    <div class="padding-15" v-if="getPOC.length>0 && activeTab==0">
      <div>
        <div class="columns has-text-left">
          <p class="heading column">[GPS/GPRS]:</p>
          <p class="subtitle column">{{gpsMethod}}/{{gprsMethod}}</p>
        </div>
      </div>
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Total markers:</p>
          <p class="subtitle column">{{totalMarkers}}</p>
        </div>
      </div>
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Recent marker:</p>
          <p class="subtitle column">{{recentMarker}}</p>
        </div>
      </div>
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Max speed:</p>
          <p class="subtitle column">{{maxSpeed.toFixed(2)}} km\h</p>
        </div>
      </div>
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Average speed:</p>
          <p class="subtitle column">{{averageSpeed.toFixed(2)}} km\h</p>
        </div>
      </div>
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Min speed:</p>
          <p class="subtitle column">{{minSpeed.toFixed(2)}} km\h</p>
        </div>
      </div>
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Max satellites:</p>
          <p class="subtitle column">{{maxSatellites.toFixed(2)}}</p>
        </div>
      </div>
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Average satellites:</p>
          <p class="subtitle column">{{averageSatellites.toFixed(2)}}</p>
        </div>
      </div>
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Min satellites:</p>
          <p class="subtitle column">{{minSatellites.toFixed(2)}}</p>
        </div>
      </div>
      <div class="buttons">
        <button class="button is-small" @click="deleteLocations()">Clear history</button>
        <button class="button is-small" @click="$toggleMarkers()">Hide all markers</button>
        <button class="button is-small" @click="$setShow(0)">Show all devices</button>
        <button class="button is-small" @click="$setShow(1)">Show only PoC</button>
        <button class="button is-small" @click="$setShow(2)">Show only gsm</button>
      </div>
    </div>
    <div v-else-if="activeTab==0">
      <p>No data from the proof of concept. You may check gsm-tracker.</p>
    </div>

    <div class="padding-15" v-if="getGSM.length>0 && activeTab==1">
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Total markers:</p>
          <p class="subtitle column">{{totalMarkersGSM}}</p>
        </div>
      </div>
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Recent marker:</p>
          <p class="subtitle column">{{recentMarkerGSM}}</p>
        </div>
      </div>
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Max speed:</p>
          <p class="subtitle column">{{maxSpeedGSM.toFixed(2)}} km\h</p>
        </div>
      </div>
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Average speed:</p>
          <p class="subtitle column">{{averageSpeedGSM.toFixed(2)}} km\h</p>
        </div>
      </div>
      <div>
        <div class="columns has-text-left">
          <p class="heading column">Min speed:</p>
          <p class="subtitle column">{{minSpeedGSM.toFixed(2)}} km\h</p>
        </div>
      </div>
      <div class="buttons">
        <button class="button is-small" @click="deleteLocations()">Clear history</button>
        <button class="button is-small" @click="$toggleMarkers()">Hide all markers</button>
        <button class="button is-small" @click="$setShow(0)">Show all devices</button>
        <button class="button is-small" @click="$setShow(1)">Show only PoC</button>
        <button class="button is-small" @click="$setShow(2)">Show only gsm</button>
      </div>
    </div>
    <div v-else-if="activeTab==1">
      <p>No data from the gsm-tracker. You may check the proof of concept.</p>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Controls",
  data() {
    return {
      activeTab: 0
    };
  },
  methods: {
    ...mapActions(["$deleteLocations", "$toggleMarkers", "$setShow"]),
    deleteLocations() {
      let result = confirm("Are you sure you want to delete all locations?");
      if (result) {
        this.$deleteLocations();
      }
    }
  },
  computed: {
    ...mapGetters(["getPOC", "getGSM"]),
    gpsMethod() {
      return this.getPOC.filter(l => l.method == "GPS").length;
    },
    gprsMethod() {
      return this.getPOC.filter(l => l.method == "GPRS").length;
    },
    totalMarkers() {
      return this.getPOC.length;
    },
    recentMarker() {
      return new Date(
        this.getPOC[this.getPOC.length - 1].createdAt
      ).toLocaleString();
    },
    maxSpeed() {
      return Math.max(...this.getPOC.map(l => Number(l.speed))) ?? 0;
    },
    averageSpeed() {
      let values = [...this.getPOC.map(l => Number(l.speed))];
      let sum = values.reduce((previous, current) => (current += previous));
      let avg = sum / values.length;
      return avg ?? 0;
    },
    minSpeed() {
      return Math.min(...this.getPOC.map(l => Number(l.speed))) ?? 0;
    },
    maxSatellites() {
      return Math.max(...this.getPOC.map(l => Number(l.satellites))) ?? 0;
    },
    averageSatellites() {
      let values = [...this.getPOC.map(l => Number(l.satellites))];
      let sum = values.reduce((previous, current) => (current += previous));
      let avg = sum / values.length;
      return avg ?? 0;
    },
    minSatellites() {
      return Math.min(...this.getPOC.map(l => Number(l.satellites))) ?? 0;
    },
    totalMarkersGSM() {
      return this.getGSM.length;
    },
    recentMarkerGSM() {
      return new Date(
        this.getGSM[this.getGSM.length - 1].createdAt
      ).toLocaleString();
    },
    maxSpeedGSM() {
      return Math.max(...this.getGSM.map(l => Number(l.speed))) ?? 0;
    },
    averageSpeedGSM() {
      let values = [...this.getGSM.map(l => Number(l.speed))];
      let sum = values.reduce((previous, current) => (current += previous));
      let avg = sum / values.length;
      return avg ?? 0;
    },
    minSpeedGSM() {
      return Math.min(...this.getGSM.map(l => Number(l.speed))) ?? 0;
    }
  }
};
</script>

<style scoped>
.card {
  width: 80vw;
  height: 80vh;
  margin: 20px;
  display: flex;
  flex-direction: column;
}
.tab {
  width: 80%;
  margin: 0 auto;
}
.gsm-tab,
.poc-tab {
  padding: 10px;
  color: black;
  font-weight: bold;
}
.gsm-tab:hover {
  color: red;
}
.poc-tab:hover {
  color: blue;
}
.padding-15 {
  padding: 15px;
}
.columns {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.button {
  margin-top: 20px;
}
.controls {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>