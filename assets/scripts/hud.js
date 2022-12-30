let controlCanvas = document.getElementById("controlCanvas");
let ctxControlCanvas = controlCanvas.getContext('2d');
let rect;

controlCanvas.width = document.getElementsByTagName("body")[0].clientWidth * 4;
controlCanvas.height = document.getElementsByTagName("body")[0].clientHeight * 4;
controlCanvas.style.width = document.getElementsByTagName("body")[0].clientWidth + "px";
controlCanvas.style.height = document.getElementsByTagName("body")[0].clientHeight + "px";
ctxControlCanvas = controlCanvas.getContext('2d');
rect = controlCanvas.getBoundingClientRect();

window.addEventListener("resize", () => {
    controlCanvas.width = document.getElementsByTagName("body")[0].clientWidth * 4;
    controlCanvas.height = document.getElementsByTagName("body")[0].clientHeight * 4;
    controlCanvas.style.width = document.getElementsByTagName("body")[0].clientWidth + "px";
    controlCanvas.style.height = document.getElementsByTagName("body")[0].clientHeight + "px";
    ctxControlCanvas = controlCanvas.getContext('2d');
    rect = controlCanvas.getBoundingClientRect();
});

let imgControlCenter = new Image();
imgControlCenter.src = "./images/control_mobile/control_mobile_.png";
let imgControlRight = new Image();
imgControlRight.src = "./images/control_mobile/control_mobile_right.png";
let imgControlLeft = new Image();
imgControlLeft.src = "./images/control_mobile/control_mobile_left.png";
let imgControlDown = new Image();
imgControlDown.src = "./images/control_mobile/control_mobile_down.png";
// let imgControlUp = new Image();
// imgControlUp.src = "./images/control_mobile/control_mobile_up.png";
let imgControlRightDown = new Image();
imgControlRightDown.src = "./images/control_mobile/control_mobile_right_down.png";
let imgControlLeftDown = new Image();
imgControlLeftDown.src = "./images/control_mobile/control_mobile_left_down.png";
// let imgControlRotate = new Image();
// imgControlRotate.src = "./images/control_mobile/control_mobile_rotate.png";

let scaleOfImage = 1;

// let isPrintingRotateImage = false;

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
    // if (isUp)
    //     img = imgControlUp;
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
let hasDoubleTap = false;
// let isRotate = false;
// let isUp = false;
function controllerTouch() { //set the touch controller
    let gameTouchController = null;
    let xTouchPositionStart = null;
    let yTouchPositionStart = null;
    let xDiff = null;
    let yDiff = null;
    let movingTouchHorizontal = null;
    let movingTouchVertical = null;
    let rotateOrNot = null;
    rect = controlCanvas.getBoundingClientRect();

    gameTouchController = document.getElementById("controlCanvas");

    gameTouchController.addEventListener("touchstart", setStartTouchPosition, true);
    gameTouchController.addEventListener("touchmove", startMove, true);
    gameTouchController.addEventListener("touchend", endMove, true);

    function setStartTouchPosition(event) {
        const touch = event.touches[0];
        xTouchPositionStart = touch.clientX;
        yTouchPositionStart = touch.clientY;
        xPositionImageControl = (xTouchPositionStart - rect.left) * controlCanvas.width / rect.width;
        yPositionImageControl = (yTouchPositionStart - rect.top) * controlCanvas.height / rect.height;
        isTouching = true;
        isPrintControllerMobile = true;
        printControllerMobile();
    }

    function startMove(event) {

        const touch = event.touches[0];
        const sensitivityXAxis = 30;
        const sensitivityYAxis = 60;
        let xTouchPositionEnd = touch.clientX;
        let yTouchPositionEnd = touch.clientY;

        xDiff = xTouchPositionStart - xTouchPositionEnd;
        yDiff = yTouchPositionStart - yTouchPositionEnd;

        if (!isPaused && !isGameOver) {
            if (xDiff > -sensitivityXAxis && xDiff < sensitivityXAxis) { //only moves horizontal
                clearInterval(movingTouchHorizontal);
                isMovingRight = false;
                isMovingLeft = false;
                printGame(letter[0]);
            }
            if (yDiff > -sensitivityYAxis && yDiff < sensitivityYAxis) { //only moves vertical
                clearInterval(movingTouchVertical);
                isMovingDown = false;
                isRotate = false;
                printGame(letter[0]);
            }
            if (xDiff < -sensitivityXAxis && !isMovingRight) { //moves to right
                isMovingRight = true;
                changeDirection('R');
                shadowPiece();
                printGame(letter[0]);
                movingTouchHorizontal = setInterval(() => {
                    changeDirection('R');
                    shadowPiece();
                    printGame(letter[0]);
                }, 125);
            }
            if (xDiff > sensitivityXAxis && !isMovingLeft) { //moves to left
                isMovingLeft = true;
                changeDirection('L');
                shadowPiece();
                printGame(letter[0]);
                movingTouchHorizontal = setInterval(() => {
                    changeDirection('L');
                    shadowPiece();
                    printGame(letter[0]);
                }, 125);
            }
            if (yDiff < -sensitivityYAxis && !isMovingDown) { //moves down
                isMovingDown = true;
                downPiece(letter[0]);
                shadowPiece();
                printGame(letter[0]);
                movingTouchVertical = setInterval(() => {
                    downPiece(letter[0]);
                    shadowPiece();
                    printGame(letter[0]);
                }, 125);
            }
            printControllerMobile();
        }
    }

    function endMove() {
        if (!isMovingDown && !isMovingRight && !isMovingLeft) {
            if (!hasDoubleTap) {
                hasDoubleTap = true;
                rotateOrNot = setTimeout(() => {
                    hasDoubleTap = false;
                    ctxControlCanvas.clearRect(0, 0, controlCanvas.width, controlCanvas.height);
                }, 250);
                return;
            }
            else {
                clearTimeout(rotateOrNot);
                hasDoubleTap = false;
                ctxControlCanvas.clearRect(0, 0, controlCanvas.width, controlCanvas.height);
                let auxPiece = rotatePiece('R', piece);
                putPieceV1(auxPiece);
                shadowPiece();
                printGame(letter[0]);
            }
        }

        isMovingDown = false;
        isMovingRight = false;
        isMovingLeft = false;
        // isRotate = false;
        // isUp = false;
        isPrintControllerMobile = false;
        printGame(letter[0]);
        clearInterval(movingTouchHorizontal);
        clearInterval(movingTouchVertical);
        ctxControlCanvas.clearRect(0, 0, controlCanvas.width, controlCanvas.height);
    }
}

// function rotatePieceMobile() {
//     if (isPrintingRotateImage)
//         return;

//     isPrintingRotateImage = true;

//     let angle = 50;
//     ctxControlCanvas.globalAlpha = 0.8;

//     let intervalPrintRotate = setInterval(() => {
//         if (angle > 0) {
//             ctxControlCanvas.clearRect(0, 0, controlCanvas.width, controlCanvas.height);
//             ctxControlCanvas.drawImage(imgControlRotate, 0 + (xPositionImageControl - imgControlRotate.width / (scaleOfImage * 2)), 0 + (yPositionImageControl - imgControlRotate.height / (scaleOfImage * 2)), imgControlRotate.width * (scaleOfImage), imgControlRotate.height * (scaleOfImage));
//         }

//         if (angle <= 0 && angle >= -90) {
//             ctxControlCanvas.save();
//             ctxControlCanvas.clearRect(0, 0, controlCanvas.width, controlCanvas.height);

//             ctxControlCanvas.translate(xPositionImageControl, yPositionImageControl);
//             ctxControlCanvas.rotate((Math.PI / 180) * angle);
//             ctxControlCanvas.drawImage(imgControlRotate, 0 - (imgControlRotate.width / (2 / scaleOfImage)), 0 - (imgControlRotate.height / (2 / scaleOfImage)), imgControlRotate.width * (scaleOfImage), imgControlRotate.height * (scaleOfImage));

//             ctxControlCanvas.restore();
//         }

//         angle -= 3;

//         if (angle <= -200) {
//             clearInterval(intervalPrintRotate);
//             ctxControlCanvas.clearRect(0, 0, controlCanvas.width, controlCanvas.height);
//             isPrintingRotateImage = false;
//         }

//     }, 10);

// }

// function rotatePieceMobilePart1() {
//     let scaleOfImage = 1;

//     ctxControlCanvas.save();
//     ctxControlCanvas.clearRect(0, 0, controlCanvas.width, controlCanvas.height);

//     ctxControlCanvas.translate(controlCanvas.width / 2, controlCanvas.height / 2);
//     ctxControlCanvas.rotate((Math.PI / 180) * 90);
//     ctxControlCanvas.drawImage(imgControlRotate, 0 - (imgControlRotate.width / (2 / scaleOfImage)), 0 - (imgControlRotate.height / (2 / scaleOfImage)), imgControlRotate.width * (scaleOfImage), imgControlRotate.height * (scaleOfImage));

//     ctxControlCanvas.restore();

// }

// function rotatePieceMobilePart2() {
//     let scaleOfImage = 1;

//     ctxControlCanvas.clearRect(0, 0, controlCanvas.width, controlCanvas.height);
//     ctxControlCanvas.drawImage(imgControlRotate, (controlCanvas.width / 2) - (imgControlRotate.width / (2 / scaleOfImage)), (controlCanvas.height / 2) - (imgControlRotate.height / (2 / scaleOfImage)), imgControlRotate.width * (scaleOfImage), imgControlRotate.height * (scaleOfImage));

// }