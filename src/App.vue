<template>
    <div id="app">
        <div style="height: 100%;">
            <div v-if="step === 1" class="home">
                <img src="./assets/mpl-logo.png" alt="" height="150px">
                <h1>Welcome to Container Terminal</h1>
                <form @submit.prevent="newGame()" action="">
                    <input v-model="name" type="text" placeholder="">
                    <br>
                    <button class="submitbtn" type="submit"></button>
                </form>
            </div>
            <div v-if="step === 2" class="game">
                <div class="name">
                    <h1 class="kidsname">{{name}}</h1>
                    <h1 v-bind:class="{ red: time.remaining <= 10 }">{{time.display}}</h1>
                    <button @click.prevent="startGame()" v-if="game.step === 1">START</button>
                    <h1 v-if="game.step === 2">Container In Progress:</h1>
                    <dv class="selected_container" v-if="game.step === 2">
                        <h1>{{ containers.selected }}</h1>
                    </dv>
                    <br>
                    <button @click.prevent="nextContainer()" v-if="game.step === 2">NEXT</button>
                    <h1 v-if="game.step === 3">Finished</h1>
                    <h2 v-if="game.step === 3">Your Score is {{ game.score }}</h2>
                    <button v-if="game.step === 3" @click.prevent="resetGame()">RESTART</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // import Home from './components/Home'
    export default {
        name: 'app',
        components: {
            // Home
        },
        data() {
            return {
                defaults: {
                    containers: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
                    time: 5,
                },
                step: 1,
                name: '',
                game: {
                    step: 1,
                    score: 0,
                },
                containers: {
                    stock: [],
                    loaded: [],
                    selected: '',
                },
                time: {
                    remaining: 0,
                    running: false,
                    display: '00:00',
                    started: null
                }
            }
        },
        methods: {
            resetGame() {
                this.step = 1;
                this.name = '';
                this.game.step = 1;
                this.game.score = 0;
                this.containers.stock = this.defaults.containers;
                this.containers.loaded = [];
                this.containers.selected = '';
                this.time.started = null;
                this.resetTimer();
            },
            newGame() {
                this.step++;
            },
            startGame() {
                this.startTimer();
                this.game.step = 2;
                this.selectContainer();
            },
            endGame() {
                this.game.score = this.containers.loaded.length - 1;
                this.stopTimer();
                this.game.step = 3;
            },
            selectContainer() {
                if(!this.containers.stock.length) {
                    return this.endGame();
                }
                let randomPosContainer = Math.floor(Math.random()*this.containers.stock.length);
                this.containers.selected = this.containers.stock[randomPosContainer];
            },
            nextContainer() {
                this.containers.loaded.push(this.containers.selected);
                this.containers.stock = this.containers.stock.filter(e => e !== this.containers.selected);
                this.selectContainer();
            },
            startTimer() {
                if (this.time.running) return;
                this.time.started = setInterval(this.timerTick, 1000);
                this.time.running = true;
            },
            stopTimer() {
                this.time.running = false;
                clearInterval(this.time.started);
            },
            resetTimer() {
                this.time.running = false;
                clearInterval(this.time.started);
                this.time.remaining = this.defaults.time;
                this.updateTime();
            },
            timerTick() {
                this.time.remaining--;
                if (this.time.remaining <= 0) {
                    this.endGame();
                }
                this.updateTime();
            },
            updateTime() {
                let min = Math.floor(this.time.remaining / 60);
                let sec = this.time.remaining - min * 60;
                this.time.display = this.zeroPrefix(min, 2) + ":" + this.zeroPrefix(sec, 2)
            },
            zeroPrefix(num, digit) {
                let zero = '';
                for(let i = 0; i < digit; i++) {
                    zero += '0';
                }
                return (zero + num).slice(-digit);
            }
        },
        beforeMount(){
            this.resetGame();
        },
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
    .red {
        color: red;
    }
</style>
