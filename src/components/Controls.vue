<template>
  <section class="card" v-if="getLocations.length>0">
    <div class="padding-15">
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
      <button class="button is-small" @click="deleteLocations()">Clear history</button>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Controls",
  methods: {
    ...mapActions(["$deleteLocations"]),
    deleteLocations() {
      let result = confirm("Are you sure you want to delete all locations?");
      if (result) {
        this.$deleteLocations();
      }
    }
  },
  computed: {
    ...mapGetters(["getLocations"]),
    gpsMethod() {
      return this.getLocations.filter(l => l.method == "GPS").length;
    },
    gprsMethod() {
      return this.getLocations.filter(l => l.method == "GPRS").length;
    },
    totalMarkers() {
      return this.getLocations.length;
    },
    recentMarker() {
      return new Date(
        this.getLocations[this.getLocations.length - 1].createdAt
      ).toLocaleString();
    },
    maxSpeed() {
      return Math.max(...this.getLocations.map(l => Number(l.speed))) ?? 0;
    },
    averageSpeed() {
      let values = [...this.getLocations.map(l => Number(l.speed))];
      let sum = values.reduce((previous, current) => (current += previous));
      let avg = sum / values.length;
      return avg ?? 0;
    },
    minSpeed() {
      return Math.min(...this.getLocations.map(l => Number(l.speed))) ?? 0;
    },
    maxSatellites() {
      return Math.max(...this.getLocations.map(l => Number(l.satellites))) ?? 0;
    },
    averageSatellites() {
      let values = [...this.getLocations.map(l => Number(l.satellites))];
      let sum = values.reduce((previous, current) => (current += previous));
      let avg = sum / values.length;
      return avg ?? 0;
    },
    minSatellites() {
      return Math.min(...this.getLocations.map(l => Number(l.satellites))) ?? 0;
    }
  }
};
</script>

<style scoped>
.card {
  width: 80vw;
  height: 80vh;
  margin: 20px;
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
</style>