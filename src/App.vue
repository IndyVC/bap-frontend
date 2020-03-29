<template>
  <div id="app" class="tile is-ancestor">
    <Maps class="tile is-6" />
    <Controls class="tile is-6" />
  </div>
</template>

<script>
import Maps from "./components/Maps";
import Controls from "./components/Controls";

export default {
  name: "App",
  components: {
    Maps,
    Controls
  }
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100vh;
  width: 100vw;
}
</style>
