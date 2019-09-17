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
          <h1 class="kidsname">Wisam</h1>
          <h1>02:00</h1>
          <button v-if="game.step === 1" @click.prevent="startGame()">Start</button>
          <h1 v-if="containers.selected">Container In Progress: {{containers.selected}}</h1>
          <br><button @click.prevent="nextContainer()">Next</button>
         
          <h1 v-if="game.step === 3">Finished</h1>

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
      game: {
        step: 1,
      },
      containers: {
        stock: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
        loaded: [],
        selected: '',
      },
      time: {
        remaining: 120
      }
    }
  },
  methods: {
    add() {
      this.step++;
    },
    selectContainer() {
      if(!this.containers.stock.length) {
        this.game.step = 3;
      }

      var randomPosContainer = Math.floor(Math.random()*this.containers.stock.length);
      var randomContainer = this.containers.stock[randomPosContainer];
      this.containers.selected = randomContainer;
    },
    startGame() {
      this.selectContainer();
      this.game.step++;
    },
    nextContainer() {
      this.containers.loaded.push(this.containers.selected);
      this.containers.stock = this.containers.stock.filter(e => e !== this.containers.selected);

      this.selectContainer();


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

.kidsname {
  color: white;
  font-size: 6em;
}
</style>
