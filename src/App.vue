<template>
  <div id="app">
    <Maps />
  </div>
</template>

<script>
import Maps from "./components/Maps";

export default {
  name: "App",
  components: {
    Maps
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
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #4a4a4a;
}
</style>
