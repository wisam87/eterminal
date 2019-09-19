const {BehaviorSubject} = require('rxjs');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
const port = 3000;

let data = {
    bar: 0,
    defaults: {
        containers: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
        time: 5,
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
};

const lastEntry = new BehaviorSubject(data);

let subscriptions = {

};

app.use(express.static('public'));
app.get('/', (req, res) => res.send('Hello World!'));
app.post('/update', (req, res) => {
    lastEntry.next(req.body);
    console.log(req.body);
    res.send('updated');
});
app.get('/events', (req, res) => {
    initialiseSSE(req, res)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


function initialiseSSE(req, res) {
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
    });

    const lastSub = lastEntry.subscribe(function (message) {
        console.log({message});
        if (message != null) {
            res.write("event: message\n" + "data: " + JSON.stringify(message) + "\n\n");
        }
    });

    const uniqueRequestId = unique();
    subscriptions[uniqueRequestId] = {
        lastSub
    };

    res.on('close', () => {
        unsubscribe(uniqueRequestId);
    });

    res.write("retry: 10000\n\n");
}

function unsubscribe(uid) {
    console.log('Unsubscribing: ', uid);
    subscriptions[uid].lastSub.unsubscribe();
}

function unique() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};


