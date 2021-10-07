const canvas = document.getElementById('game');
const context = canvas.getContext('2d');


context.scale(20,20);

function arenaSweep(){
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0 ; --y){
        for(let x = 0; x < arena[y].length; ++x){
            if(arena[y][x] === 0){
                continue outer;
            }
        }
        const row = arena.splice(y,1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount += 1;
    }
    
    
}


function collide(arena,player){//colisão do game com o chão e peças
    const [m, o] =[player.matrix,player.pos];
    for(let y = 0; y < m.length;y++){
        for(let x=0; x < m[y].length;x++){
            if(m[y][x] !== 0 && 
                (arena[y + o.y] &&
                arena[y + o.y][x + o.x])!==0){
                    return true;
                }
        }
    }
    return false;
};

function createMAtrix(w,h){
    const matrix = [];
    while (h--){
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type){
    if(type === 'T'){
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    } else if(type == 'O'){
        return [
            [2, 2],
            [2, 2],
        ];
    } else if(type == 'L'){
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if(type == 'J'){
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    } else if(type == 'I'){
        return [
            [0, 0, 0, 0],
            [5, 5, 5, 5],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
    } else if(type == 'S'){
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if(type == 'Z'){
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }

}

function desenhar(){//cria a arena do game
    context.fillStyle = '#000';
context.fillRect(0,0,canvas.clientWidth, canvas.height);
    desenharMatrix(arena,{x:0,y:0});
    desenharMatrix(player.matrix,player.pos);
}


function desenharMatrix(matrix, offset){//cria peça
        matrix.forEach((linha,y)=>{
            linha.forEach((valor, x)=>{
                if(valor!== 0){
                    context.fillStyle = colors[valor];
                    context.fillRect(x + offset.x
                                    ,y + offset.y,1,1)
                }
            });
        });
}

function merge(arena,player){
    player.matrix.forEach((linha,y)=>{
        linha.forEach((value, x)=>{
            if(value!== 0){
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        })
    })
}

function playerDrop(){
    player.pos.y++;
    if(collide(arena, player)){
        player.pos.y--;
        merge(arena,player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter=0;
}

function playerMove(dir){//nao deixa passar para os lados
    player.pos.x += dir;
    if(collide(arena,player)){
        player.pos.x -= dir;
    }
}

function playerReset(){
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                    (player.matrix[0].length / 2 | 0);
    if(collide(arena, player)){
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRotate(dir){//chama a funcao que ira rodar a peça, se for Q(-1) gira para a esquerda e W(1) gira para a direita
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir)
    while (collide(arena, player)){
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length){
            rotate(player.matrix, -dir);
            player.pos.x=pos;
            return;
        }
    }
}
function rotate(matrix,dir){//gira as pecas baseado na direcao
        for(let y = 0; y < matrix.length; ++y){
            for(let x = 0; x<y; ++x){
                [
                    matrix[x][y],
                    matrix[y][x],
                ] =[
                    matrix[y][x],
                    matrix[x][y],

                ];
            }
        }
        if(dir > 0){
            matrix.forEach(row => row.reverse());
        } else{
            matrix.reverse();
        }
}
let dropCounter = 0;
let dropInterval = 1000;

let lastTime =0;
function update(time = 0){
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;

    
    if(dropCounter > dropInterval){
        playerDrop();
    }


    desenhar();
    requestAnimationFrame(update)
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

const colors = [
    null,
    'red',
    'blue',
    'green',
    'yellow',
    'orange',
    'violet',
    'cyan',
]

const arena = createMAtrix(12,20);
const player = {
    pos:{x:0,y:0},
    matrix: null,
    score: 0,
}

document.addEventListener('keydown', event =>{//move com as setas e gira com Q e W 
if(event.keyCode === 37){//seta para a esquerda
    playerMove(-1);
} else if(event.keyCode === 39){//seta para a direita
    playerMove(1);
}else if(event.keyCode === 40){//Seta para baixo
    playerDrop();
}else if(event.keyCode === 81){//Q
    playerRotate(-1);
}else if(event.keyCode === 87){//W
    playerRotate(1);
}
})

playerReset();
updateScore();
update();

