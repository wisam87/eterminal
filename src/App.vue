<template>
    <div id="app">
        <div style="height: 100%;">
            <div v-if="game.step === 1" class="home">
                <img src="./assets/mpl-logo.png" alt="" height="150px">
                <h1>Welcome to Container Terminal</h1>
                <form @submit.prevent="" action="">
                    <input v-model="game.username" type="text" placeholder="">
                    <br>
                    <img style="margin: 20px" @click.prevent="newGame()" src="./assets/fast-right-icon.png" alt="START">
                </form>
            </div>
            <div v-if="game.step === 2" class="game">
                <div class="name">
                    <h1 class="kidsname">{{game.username}}</h1>
                    <h1 class="timer" v-bind:class="{ red: game.time.remaining <= 10 }">{{game.time.display}}</h1>
                    
                    <div v-if="game.game.step === 2 || game.game.step === 3"  class="timerdisplay">
                        <div class="timebar" v-bind:style="{ width: game.bar + '%' }">
                        </div>
                    </div>

                    <div id="Audio">
                        <audio style="display: none" id="tenSecondAudio" controls>
                            <source src="./assets/countdown.mp3" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>

                        <audio style="display: none" id="alarmAudio" controls>
                            <source src="./assets/alarm.mp3" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    </div>

                    

                    <!-- <button @click.prevent="startGame()" v-if="game.game.step === 1">START</button> -->
                    <img @click.prevent="startGame()" v-if="game.game.step === 1" src="./assets/start-icon.png" alt="START">

                    <h1 v-if="game.game.step === 2">Container In Progress:</h1>
                    <dv class="selected_container" v-if="game.game.step === 2">
                        <!-- <h1>{{ containers.selected }}</h1> -->
                        <span @click.prevent="unloadContainer(item)" class="loaded_container loaded" v-for="item in game.containers.loaded" v-bind:key="item.pos">{{item}}</span>
                        <span @click.prevent="nextContainer()" class="container_id blink_me">{{game.containers.selected}}</span>
                    </dv>

                    <!-- <h1 v-if="game.game.step === 2">Containers Loaded:</h1>
                    <dv class="selected_container" v-if="game.game.step === 2">
                        <span class="container_id loaded" v-for="item in containers.loaded" v-bind:key="item.pos">{{item}}</span>                        
                    </dv> -->

                    <img class="close_button" @click.prevent="resetGame()"  src="./assets/restart-icon.png" alt="Restart">
                     <img class="end_button" @click.prevent="endGame()"  src="./assets/stop-icon.png" alt="Stop">


                    
                    <!-- <button @click.prevent="nextContainer()" v-if="game.game.step === 2">NEXT</button> -->
                    <h1 v-if="game.game.step === 3">Finished</h1>
                    <h2 v-if="game.game.step === 3">Your Score is {{ game.game.score }}</h2>
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
                isDisplay: true,
                game: {
                    bar: 0,
                    defaults: {
                        containers: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
                        time: 30,
                    },
                    step: 1,
                    username: '',
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
            }
        },
        methods: {
            resetGame() {
                if (this.game.game.step === 2) {
                    this.endGame();
                }
                this.game.step = 1;
                this.game.username = 'wisam';
                this.game.game.step = 1;
                this.game.game.score = 0;
                this.game.containers.stock = this.game.defaults.containers;
                this.game.containers.loaded = [];
                this.game.containers.selected = '';
                this.game.time.started = null;
                this.resetTimer();
            },
            newGame() {
                if (this.game.username !== '') {
                    this.game.step++;
                }
            },
            startGame() {
                this.startTimer();
                this.game.game.step = 2;
                this.selectContainer();
            },
            endGame() {
                this.game.game.score = this.game.containers.loaded.length;
                this.stopTimer();
                this.game.game.step = 3;

            },
            selectContainer() {
                if (!this.game.containers.stock.length) {
                    return this.endGame();
                }
                let randomPosContainer = Math.floor(Math.random() * this.game.containers.stock.length);
                this.game.containers.selected = this.game.containers.stock[randomPosContainer];
            },
            nextContainer() {
                this.game.containers.loaded.push(this.game.containers.selected);
                this.game.containers.stock = this.game.containers.stock.filter(e => e !== this.game.containers.selected);
                this.selectContainer();
            },
            startTimer() {
                if (this.game.time.running) return;
                this.game.time.started = setInterval(this.timerTick, 1000);
                this.game.time.running = true;
            },
            stopTimer() {
                this.game.time.running = false;
                clearInterval(this.game.time.started);
                this.game.time.started = 0;
            },
            resetTimer() {
                this.stopTimer();
                this.game.time.remaining = this.game.defaults.time;
                this.updateTime();
            },
            timerTick() {
                this.game.time.remaining--;
                if (this.game.time.remaining <= 0) {
                    this.playAlarmSound();
                    this.endGame();
                }
                if (this.game.time.remaining <= 10)
                    this.playWarningSound();
                this.updateTime();
            },
            updateTime() {
                let min = Math.floor(this.game.time.remaining / 60);
                let sec = this.game.time.remaining - min * 60;

                this.game.time.display = this.zeroPrefix(min, 2) + ":" + this.zeroPrefix(sec, 2);
                this.updateProgressBar();
            },
            updateProgressBar() {
                this.game.bar = (100 - (this.game.time.remaining / this.game.defaults.time) * 100);
            },
            zeroPrefix(num, digit) {
                let zero = '';
                for (let i = 0; i < digit; i++) {
                    zero += '0';
                }
                return (zero + num).slice(-digit);
            },
            playWarningSound() {
                var x = document.getElementById("tenSecondAudio");
                x.play();
            },
            playAlarmSound() {
                var x = document.getElementById("alarmAudio");
                x.play();
            },
            unloadContainer(id) {
                this.game.containers.loaded = this.game.containers.loaded.filter(e => e !== id);
            },
            setupStream() {
                if (this.isDisplay) {
                    let es = new EventSource('http://192.168.4.101:3000/events');
                    es.addEventListener('message', event => {
                        let data = JSON.parse(event.data);
                        if (JSON.stringify(data) == JSON.stringify(this.game)) {
                            return;
                        }
                        this.game = data;
                    }, false);
                }
            }
        },
        beforeMount(){
            this.resetGame();
            this.isDisplay = !(window.location.href.includes('isDisplay=false'));
            this.setupStream();
        },
        watch: {
            'game': {
                handler: function(val, oldVal) {
                    if (this.isDisplay) {
                        return;
                    }
                    fetch('http://192.168.4.101:3000/update', {
                        method: 'post',
                        body: JSON.stringify(val),
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                    });
                },
                deep: true
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
        /* background-image: url('./assets/fast-right-icon.png'); */
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
        margin-bottom: 0px;
    }
    .red {
        color: red !important;
    }
    .timer{
      font-size: 7em;
      color: rgb(238, 255, 0);
      margin-top: 0px !important;
    }

    .container_id {
        font-size: 4em;
        color: black;
        font-weight: bold;
        background-color: yellow;
        padding: 20px;
        margin: 10px;
    }

    .loaded_container {
        font-size: 2em;
        color: black;
        font-weight: bold;
        background-color: green;
        padding: 20px;
        margin: 10px;
    }

    .loaded {
        background-color: green;
        color: white;
    }

    .blink_me {
        animation: blinker 2s linear infinite;
    }

    @keyframes blinker {
        50% {
            background-color: rgb(255, 145, 0);
        }
    }

    .timerdisplay {
        top: 20px;
        position: fixed;
        width: 80%;
        margin: 0% 10% 0% 10%;
        background-color: rgb(14, 82, 121);
        height: 20px;
        left: 0;
        border-radius: 10px;
    }

    .timebar {
        border-radius: 10px;
        height: 100%;
        background-color: rgb(170, 228, 183);
        background: repeating-linear-gradient(
        45deg,
        rgb(170, 228, 183),
        rgb(170, 228, 183) 10px,
        #ffffff 10px,
        #ffffff 20px
        );
        transition: all 1s;
        position: relative;
    }

    .close_button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
    }

    .end_button {
        position: fixed;
        bottom: 20px;
        right: 100px;
        width: 50px;
        height: 50px;
    }

</style>
