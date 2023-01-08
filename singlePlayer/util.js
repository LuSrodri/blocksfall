
function gameStringify(game) {
    gameInfosId = game.gameId;
    let tempLoop = game.loop;
    game.loop = null;
    let gameInfosJSONString = JSON.parse(JSON.stringify(game));
    game.loop = tempLoop;
    return JSON.stringify(gameInfosJSONString);
}

function setDateNowMoreAMonth() {
    return new Date(new Date().setMonth(new Date().getMonth() + 1));
}

module.exports = {
    gameStringify,
    setDateNowMoreAMonth
}