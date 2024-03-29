let hudCanvas = document.getElementById("hudGameplay");
let ctxHudCanvas = hudCanvas.getContext('2d');
let rectHudCanvas;

hudCanvas.width = document.getElementsByTagName("body")[0].clientWidth * 2;
hudCanvas.height = document.getElementsByTagName("body")[0].clientHeight * 2;
hudCanvas.style.width = document.getElementsByTagName("body")[0].clientWidth + "px";
hudCanvas.style.height = document.getElementsByTagName("body")[0].clientHeight + "px";
ctxHudCanvas = hudCanvas.getContext('2d');
rectHudCanvas = hudCanvas.getBoundingClientRect();

window.addEventListener("resize", () => {
    hudCanvas.width = document.getElementsByTagName("body")[0].clientWidth * 2;
    hudCanvas.height = document.getElementsByTagName("body")[0].clientHeight * 2;
    hudCanvas.style.width = document.getElementsByTagName("body")[0].clientWidth + "px";
    hudCanvas.style.height = document.getElementsByTagName("body")[0].clientHeight + "px";
    ctxHudCanvas = hudCanvas.getContext('2d');
    rectHudCanvas = hudCanvas.getBoundingClientRect();
});

let imgComboX2 = new Image();
imgComboX2.src = "./images/combos/COMBO_X2.png";
let imgComboX3 = new Image();
imgComboX3.src = "./images/combos/COMBO_X3.png";
let imgComboX4 = new Image();
imgComboX4.src = "./images/combos/COMBO_X4.png";

let imgInitialGame = new Image();
imgInitialGame.src = "./images/initialGame.png";

function printInfosByScore(scored) {
    if (scored < 20)
        return;

    let img = null;
    let alpha = 0.0;
    let timing = 0;
    let scaleOfImageHud = 1;
    if (parseInt(hudCanvas.style.width, 10) <= 700)
        scaleOfImageHud = 0.5;

    if (scored === 20)
        img = imgComboX2
    if (scored === 30)
        img = imgComboX3
    if (scored === 40)
        img = imgComboX4

    let loop = setInterval(() => {
        ctxHudCanvas.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
        ctxHudCanvas.globalAlpha = alpha;
        ctxHudCanvas.drawImage(img, (hudCanvas.width / 2) - (img.width / (2 / scaleOfImageHud)), (hudCanvas.height / 2) - (img.height / (2 / scaleOfImageHud)), (img.width * scaleOfImageHud), (img.height * scaleOfImageHud));

        if (alpha <= 1.0 && timing < 80) {
            alpha += 0.05;
            if (alpha > 1)
                alpha = 1;
        }
        if (alpha >= 0.0 && timing > 120) {
            alpha -= 0.05;
            if (alpha < 0)
                alpha = 0;
        }

        timing++;
    }, 10);
    setTimeout(() => {
        ctxHudCanvas.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
        clearInterval(loop);
    }, 3000);
}

function printInitialGame() {
    let alpha = 1.0;
    let timing = 0;
    let scaleOfImageHud = 0.6;
    if (parseInt(hudCanvas.style.width, 10) <= 700)
        scaleOfImageHud = 0.3;

    let loopInitialGame = setInterval(() => {
        ctxHudCanvas.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
        ctxHudCanvas.save();
        ctxHudCanvas.fillStyle = "#00000090";
        ctxHudCanvas.fillRect(0, 0, hudCanvas.width, hudCanvas.height);
        ctxHudCanvas.restore();
        ctxHudCanvas.globalAlpha = alpha;
        ctxHudCanvas.drawImage(imgInitialGame, (hudCanvas.width / 2) - (imgInitialGame.width / (2 / scaleOfImageHud)), (hudCanvas.height / 2) - (imgInitialGame.height / (2 / scaleOfImageHud)), (imgInitialGame.width * scaleOfImageHud), (imgInitialGame.height * scaleOfImageHud));

        if (alpha >= 0.0 && timing > 150) {
            alpha -= 0.20;
            if (alpha < 0)
                alpha = 0;
        }

        timing++;
    }, 20);
    setTimeout(() => {
        ctxHudCanvas.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
        clearInterval(loopInitialGame);
        document.getElementsByClassName("btn btnPause")[0].style.display = "unset";
    }, 3000);
}