<template>
  <div id="app">
    <img alt="Vue logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/MPL_Logo.png/160px-MPL_Logo.png">
    <Home />
  </div>
</template>

<script>
import Home from './components/Home'

export default {
  name: 'app',
  components: {
    Home
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
