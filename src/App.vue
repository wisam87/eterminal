<template>
  <div id="app">
   
    
    <div style="height: 100%;">


      <div v-if="step === 1" class="home">
        <img src="./assets/mpl-logo.png" alt="" height="150px">
        <h1>Welcome to E-Terminal</h1>
        <form @submit.prevent="add()" action="">
          <input type="text" placeholder="">
          <br>
          <button class="submitbtn" type="submit"></button>
        </form>
      </div>

      <div v-if="step === 2" class="game">
        <div class="name">
          <h1>Wisam</h1>
          <h1>02:00</h1>
        </div>

          <div class="challenge">
            <div class="box">
              sad
            </div>
          </div>

          <div class="challenge">
            <div class="box">
              sad
            </div>
          </div>
          
          <div class="challenge">
            <div class="box">
              sad
            </div>
          </div>

          <div class="challenge">
            <div class="box">
              sad
            </div>
          </div>

          <div class="challenge">
            <div class="box">
              sad
            </div>
          </div>

          <div class="challenge">
            <div class="box">
              sad
            </div>
          </div>

      </div>



    </div>


  </div>
</template>

<script>
import Home from './components/Home'

export default {
  name: 'app',
  components: {
    Home
  },
  data() {
    return {
      step: 2,
    }
  },
  methods: {
    add() {
      this.step++;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
  position: fixed;
  text-align: center;
  color: #2c3e50;
  background-image: url('./assets/background-home.png');
  background-size: cover;
  background-position: center;
  text-align: center
}

.home {
  background-color: #FFFFFF;
  width: 60%;
  height: auto;
  padding: 20px 0px 20px 0px;
  margin: 0 auto;
  border: 10px solid #0462af;
  margin-top: 100px;
  border-radius: 30px;
}

.home input {
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  border: 7px solid #0462af;
  padding: 10px 0px 10px 0px;
  border-radius: 10px;
}

.submitbtn {
  background-image: url('./assets/SVG/button.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: white;
  height: 100px;
  width: 100px;
  border: none;
  margin-top: 20px;
}

.game {
  text-align: center;
}

.challenge {
  float: left;
  margin: 0 auto;
  height: 70%;
  width: 33%;
}

.box {
  background-color: white;
  margin: 20px;
  border-radius: 10px;
  font-size: 3em;
  font-weight: bold;
}
</style>
