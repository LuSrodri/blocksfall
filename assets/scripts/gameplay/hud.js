let hudCanvas = document.getElementById("hud");
let ctxHudCanvas = hudCanvas.getContext('2d');
let rectHudCanvas;

hudCanvas.width = document.getElementsByTagName("body")[0].clientWidth * 6;
hudCanvas.height = document.getElementsByTagName("body")[0].clientHeight * 6;
hudCanvas.style.width = document.getElementsByTagName("body")[0].clientWidth + "px";
hudCanvas.style.height = document.getElementsByTagName("body")[0].clientHeight + "px";
ctxHudCanvas = hudCanvas.getContext('2d');
rectHudCanvas = hudCanvas.getBoundingClientRect();

window.addEventListener("resize", () => {
    hudCanvas.width = document.getElementsByTagName("body")[0].clientWidth * 6;
    hudCanvas.height = document.getElementsByTagName("body")[0].clientHeight * 6;
    hudCanvas.style.width = document.getElementsByTagName("body")[0].clientWidth + "px";
    hudCanvas.style.height = document.getElementsByTagName("body")[0].clientHeight + "px";
    ctxHudCanvas = hudCanvas.getContext('2d');
    rectHudCanvas = hudCanvas.getBoundingClientRect();
});

function printInfosByScore(scored) {
    if (scored < 20)
        return;

    let text = "";
    let alpha = 0.0;
    let timing = 0;

    if (scored === 20)
        text = "COMBO X2😘";
    if (scored === 30)
        text = "COMBO X3😜";
    if (scored === 40)
        text = "COMBO X4😎";

    let loop = setInterval(() => {
        ctxHudCanvas.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
        ctxHudCanvas.fillStyle = "rgba(255,255,255," + alpha + ")";
        ctxHudCanvas.font = "bolder 60vw 'Oswald'"
        ctxHudCanvas.textAlign = "center";
        ctxHudCanvas.shadowBlur = 8;
        ctxHudCanvas.fillText(text, hudCanvas.width / 2, hudCanvas.height / 2);
        if (alpha <= 1.0 && timing < 80)
            alpha += 0.05;
        if (alpha >= 0.0 && timing > 120)
            alpha -= 0.05;
        timing++;
    }, 10);
    setTimeout(() => {
        ctxHudCanvas.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
        clearInterval(loop);
    }, 1500);
}