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

                    <!-- <button @click.prevent="startGame()" v-if="game.game.step === 1">START</button> -->
                    <img @click.prevent="startGame()" v-if="game.game.step === 1" src="./assets/start-icon.png" alt="START">

                    <h1 v-if="game.game.step === 2">Container Loading In Progress:</h1>
                    <div class="selected_container" v-if="game.game.step === 2">
                        <!-- <h1>{{ containers.selected }}</h1> -->
                        <span @click.prevent="unloadContainer(item)" class="loaded_container loaded" v-for="item in game.containers.loaded" v-bind:key="item.pos">{{item}}</span>
                        <span @click.prevent="nextContainer()" class="container_id blink_me">{{game.containers.selected}}</span>
                    </div>

                    <!-- <h1 v-if="game.game.step === 2">Containers Loaded:</h1>
                    <dv class="selected_container" v-if="game.game.step === 2">
                        <span class="container_id loaded" v-for="item in containers.loaded" v-bind:key="item.pos">{{item}}</span>                        
                    </dv> -->

                    <img class="close_button" @click.prevent="resetGame()"  src="./assets/restart-icon.png" alt="Restart">
                     <img class="end_button" @click.prevent="endGame()"  src="./assets/stop-icon.png" alt="Stop">


                    
                    <!-- <button @click.prevent="nextContainer()" v-if="game.game.step === 2">NEXT</button> -->
                    <h1 v-if="game.game.step === 3">Finished</h1>
                    <h2 class="score" v-if="game.game.step === 3">Your Score is {{ game.game.score }}</h2>
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
                sseServer: 'http://192.168.43.51:3000',
                isDisplay: true,
                game: {},
                audio: {
                    warning: null,
                    alarm: null,
                    win: null
                }
            }
        },
        methods: {
            resetGame() {
                if (this.isDisplay) return;
                if (this.game.game.step === 2) {
                    this.endGame();
                }
                this.game.step = 1;
                this.game.username = '';
                this.game.game.step = 1;
                this.game.game.score = 0;
                this.game.containers.stock = this.game.defaults.containers;
                this.game.containers.loaded = [];
                this.game.containers.selected = '';
                this.game.time.started = null;
                this.resetTimer();
                if (this.audio.warning) {
                    this.stopWarningSound();
                }
                if (this.audio.alarm) {
                    this.stopAlarmSound();
                }
            },
            newGame() {
                if (this.isDisplay) return;
                if (this.game.username !== '') {
                    this.game.step++;
                }
            },
            startGame() {
                if (this.isDisplay) return;
                this.startTimer();
                this.game.game.step = 2;
                this.selectContainer();
            },
            endGame() {
                if (this.isDisplay) return;
                this.game.game.score = this.game.containers.loaded.length;
                this.stopTimer();
                this.game.game.step = 3;
                if (this.audio.warning) {
                    this.stopWarningSound();
                }
                if (this.audio.alarm) {
                    this.stopAlarmSound();
                }
            },
            selectContainer() {
                if (!this.game.containers.stock.length) {
                    return this.endGame();
                }
                let randomPosContainer = Math.floor(Math.random() * this.game.containers.stock.length);
                this.game.containers.selected = this.game.containers.stock[randomPosContainer];
            },
            nextContainer() {
                if (this.isDisplay) return;
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
                if (this.game.time.remaining === 0) {
                    this.playAlarmSound();
                    this.endGame();
                }
                if (this.game.time.remaining === 10) {
                    this.playWarningSound();
                }
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
            playAlarmSound() {
                if (!this.isDisplay) return;
                this.audio.alarm.play();
            },
            stopAlarmSound() {
                if (!this.isDisplay) return;
                this.audio.alarm.pause();
                this.audio.alarm.currentTime = 0;
            },
            playWarningSound() {
                if (!this.isDisplay) return;
                this.audio.warning.play();
            },
            stopWarningSound() {
                if (!this.isDisplay) return;
                this.audio.warning.pause();
                this.audio.warning.currentTime = 0;
            },
            playWinSound() {
                if (!this.isDisplay) return;
                this.audio.win.play();
            },
            stopWinSound() {
                if (!this.isDisplay) return;
                this.audio.win.pause();
                this.audio.win.currentTime = 0;
            },
            unloadContainer(id) {
                if (this.isDisplay) return;
                this.game.containers.loaded = this.game.containers.loaded.filter(e => e !== id);
            },
            setupStream() {
                if (this.isDisplay) {
                    let es = new EventSource(this.sseServer+'/events');
                    es.addEventListener('message', (event) => {
                        let data = JSON.parse(event.data);
                        if (JSON.stringify(data) == JSON.stringify(this.game)) {
                            return;
                        }
                        this.game = data;
                        if (this.game.time.remaining === 0 && this.game.step === 2) {
                            console.log("alert");
                            this.playAlarmSound();
                            this.endGame();
                        }
                        if (this.game.time.remaining === 9 && this.game.step === 2) {
                            console.log("warning");
                            this.playWarningSound();
                        }
                        if (!this.game.containers.stock.length && (this.game.step === 2 || this.game.step === 3)) {
                            console.log("won");
                            this.stopAlarmSound();
                            this.stopWarningSound();
                            this.playWinSound();
                            return this.endGame();
                        }
                    }, false);
                }
            },
            init() {
                let win = this.sseServer+'/clap.mp3';
                if (win)
                    this.audio.win = new Audio(win);

                let alarm = this.sseServer+'/alarm.mp3';
                if (alarm)
                    this.audio.alarm = new Audio(alarm);

                let warning = this.sseServer+'/countdown.mp3';
                if (warning)
                    this.audio.warning = new Audio(warning);

                fetch(this.sseServer+'/defaults', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then((myJson) => {
                        this.game = myJson;
                        this.resetGame();
                    }).catch(() => {
                        alert("An error with the socket server!");
                    });
            }
        },
        beforeMount(){
            this.isDisplay = !(window.location.href.includes('isDisplay=false'));
            this.setupStream();
            this.init();
        },
        watch: {
            'game': {
                handler: function(val) {
                    if (this.isDisplay) {
                        return;
                    }
                    fetch(this.sseServer+'/update', {
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
    h2.score {
        font-size: 4em;
    }

</style>
