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
let imgControlUp = new Image();
imgControlUp.src = "./images/control_mobile/control_mobile_up.png";
let imgControlRightDown = new Image();
imgControlRightDown.src = "./images/control_mobile/control_mobile_right_down.png";
let imgControlLeftDown = new Image();
imgControlLeftDown.src = "./images/control_mobile/control_mobile_left_down.png";

function printControllerMobile() {
    ctxControlCanvas.clearRect(0, 0, controlCanvas.width, controlCanvas.height)

    let img = new Image();

    img = imgControlCenter;
    if (isMovingRight)
        img = imgControlRight;
    if (isMovingLeft)
        img = imgControlLeft;
    if (isMovingDown)
        img = imgControlDown;
    if (isRotate)
        img = imgControlUp;
    if (isMovingRight && isMovingDown)
        img = imgControlRightDown;
    if (isMovingLeft && isMovingDown)
        img = imgControlLeftDown;

    let scaleOfImage = 1;

    ctxControlCanvas.globalAlpha = 0.8;
    ctxControlCanvas.drawImage(img, 0 + (xPositionImageControl - img.width/(scaleOfImage*2)), 0 + (yPositionImageControl-img.height/(scaleOfImage*2)), img.width/(scaleOfImage), img.height/(scaleOfImage));
}

let xPositionImageControl = null;
let yPositionImageControl = null;
let isMovingLeft = false;
let isMovingRight = false;
let isMovingDown = false;
let isRotate = false;
function controllerTouch() { //set the touch controller
    let gameTouchController = null;
    let xTouchPositionStart = null;
    let yTouchPositionStart = null;
    let xDiff = null;
    let yDiff = null;
    let movingTouchHorizontal = null;
    let movingTouchVertical = null;
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
        const sensitivity = 40;
        let xTouchPositionEnd = touch.clientX;
        let yTouchPositionEnd = touch.clientY;

        xDiff = xTouchPositionStart - xTouchPositionEnd;
        yDiff = yTouchPositionStart - yTouchPositionEnd;

        if (!isPaused && !isGameOver) {
            if (xDiff > -sensitivity && xDiff < sensitivity) { //only moves horizontal
                clearInterval(movingTouchHorizontal);
                isMovingRight = false;
                isMovingLeft = false;
                printGame(letter[0]);
            }
            if (yDiff > -sensitivity && yDiff < sensitivity) { //only moves vertical
                clearInterval(movingTouchVertical);
                isMovingDown = false;
                isRotate = false;
                printGame(letter[0]);
            }
            if (xDiff < -sensitivity && !isMovingRight) { //moves to right
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
            if (xDiff > sensitivity && !isMovingLeft) { //moves to left
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
            if (yDiff < -sensitivity && !isMovingDown) { //moves down
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
            if (yDiff > sensitivity && !isRotate && !isMovingDown && !isMovingRight && !isMovingLeft) { //rotate
                isRotate = true;
                let auxPiece = rotatePiece('R', piece);
                putPieceV1(auxPiece);
                shadowPiece();
                printGame(letter[0]);
            }
            printControllerMobile();
        }
    }

    function endMove() {
        if (!isMovingDown && !isMovingRight && !isMovingLeft && !isRotate) {
            let auxPiece = rotatePiece('R', piece);
            putPieceV1(auxPiece);
            shadowPiece();
            printGame(letter[0]);
        }

        isMovingDown = false;
        isMovingRight = false;
        isMovingLeft = false;
        isRotate = false;
        isPrintControllerMobile = false;
        printGame(letter[0]);
        clearInterval(movingTouchHorizontal);
        clearInterval(movingTouchVertical);

        ctxControlCanvas.clearRect(0, 0, controlCanvas.width, controlCanvas.height)
    }
}