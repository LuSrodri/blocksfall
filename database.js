
// setting the database firestore
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./path/to/fair-gradient-335401-0979c95b74d3.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();
////////////////////////////////////////////////////////////////////////////////////////////

// defining class and variables
let player = class player {
    constructor(id, name, host = false) {
        this.id = id
        this.name = name;
        this.matrix = { matrixAux };
        this.score = 0;
        this.host = host;
        this.letter = null;
    }
};

let gameMatch = class gameMatch {
    constructor() {
        this.id = id
        this.players = new Array();
        this.isRunning = false;
        this.winnerId = null;
        this.userEmitterId = null;
        this.password = "pdra";
    }
};

let gamesOnline = new Array();

////////////////////////////////////////////////////////////////////////////////////////////

async function findPrivateMatch(id) {
    let doc = await db.collection('BlocksFall-Multiplayer').doc(id).get();
    if (!doc.exists) {
        return false;
    }
    createSnapshot(doc.data());
    return true;
}

async function createPrivateMatch(id, name) {
    let player1 = new player(id, name, true);
    let privateMatch = new gameMatch();
    privateMatch.players.push(player1);
    let res = await db.collection('BlocksFall-Multiplayer').add(privateMatch);
    privateMatch.id = res.id;
    await db.collection('BlocksFall-Multiplayer').doc(res.id).update(privateMatch);
    createSnapshot(privateMatch);
}

async function updateMatch(match){
    await db.collection('BlocksFall-Multiplayer').doc(match.id).update(match);
}

async function createSnapshot(match){
    let doc = db.collection('BlocksFall-Multiplayer').doc(match.id).onSnapshot(
        docSnapshot => {
            gamesOnline.forEach(game => {
                if (game.id === docSnapshot.id) {
                    game.privateMatch = docSnapshot.data();
                }
            })
        }
    );
    gamesOnline.push({ id: res.id, doc, game : match });
}

module.exports = {
    findPrivateMatch,
    createPrivateMatch,
    updateMatch,
}