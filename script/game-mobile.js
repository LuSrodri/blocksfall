
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1200;
canvas.height = 1600;
canvas.className = "canvasMobile";

ctx.fillStyle = "#2a2a30";
ctx.fillRect(0,0,canvas.width,canvas.height);
document.getElementById("game").parentNode.replaceChild(canvas,document.getElementById("game"));

let m = new Array();
m = makeMatrix(12,16);
//console.log(m);

let openAux = true;

let letters = ['T','Z','I','L','J','S','O'];
let random = Math.floor(Math.random() * letters.length);
let letter = letters[random];
let block = createBlock(letter);
putPiece(block,0,3);
printGame(letter);
let xPosition = wherePiece('x');
let yPosition = wherePiece('y');
let scoreGame = 0;

let rodando = setInterval(()=>{
    setRecord();
    let letters = ['T','Z','I','L','J','S','O'];
    let teste = testIfHavePiece();
    if(ifCatchTop()){
        clearInterval(rodando);
    }

    if(openAux){

        if(teste){
            downPiece(letter);
            printGame(letter);
            xPosition = wherePiece('x');
            yPosition = wherePiece('y');
        }
        else if(verifyIfCompleteALine() >= 0){
            while(verifyIfCompleteALine() >= 0){
                m = clearLine(m,verifyIfCompleteALine());
                printGame();
                updateScore();
            }
        }
        else{
            let random = Math.floor(Math.random() * letters.length);
            letter = letters[random];
            block = createBlock(letter);
            putPiece(block,0,3);
            printGame(letter);
            xPosition = wherePiece('x');
            yPosition = wherePiece('y');
        }
    }
    // console.log("Posicao X = "+ xPosition);
    // console.log("Posicao y = "+ yPosition);

},1000);

document.body.addEventListener('keydown', function (event) {
    const key = event.key;
    if(openAux){

        if(key === "A" || key === "a" || key === "ArrowLeft"){
            changeDirection('L');
            printGame(letter);
            xPosition = wherePiece('x');
            yPosition = wherePiece('y');
        }
        if(key === "D" || key === "d" || key === "ArrowRight"){
            changeDirection('R');
            printGame(letter);
            xPosition = wherePiece('x');
            yPosition = wherePiece('y');
        }
        if(key === "S" || key === "s" || key === "ArrowDown"){
            downPiece(letter);
            printGame(letter);
            xPosition = wherePiece('x');
            yPosition = wherePiece('y');
        }
        if(key === "E" || key === "e" || key === " "){
            block = rotatePiece('R',block)
            putPiece(block,xPosition,yPosition);
            printGame(letter);
        }
        if(key === "Q" || key === "q"){
            block = rotatePiece('L',block);
            putPiece(block,xPosition,yPosition);
            printGame(letter);
        }
        key = null;
    }
});

function setRecord(){
    if(localStorage.getItem('scoreRecord') === null){
        localStorage.setItem('scoreRecord',scoreGame);
    }
    else{

        if(Number(localStorage.getItem('scoreRecord')) < scoreGame){
            localStorage.setItem('scoreRecord',scoreGame);
        }
    }
}

function ifCatchTop(){
    for(let i=0 ; i<m[0].length; i++){
        if(m[0][i] !== 0 && m[0][i] !== 1){
            //console.log("gameover!!!");
            gameOverPrint();
            return true;
        }
    }
    return false;
}

function gameOverPrint(){
    if(document.getElementById("dialogGameOver").hasAttribute("open")){
        document.getElementById("dialogGameOver").removeAttribute("open");
        return true;
    }
    else{
        document.getElementById("dialogGameOver").setAttribute("open",null);
        return false;
    }
}

function setOpenAux(op){
    openAux = op;
}

function updateScore(){
    let score = document.getElementsByClassName("score");
    for(let x = 0; x<score.length; x++){
        let scoreAux = score[x].innerHTML;
        scoreAux = parseInt(scoreAux);
        scoreAux += 10;
        document.getElementsByClassName("score")[x].innerHTML = scoreAux;
        scoreGame = scoreAux;
    }
}

function clearLine(mCL,xaux){
    let mat = makeMatrix(12,16);
    for(let x=(m.length-1) ; x>0; x--){
        mat[x] = mCL[x];
    }
    for(let x=(m.length-1) ; x>0; x--){
        if(x<=xaux){
            mat[x] = mCL[x-1];
        }
    }
    return mat;
}

function verifyIfCompleteALine(){
    for(let x=(m.length-1) ; x>=0; x--){
        if(m[x].indexOf(0) === -1 && m[x].indexOf(1) !== 1){
            //console.log("uma linha completa")
            return x;
        }
    }
    return -1;
}

function printGame(letter){ //print the game with the colors of the pieces
    for(let x=0;x< m.length ;x++){
        for(let y=0;y< m[x].length ;y++){
            if(m[x][y] === 1){
                ctx.fillStyle = colors(letter);
                ctx.fillRect(y*100,x*100,(y+100),(x+100));
                ctx.fillStyle = 'black';
                ctx.strokeRect(y*100,x*100,(y+100),(x+100));
            }
            else if(m[x][y] === 0){
                ctx.fillStyle = '#2a2a30';
                ctx.fillRect(y*100,x*100,(y+100),(x+100));
            }
            else if(m[x][y] !== 1 && m[x][y] !== 0){
                ctx.fillStyle = colors(m[x][y]);
                ctx.fillRect(y*100,x*100,(y+100),(x+100));
                ctx.fillStyle = 'black';
                ctx.strokeRect(y*100,x*100,(y+100),(x+100));
            }
        }
    }
}

function downPiece(letter){ //move the piece down
    let length = (m.length-1);
    let count = 0;

    for(let x = 0; x<= length; x++){
        for(let y = 0; y< m[x].length; y++){
            if(x !== (length)){
                if(m[x][y] === 1){
                    if(m[x+1][y] !== 1 && m[x+1][y] !==0){
                        count++;
                    }
                }
            } 
        }
    }   
    if(m[length].indexOf(1) !== -1){
        count++;
    }

    if(count > 0){
        for(let x = (length); x>=0 ; x--){
            for(let y = 0; y< m[x].length; y++){
                if(m[x][y] === 1){
                    m[x][y] = letter;
                }
            }
        }
    }
    else {
        for(let x = (length); x>=0 ; x--){
            for(let y = 0; y< m[x].length; y++){
                if(m[x][y] === 1){
                    m[x+1][y] = 1;
                    m[x][y] = 0;
                }
            }
        }
    }

} 

testIfLineIsOnly0 = (acumulador, valorAtual, index, array) =>{
    if(valorAtual === 0){
        acumulador++;
    }
    return acumulador;
}

indexDifferent0 = (acumulador, valorAtual, index, array) =>{
    let count = 0;
    if(valorAtual !== 0 && count === 0){
        acumulador = index;
        count++;
    }
    return acumulador;
}

function checkIfANumber(variab){
    if(variab >= 0 && variab <= 9){
        return true;
    }
    return false;
}

function testIfHavePiece(){
    
    let count = 0;
    let length = (m.length-1);
    for(let x=length;x>=0;x--){
        if(m[x].indexOf(1) !== -1){ //check if exist a free piece in the matrix
            count++;
        }
    }
    if(count > 0){
        return true; //return false if there is no free piece in the matrix
    }
    else{
        return false;  //return true if there is a free piece in the matrix
    }
}

function putPiece(blockpp, xAux, yAux){ //put the pieces in the matrix

    // xAux = Math.floor(xAux);
    // yAux = Math.floor(yAux);

    let right = true
    while(right){
        if(!collide(block,xAux,yAux)){
            right = false;
            clearArena();

            let count1 = 0;
            for(let x=xAux; x<= (xAux+(blockpp.length-1)) ; x++){
                let count2 = 0;
                for(let y=yAux; y<=(yAux+(blockpp[0].length-1)) ; y++){
                    m[x][y] = blockpp[count1][count2];
                    count2++;
                }
                count1++;
            }
        }
        else if(yAux>((m[0].length-1)-blockpp[0].length)){
            yAux--;
        }
        else{
            right = false;
        }
    }
}

function changeDirection(direction){ //change the direction of the piece
    let count = 0;
    for(let x=0;x< m.length ;x++){
        for(let y=0;y< m[x].length ;y++){
            if(direction === "L" && m[x][y] === 1 && (checkIfANumber(m[x][y-1]) === false || y === 0) ){
                count++;
            }
        }
    }
    for(let x=0;x< m.length ;x++){
        for(let y=(m[x].length-1);y>0  ;y--){
            if(direction === "R" && m[x][y] === 1 && (checkIfANumber(m[x][y+1]) === false || y === (m[x].length-1))){
                count++;
            }    
        }
    }
    for(let x=0;x< m.length ;x++){
        for(let y=0;y< m[x].length ;y++){
            if(m[x][y] === 1 && count === 0){
                if(direction === "L"){ //if the piece is not in the left border
                    if(y !== 0){
                        m[x][y] = 0;
                        m[x][y-1] = 1;
                    }
                }
            }
        }
        for(let y=(m[x].length-1);y>=0 ;y--){
            if(direction === "R" && m[x][y] === 1 && count === 0){
                if(direction === "R"){
                    if(y !== (m[x].length-1)){ //if the piece is not in the right border
                        m[x][y] = 0;
                        m[x][y+1] = 1;
                    }
                }
            }
        }
    }
}

function rotatePiece(direction,blockAux){ //rotate the piece
    
    let mRes = []; 
    
    if(direction === 'L'){
        for(let y = (blockAux[0].length-1); y >= 0  ; y--){
            let row = [];
            for(let x = 0; x< (blockAux.length); x++){
                row.push(blockAux[x][y]);
            }
            mRes.push(row);
        }
    }
    if(direction === 'R'){
        for(let y = 0 ; y < blockAux[0].length  ; y++){
            let row = [];
            for(let x = (blockAux.length-1); x>=0 ; x--){
                row.push(blockAux[x][y]);
            }
            mRes.push(row);
        }
    }
    // console.log(blockAux)
    // console.log(mRes)

    return mRes;

}

function wherePiece(axis){
    let xAux ;
    let yAux = m[0].length;

    for(let x=0; x<m.length; x++){
        if(m[x].indexOf(1) !== -1){
            if(xAux === undefined)
                xAux = x;
            if( m[x].indexOf(1) < yAux)
                yAux = m[x].indexOf(1);
        }
    }
    if(axis === 'x')
        return xAux;
    if(axis === 'y')
        return yAux;
}

function clearArena() {// clear piece with number 1

    for(let x=0; x<m.length; x++){
        for(let y=0; y<m[x].length; y++){
            if(m[x][y] === 1){
                m[x][y] = 0;
            }
        }
    }

}

function collide(block,xAux,yAux){ //verify if had collide

    for(let x=xAux; x<= (xAux+(block.length-1)) ; x++){
        for(let y=yAux; y<=(yAux+(block[0].length-1)) ; y++){
            if(m[x][y] !== 1 && m[x][y] !== 0 ){
                return true;
            }
        }
    }
    return false;
}


function makeMatrix(width,height){ //make the matrix with the width and height for the game
    let matrix = new Array();
    for(let y=0;y< height;y++){
        matrix[y] = new Array();
        for(let x=0;x< width;x++){
            matrix[y][x] = 0;
        }
    }
    return matrix;
}

function createBlock(op){//create the pieces by the option
    if(op === 'T'){
        return [[0,1,0],
                [1,1,1]];  
    }
    if(op === 'Z'){
        return [[1,1,0],
                [0,1,1]];  
    }
    if(op === 'I'){
        return [[1,1,1,1]];  
    }
    if(op === 'L'){
        return [[1,0],
                [1,0],
                [1,1]];  
    }
    if(op === 'J'){
        return [[0,1],
                [0,1],
                [1,1]];  
    }
    if(op === 'S'){
        return [[0,1,1],
                [1,1,0]];  
    }
    if(op === 'O'){
        return [[1,1],
                [1,1]];  
    }
}

function colors(op){ //change the colors of the pieces
    if(op === 'T'){
        return '#FF69B4';
    }
    if(op === 'Z'){
        return '#00BFFF';
    }
    if(op === 'I'){
        return '#98FB98';
    }
    if(op === 'L'){
        return 'yellow';
    }
    if(op === 'J'){
        return 'orange';
    }
    if(op === 'S'){
        return '#7B68EE';
    }
    if(op === 'O'){
        return '#F5DEB3';
    }
}




