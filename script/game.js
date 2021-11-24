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
let random = Math.floor(Math.random() * letters.length);
let letter = letters[random];
let block = createBlock(letter);
putPiece(block,0,3);
printGame(letter);

setInterval(()=>{
    let letters = ['T','Z','I','L','J','S','O'];
    let teste = testIfHavePiece();
    if(teste){
        downPiece(letter);
        printGame(letter);
    }
    else{
        let random = Math.floor(Math.random() * letters.length);
        letter = letters[random];
        block = createBlock(letter);
        putPiece(block,0,3);
        printGame(letter);
    }


},1000);

document.body.addEventListener('keydown', function (event) {
    const key = event.key;
    if(key === "A" || key === "a"){
        changeDirection('L');
        printGame(letter);
    }
    if(key === "D" || key === "d"){
        changeDirection('R');
        printGame(letter);
    }
    if(key === "S" || key === "s"){
        downPiece(letter);
        printGame(letter);
    }
    if(key === "E" || key === "e"){
        block = rotatePiece('L',block)
        putPiece(block,wherePiece('x'),wherePiece('y'));
        printGame(letter);
    }
    if(key === "Q" || key === "q"){
        block = rotatePiece('L',block);
        putPiece(block,wherePiece('x'),wherePiece('y'));
        printGame(letter);
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

    // for(let x=length;x>=0;x--){

    //     if(x !== length){
    //         for(let y=0;y< m[x].length ;y++){
    //             if(m[x][y] === 1){
    //                 if(m[x+1][y] !== 0 && m[x+1][y] !== 1){
    //                     count++;
    //                 }
    //             }
    //         }
    //     }
    // }
    // for(let x=length;x>=0;x--){
    //     if((m[x].indexOf(1) !== -1 && x !== length)){  //if the piece is not in the ground or in on top of another piece
    //         if(count === 0){    //if true, move the piece down
    //             for(let y=0;y< m[x].length ;y++){
    //                 if(m[x][y] === 1){
    //                     m[x][y] = 0;
    //                     m[x+1][y] = 1;
    //                 }
    //             }
    //         }
    //     }
    // }
    //         // console.log("entrou");
    //         for(let x=length;x>=0;x--){
    //             if((m[x].indexOf(1) !== -1 && ( x === length || count > 0 )) ){//else if the piece is in the ground or in on top of another piece 
    //             for(let y=0;y< m[x].length ;y++){
    //                 // console.log("O valor é "+ m[x][y]);
    //                 // console.log("A condição (m[x][y] === 1) é "+(m[x][y] === 1));
    //                 // console.log("--------------------------------------------------------");
    //                 if(m[i][y] === 1){
    //                     // console.log("certo 2");
    //                     m[i][y] = letter;
    //                 }
    //             }
    //         }
    //         for(let x=0;x<length;x++){
    //             if((m[x].indexOf(1) !== -1 && ( x === length || count > 0 )) ){//else if the piece is in the ground or in on top of another piece 
    //             for(let y=0;y< m[x].length ;y++){
    //                 // console.log("O valor é "+ m[x][y]);
    //                 // console.log("A condição (m[x][y] === 1) é "+(m[x][y] === 1));
    //                 // console.log("--------------------------------------------------------");
    //                 if(m[i][y] === 1){
    //                     // console.log("certo 2");
    //                     m[i][y] = letter;
    //                 }
    //             }
    //         }
    //     }
    //     // console.log("--------------------------------------------");
        
    

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

function putPiece(block, xAux, yAux){ //put the pieces in the matrix
    
    if(collide(block,xAux,yAux) === 0){
        clearArena();

        let count1 = 0;
        for(let x=xAux; x<= (xAux+(block.length-1)) ; x++){
            let count2 = 0;
            for(let y=yAux; y<=(yAux+(block[0].length-1)) ; y++){
                m[x][y] = block[count1][count2];
                count2++;
            }
            count1++;
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
        let count1 = 0;
        for(let y = (blockAux[0].length-1); y >= 0  ; y--){
            let count2 = 0;
            let row = [];
            for(let x = 0; x< (blockAux.length); x++){
                row.push(blockAux[x][y]);
                count2++;
            }
            // console.log("Linha "+y);
            mRes.push(row);
            count1++;
        }
        console.log(mRes)
        console.log(blockAux)
        
    }

    return mRes;

}

function wherePiece(axis){
    let xAux ;
    let yAux ;

    for(let x=0; x<m.length; x++){
        if(m[x].indexOf(1) !== -1){
            xAux = x;
            yAux = m[x].indexOf(1);
            x = 1000;
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
                return 1;
            }
        }
    }
    return 0;
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




