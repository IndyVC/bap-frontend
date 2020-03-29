<template>
  <section class="container">
    <GmapMap
      v-if="getLocations.length>0"
      ref="gmap"
      :center="center"
      :zoom="zoom"
      map-type-id="terrain"
      style="width: 80vw; height: 80vh;"
    >
      <GmapInfoWindow
        :options="infoOptions"
        :position="infoPosition"
        :opened="infoOpened"
        @closeclick="infoOpened=false"
      >
        <span v-html="infoContent" class="has-text-left"></span>
      </GmapInfoWindow>
      <GmapMarker
        :key="i"
        v-for="(m, i) in markers"
        :position="m"
        :clickable="true"
        @click="toggleInfo(m, i)"
      />
      <GmapPolyline :path="markers" v-bind:options="{ strokeColor:'#FF0000'}"></GmapPolyline>
    </GmapMap>
    <div v-else>
      <p>No locations yet!</p>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { gmapApi } from "vue2-google-maps";

export default {
  mounted() {
    this.init();
  },
  data() {
    return {
      markers: [],
      center: { lat: 10, lng: 10 },
      zoom: 7,
      infoPosition: null,
      infoContent: null,
      infoOpened: false,
      infoCurrentKey: null,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      }
    };
  },
  methods: {
    ...mapActions(["$fetchLocations"]),
    /**CALCULATE CENTER */
    rad2degr(rad) {
      return (rad * 180) / Math.PI;
    },
    /**CALCULATE CENTER */
    degr2rad(degr) {
      return (degr * Math.PI) / 180;
    },
    /**CALCULATE CENTER */
    /**
     * @param latLngInDeg array of arrays with latitude and longtitude
     *   pairs in degrees. e.g. [[latitude1, longtitude1], [latitude2
     *   [longtitude2] ...]
     *
     * @return array with the center latitude longtitude pairs in
     *   degrees.
     */
    getLatLngCenter(latLngInDegr) {
      let LATIDX = 0;
      let LNGIDX = 1;
      let sumX = 0;
      let sumY = 0;
      let sumZ = 0;

      for (let i = 0; i < latLngInDegr.length; i++) {
        let lat = this.degr2rad(latLngInDegr[i][LATIDX]);
        let lng = this.degr2rad(latLngInDegr[i][LNGIDX]);
        // sum of cartesian coordinates
        sumX += Math.cos(lat) * Math.cos(lng);
        sumY += Math.cos(lat) * Math.sin(lng);
        sumZ += Math.sin(lat);
      }

      let avgX = sumX / latLngInDegr.length;
      let avgY = sumY / latLngInDegr.length;
      let avgZ = sumZ / latLngInDegr.length;

      // convert average x, y, z coordinate to latitude and longtitude
      let lng = Math.atan2(avgY, avgX);
      let hyp = Math.sqrt(avgX * avgX + avgY * avgY);
      let lat = Math.atan2(avgZ, hyp);

      return { lat: this.rad2degr(lat), lng: this.rad2degr(lng) };
    },
    /**MARKER CLICK */
    toggleInfo(m, i) {
      this.infoPosition = m;
      const info = `<p>Date: ${m.date.toLocaleString() ?? "unknown"} <br/>
      Speed: ${m.speed ?? "unknown"} <br/>
      Satellites: ${m.satellites ?? "unknown"} </p>`;
      this.infoContent = info;
      if (this.infoCurrentKey == i) {
        this.infoOpened = !this.infoOpened;
      } else {
        this.infoOpened = true;
        this.infoCurrentKey = i;
      }
    },
    /** CALCULATE ZOOM */
    calculateBounds(markers) {
      let bounds = new this.google.maps.LatLngBounds();
      markers.forEach(m => {
        bounds.extend(m);
      });
      return bounds;
    },
    /** CALCULATE ZOOM */
    getBoundsZoomLevel(bounds, mapDim) {
      var WORLD_DIM = { height: 256, width: 256 };
      var ZOOM_MAX = 21;

      function latRad(lat) {
        var sin = Math.sin((lat * Math.PI) / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
      }

      function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
      }

      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();

      var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

      var lngDiff = ne.lng() - sw.lng();
      var lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

      var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
      var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

      return Math.min(latZoom, lngZoom, ZOOM_MAX);
    },

    init() {
      this.markers = this.getLocations.map(loc => {
        return {
          lat: Number(loc.latitude),
          lng: Number(loc.longitude),
          date: new Date(loc.createdAt),
          speed: loc.speed,
          satellites: loc.satellites
        };
      });
      this.center = this.getLatLngCenter(this.markers.map(m => [m.lat, m.lng]));
      this.zoom = this.getBoundsZoomLevel(this.calculateBounds(this.markers), {
        height: 600,
        width: 1000
      });
    }
  },
  computed: {
    ...mapGetters(["getLocations"]),
    google: gmapApi
  },
  watch: {
    getLocations() {
      this.init();
    }
  },
  created() {
    this.$fetchLocations();
    // window.setInterval(() => {
    //   this.$fetchLocations();
    // }, 5000);
  }
};
</script>

<style scoped>
.container {
  box-sizing: border-box;
  margin: 20px;
}
</style>