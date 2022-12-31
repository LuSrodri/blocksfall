

function controllerKeyboard() { //set the controller
    document.body.addEventListener('keydown', function (event) {
        const key = event.key;
        if (!isPaused && !isGameOver) {

            if (key === "A" || key === "a" || key === "ArrowLeft") {
                changeDirection('L');
            }
            if (key === "D" || key === "d" || key === "ArrowRight") {
                changeDirection('R');
            }
            if (key === "S" || key === "s" || key === "ArrowDown") {
                downPiece(letter[0]);
            }
            if (key === "E" || key === "e" || key === " " || key === "ArrowUp") {
                rotatePiece('R', piece)
            }
            if (key === "Q" || key === "q") {
                rotatePiece('L', piece);
            }
        }
    });
}