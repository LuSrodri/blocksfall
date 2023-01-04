const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const { gameStringify, setDateNowMoreAMonth } = require('./util');

initializeApp({
    credential: applicationDefault()
});

const db = getFirestore();

async function CreateAGameInDataBase(game) {
    let data = {};
    data.game = gameStringify(game);
    data.deleteAt = setDateNowMoreAMonth();
    const res = await db.collection('games').add(data);

    return res.id;
}

async function GetAGameInDatabase(gameId) {
    const docRef = db.collection('games').doc(gameId);
    const doc = await docRef.get();

    if (!doc.exists)
        return null;

    let game = JSON.parse(doc.data().game);

    return game;
}

async function UpdateAGameInDataBase(game) {
    const docRef = db.collection('games').doc(game.gameId);
    const doc = await docRef.get();

    if (!doc.exists)
        return false;

    let data = {};
    data.game = gameStringify(game);
    data.deleteAt = setDateNowMoreAMonth();

    const res = await db.collection('games').doc(game.gameId).set(data);

    return true;
}

async function DeleteAGameInDataBase(gameId) {
    await db.collection('games').doc(gameId).delete();
}

module.exports = {
    CreateAGameInDataBase,
    GetAGameInDatabase,
    UpdateAGameInDataBase,
    DeleteAGameInDataBase
}