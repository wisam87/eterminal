<template>
    <div>
        <div v-if="setting.step === 1">
            <h1>Welcome to MPL E-Terminal</h1>
            <h2>Please enter your name</h2>
            <form @submit.prevent="initiate()" action="">
                <input type="text" v-model="name" placeholder="Name">
                <button type="submit">Start</button>
            </form>
        </div>

        <div v-if="setting.step === 2">
            
            <p>Welcome {{name}}</p>
            <h1>{{time.minutes}}:{{time.seconds}}</h1>
            <h1>{{ time.remaining }} seconds remaining</h1>

            <div>
                <p>Loaded Containers</p>
                <!-- <h2 v-for="item in containers.loaded.containers" v-bind:key="item.pos">{{item}}</h2> -->
            </div>

            

            <button @click.prevent="startGame()">Start</button>
            <button @click.prevent="nextContainer()">Next</button>
            <button @click.prevent="endGame()">End Game</button>
            <button @click.prevent="shuffleContainer()">Shuffle</button>

            <div>
                <h3>Container In Progress</h3>
                <h2>Container Number {{containers.progress.container}} to Slot {{containers.progress.slot}}</h2>
            </div>

            <table>
                <tr style="background-color: grey; ">
                    <td>{{containers.stock[1]}}</td>
                </tr>
            </table>

        </div>

        <div  v-if="setting.step === 3">
            <h1>Game Ended</h1>
            <h2>Your Score is {{this.containers.loaded.length}}</h2>
            <button @click.prevent="setting.step = 1">Restart</button>
        </div>
        
    </div>
</template>
<script>

export default {
    name: 'Home',
    data() {
        return {
            name : 'Wisam',
            setting: {
                step: 2,
            },
            time: {
                remaining: 5,
                minutes: '2',
                seconds: '00'
            },
            containers: {
                stock: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
                slots: ['1', '11', '2', '21', '3', '3'],
                progress: {
                    container: '',
                    slot: ''
                },
                loaded: {
                    containers: [],
                    slots: []
                }
            }
        }
    },
    mounted() {
            this.time.remaining = 5;
            this.shuffle(this.containers.stock);
    },
    methods: {
        initiate() {
            // console.log(this.name);
            this.time.remaining = 5;
            this.setting.step++;
        },
        startGame() {
            var randomPosContainer = Math.floor(Math.random()*this.containers.stock.length);
            var randomPosSlot = Math.floor(Math.random()*this.containers.slots.length);

            var randomContainer = this.containers.stock[randomPosContainer];
            var randomSlot = this.containers.slots[randomPosSlot]


            this.containers.progress.container = randomContainer;
            this.containers.progress.slot = randomSlot;

        },
        nextContainer() {

            // this.containers.loaded.push(this.containers.progress);
            this.containers.loaded.containers.push(this.containers.progress.container);
            this.containers.loaded.slots.push(this.containers.progress.slot);


            this.containers.stock = this.containers.stock.filter(e => e !== this.containers.progress.container);
            this.containers.slots = this.containers.slots.filter(e => e !== this.containers.progress.slot);

            var randomPosContainer = Math.floor(Math.random()*this.containers.stock.length);
            var randomPosSlot = Math.floor(Math.random()*this.containers.slots.length);

            var randomContainer = this.containers.stock[randomPosContainer];
            var randomSlot = this.containers.slots[randomPosSlot]


            this.containers.progress.container = randomContainer;
            this.containers.progress.slot = randomSlot;
           
        },
        shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
        },
        
        shuffleContainer() {
            var self = this;
            

            var random = self.shuffle(self.containers.stock);
            console.log(random);
        }
      
     
        
        
    }
}
</script>
<style lang="">
    
</style>