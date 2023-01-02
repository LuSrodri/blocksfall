

function controllerKeyboard() { //set the controller
    document.body.addEventListener('keydown', function (event) {
        const key = event.key;

        if (key === "A" || key === "a" || key === "ArrowLeft") {
            socket.emit("change direction of piece", "L");
        }
        if (key === "D" || key === "d" || key === "ArrowRight") {
            socket.emit("change direction of piece", "R");
        }
        if (key === "S" || key === "s" || key === "ArrowDown") {
            socket.emit("down the piece");
        }
        if (key === "E" || key === "e" || key === " " || key === "ArrowUp") {
            socket.emit("rotate the piece", "R");
        }
        if (key === "Q" || key === "q") {
            socket.emit("rotate the piece", "L");
        }

    });
}