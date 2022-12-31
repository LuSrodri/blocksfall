let controlCanvas = document.getElementById("controlCanvas");
let ctxControlCanvas = controlCanvas.getContext('2d');
let rectControlCanvas;

controlCanvas.width = document.getElementsByTagName("body")[0].clientWidth * 4;
controlCanvas.height = document.getElementsByTagName("body")[0].clientHeight * 4;
controlCanvas.style.width = document.getElementsByTagName("body")[0].clientWidth + "px";
controlCanvas.style.height = document.getElementsByTagName("body")[0].clientHeight + "px";
ctxControlCanvas = controlCanvas.getContext('2d');
rectControlCanvas = controlCanvas.getBoundingClientRect();

window.addEventListener("resize", () => {
    controlCanvas.width = document.getElementsByTagName("body")[0].clientWidth * 4;
    controlCanvas.height = document.getElementsByTagName("body")[0].clientHeight * 4;
    controlCanvas.style.width = document.getElementsByTagName("body")[0].clientWidth + "px";
    controlCanvas.style.height = document.getElementsByTagName("body")[0].clientHeight + "px";
    ctxControlCanvas = controlCanvas.getContext('2d');
    rectControlCanvas = controlCanvas.getBoundingClientRect();
});

let imgControlCenter = new Image();
imgControlCenter.src = "./images/control_mobile/control_mobile_.png";
let imgControlRight = new Image();
imgControlRight.src = "./images/control_mobile/control_mobile_right.png";
let imgControlLeft = new Image();
imgControlLeft.src = "./images/control_mobile/control_mobile_left.png";
let imgControlDown = new Image();
imgControlDown.src = "./images/control_mobile/control_mobile_down.png";
let imgControlRightDown = new Image();
imgControlRightDown.src = "./images/control_mobile/control_mobile_right_down.png";
let imgControlLeftDown = new Image();
imgControlLeftDown.src = "./images/control_mobile/control_mobile_left_down.png";

let scaleOfImage = 1;

function printControllerMobile() {
    ctxControlCanvas.clearRect(0, 0, controlCanvas.width, controlCanvas.height);

    let img = new Image();

    img = imgControlCenter;
    if (isMovingRight)
        img = imgControlRight;
    if (isMovingLeft)
        img = imgControlLeft;
    if (isMovingDown)
        img = imgControlDown;
    if (isMovingRight && isMovingDown)
        img = imgControlRightDown;
    if (isMovingLeft && isMovingDown)
        img = imgControlLeftDown;

    ctxControlCanvas.globalAlpha = 0.8;
    ctxControlCanvas.drawImage(img, 0 + (xPositionImageControl - img.width / (scaleOfImage * 2)), 0 + (yPositionImageControl - img.height / (scaleOfImage * 2)), img.width * (scaleOfImage), img.height * (scaleOfImage));
}

let xPositionImageControl = null;
let yPositionImageControl = null;
let isMovingLeft = false;
let isMovingRight = false;
let isMovingDown = false;
let isMovingUp = false;
function controllerTouch() { //set the touch controller
    let gameTouchController = null;
    let xTouchPositionStart = null;
    let yTouchPositionStart = null;
    let xDiff = null;
    let yDiff = null;
    let movingTouchHorizontal = null;
    let movingTouchVertical = null;
    rectControlCanvas = controlCanvas.getBoundingClientRect();

    gameTouchController = document.getElementById("controlCanvas");

    gameTouchController.addEventListener("touchstart", setStartTouchPosition, true);
    gameTouchController.addEventListener("touchmove", startMove, true);
    gameTouchController.addEventListener("touchend", endMove, true);

    function setStartTouchPosition(event) {
        const touch = event.touches[0];
        xTouchPositionStart = touch.clientX;
        yTouchPositionStart = touch.clientY;
        xPositionImageControl = (xTouchPositionStart - rectControlCanvas.left) * controlCanvas.width / rectControlCanvas.width;
        yPositionImageControl = (yTouchPositionStart - rectControlCanvas.top) * controlCanvas.height / rectControlCanvas.height;
        isTouching = true;
        isPrintControllerMobile = true;
        printControllerMobile();
    }

    function startMove(event) {

        const touch = event.touches[0];
        const sensitivityXAxis = 40;
        const sensitivityYAxis = 40;
        let xTouchPositionEnd = touch.clientX;
        let yTouchPositionEnd = touch.clientY;

        xDiff = xTouchPositionStart - xTouchPositionEnd;
        yDiff = yTouchPositionStart - yTouchPositionEnd;

        if (!isPaused && !isGameOver) {
            if (xDiff > -sensitivityXAxis && xDiff < sensitivityXAxis) { //only moves horizontal
                clearInterval(movingTouchHorizontal);
                isMovingRight = false;
                isMovingLeft = false;
            }
            if (yDiff > -sensitivityYAxis && yDiff < sensitivityYAxis) { //only moves vertical
                clearInterval(movingTouchVertical);
                isMovingDown = false;
                isRotate = false;
            }
            if (xDiff < -sensitivityXAxis && !isMovingRight) { //moves to right
                isMovingRight = true;
                changeDirection('R');
                movingTouchHorizontal = setInterval(() => {
                    changeDirection('R');
                }, 175);
            }
            if (xDiff > sensitivityXAxis && !isMovingLeft) { //moves to left
                isMovingLeft = true;
                changeDirection('L');
                movingTouchHorizontal = setInterval(() => {
                    changeDirection('L');
                }, 175);
            }
            if (yDiff < -sensitivityYAxis && !isMovingDown) { //moves down
                isMovingDown = true;
                downPiece(letter[0]);
                movingTouchVertical = setInterval(() => {
                    downPiece(letter[0]);
                }, 125);
            }
            if (yDiff > sensitivityYAxis && !isMovingUp){
                isMovingUp = true;
            }
            printControllerMobile();
        }
    }

    function endMove() {
        if (!isMovingDown && !isMovingUp && !isMovingRight && !isMovingLeft) 
            rotatePiece('R', piece);
        

        isMovingDown = false;
        isMovingUp = false;
        isMovingRight = false;
        isMovingLeft = false;
        isPrintControllerMobile = false;
        clearInterval(movingTouchHorizontal);
        clearInterval(movingTouchVertical);
        ctxControlCanvas.clearRect(0, 0, controlCanvas.width, controlCanvas.height);
    }
}