const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 100;
canvas.height = 200;

ctx.fillStyle = "#2a2a30";
ctx.fillRect(0,0,canvas.width,canvas.height);
document.getElementById("game").parentNode.replaceChild(canvas,document.getElementById("game"));

let m = new Array();
m = makeMatrix(10,20);
console.log(m);

let letters = ['T','Z','I','L','J','S','O'];
let letter;
let random = Math.floor(Math.random() * letters.length);
let block = createBlock(letters[random]);
letter = letters[random];
putPiece(block);
printGame(letter);

setInterval(()=>{
    let letters = ['T','Z','I','L','J','S','O'];
    let teste = downPiece(letter);
    if(teste){
        printGame(letter);
    }
    else{
        let random = Math.floor(Math.random() * letters.length);
        let block = createBlock(letters[random]);
        letter = letters[random];
        putPiece(block);
    }


},1000);

document.body.addEventListener('keydown', function (event) {
    const key = event.key;
    if(key === "A" || key === "a"){
        changeDirection('L');
    }
    if(key === "D" || key === "d"){
        changeDirection('R');
    }
});

function printGame(letter){ //print the game with the colors of the pieces
    for(let x=0;x< m.length ;x++){
        for(let y=0;y< m[x].length ;y++){
            if(m[x][y] === 1){
                ctx.fillStyle = colors(letter);
                ctx.fillRect(y*10,x*10,(y+10),(x+10));
            }
            else if(m[x][y] === 0){
                ctx.fillStyle = '#2a2a30';
                ctx.fillRect(y*10,x*10,(y+10),(x+10));
            }
            else if(m[x][y] !== 1 && m[x][y] !== 0){
                ctx.fillStyle = colors(m[x][y]);
                ctx.fillRect(y*10,x*10,(y+10),(x+10));
            }
        }
    }
}

function downPiece(letter){ //move the piece down
    let length = (m.length-1);
    for(let x=length;x>=0;x--){
        if((m[x].indexOf(1) !== -1 && x !== length)){  //if the piece is not in the ground or in on top of another piece
            if(m[x+1].reduce(testIfUnderIsEmpty) === (m[x+1].length-1)){
                m[x+1].fill(1,m[x].indexOf(1),(m[x].lastIndexOf(1)+1)); //if true, move the piece down
                m[x].fill(0,m[x].indexOf(1),(m[x].lastIndexOf(1)+1));
            }
        }
        if((m[x].indexOf(1) !== -1 && x === length) ){//if the piece is in the ground 
               m[x].fill(letter,m[x].indexOf(1),(m[x].lastIndexOf(1)+1)); // if true, freeze the piece
            }
        
        if((m[x].indexOf(1) !== -1 && x !== length) || //if the piece is in on top of another piece
            (m[x].indexOf(1) !== -1 && m[x+1].reduce(testIfUnderIsEmpty) < (m[x+1].length-1) ) ){
            mAux = m[x+1].slice(m[x+1].reduce(indexDifferent0),m[x+1].reduceRight(indexDifferent0));
            if(mAux.length > 0){
                m[x].fill(letter,m[x].indexOf(1),(m[x].lastIndexOf(1)+1)); // if true, freeze the piece
            }
        }
    }


    let count = 0;
    for(let x=length;x>=0;x--){
        if(m[x].indexOf(1) === -1){ //check if exist a free piece in the matrix
            count++;
        }
    }

    if(count === m.length){
        return false; //return false if there is no free piece in the matrix
    }
    else{
        return true;  //return true if there is a free piece in the matrix
    }
} 

testIfUnderIsEmpty = (acumulador, valorAtual, index, array) =>{
    if(valorAtual === 0){
        acumulador++;
    }
    return acumulador;
}

indexDifferent0 = (acumulador, valorAtual, index, array) =>{
    if(valorAtual !== 0){
        return index;
    }
}

function putPiece(block){ //put the pieces in the matrix
    
    let count1 = 0;
    for(let y=0;y<= 2;y++){
        let count2 = 0;
        for(let x=3;x<= 7;x++){
            m[y][x] = block[count1][count2];
            count2++;
        }
        count1++;
    }

}

function changeDirection(direction){ //change the direction of the piece
    for(let x=0;x< m.length ;x++){
        for(let y=0;y< m[x].length ;y++){
            if(m[x][y] === 1){
                if(direction === "R"){
                    m[x][y] = 0;
                    m[x][y+1] = 1;
                }
                else if(direction === "L"){
                    m[x][y] = 0;
                    m[x][y-1] = 1;
                }
            }
        }
    }
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
        return [[0,0,1,0,0],
                [0,1,1,1,0],
                [0,0,0,0,0]];  
    }
    if(op === 'Z'){
        return [[0,1,1,0,0],
                [0,0,1,1,0],
                [0,0,0,0,0]];  
    }
    if(op === 'I'){
        return [[0,1,1,1,1],
                [0,0,0,0,0],
                [0,0,0,0,0]];  
    }
    if(op === 'L'){
        return [[0,0,1,0,0],
                [0,0,1,0,0],
                [0,0,1,1,0]];  
    }
    if(op === 'J'){
        return [[0,0,1,0,0],
                [0,0,1,0,0],
                [0,1,1,0,0]];  
    }
    if(op === 'S'){
        return [[0,0,1,1,0],
                [0,1,1,0,0],
                [0,0,0,0,0]];  
    }
    if(op === 'O'){
        return [[0,0,1,1,0],
                [0,0,1,1,0],
                [0,0,0,0,0]];  
    }
}

function colors(op){ //change the colors of the pieces
    if(op === 'T'){
        return 'red';
    }
    if(op === 'Z'){
        return 'blue';
    }
    if(op === 'I'){
        return 'green';
    }
    if(op === 'L'){
        return 'yellow';
    }
    if(op === 'J'){
        return 'orange';
    }
    if(op === 'S'){
        return 'purple';
    }
    if(op === 'O'){
        return 'white';
    }
}




