
var gameStatus = 1;
var worldSize = {
    x:10,
    y:10
}
var world=[];
var worldDict = {
    0: 'blank',
    1: 'wall',
    2: 'sushi',
    3: 'onigiri'
}

var score = 0, lives = 3;
var scoreDict = {
    'wall': 0,
    'blank':0,
    'sushi': 10,
    'onigiri': 5
}

var ninjaman = {
    x: 0,
    y: 0
}

var ghostPictures = ['img/bluey.gif','img/red.gif','img/pinky.gif','img/pumpky.gif'];
var ghostFreezeTime = 5;
var ghosts = [];

function createWorld(){
    world = [];

    for(let y = 0; y < worldSize.y -1; y++) {
        var row = [];
        for(var i = 0; i < worldSize.x - 1; i++) {
            row.push(
                    Math.floor(
                        Math.random() * (Math.max(...Object.keys(worldDict))+1)
                        )
                    );
        }
        world.push(row);
        console.log(Math.max(...Object.keys(worldDict))+1);
    }

    for(var x=0; x < worldSize.x; x++){
        if(world[0][x]==1) world[0][x]=0;
    }
}

createWorld();

function updateScoreCard(score){
    document.getElementById('scorecard').innerHTML = "PUNTAJES: " + score.toString();

}

function drawWorld(){
    output = "";
    
    for (var row = 0; row < world.length; row++){
        output += "<div class='row'>";
        for(var x = 0; x < world[row].length; x++){
            output += "<div class='"+worldDict[world[row][x]]+"'></div>";
        }
        output += "</div>";
    }
    
    document.getElementById('world').innerHTML = output;
}

drawWorld();

function drawNinjaman(){
    document.getElementById('ninjaman').style.top = ninjaman.y * 40 + 'px';
    document.getElementById('ninjaman').style.left = ninjaman.x * 40 + 'px';
    world[0][0]=0;
}

drawNinjaman();

function getRandomWorldPos(axis){
    if (axis == 'x'){ 
        return Math.floor(
                        Math.random() * (Math.max(worldSize.x)-1)
                        );
    }
    else if(axis == 'y') {
        return Math.floor(
                        Math.random() * (Math.max(worldSize.y)-1)
                        );
    }
}

function initGhosts(){
    for (let i=0; i< ghostPictures.length;i++){
        var startPos = {
            x: getRandomWorldPos('x'),
            y: getRandomWorldPos('y')
        }

        ghosts[i] = {
            x: startPos.x,
            y: startPos.y,
            frozen: 0,
            coreImage: ghostPictures[i],
            scaredImage: 'img/scaredy.png'
        }
    }

    drawGhosts();
}

function freezeGhost(ghostNumber) {
    ghosts[ghostNumber-1].frozen = ghostFreezeTime;
            document.getElementById('ghost'+ghostNumber).style.backgroundImage = "url('"+ghosts[ghostNumber-1].scaredImage+"')";
}

function unfreezeGhost(ghostNumber) {
    document.getElementById('ghost'+ghostNumber).style.backgroundImage="url('"+ghosts[ghostNumber-1].coreImage+"')";
}

function moveGhosts(){
    for (var i=1; i<= ghosts.length;i++){
        var arrayPos = i-1;

        
        if(ghosts[arrayPos].x == ninjaman.x && ghosts[arrayPos].y == ninjaman.y) {
            freezeGhost(i);
            break;
        }

        if(ghosts[arrayPos].frozen > 0) {
            ghosts[arrayPos].frozen--;
            if(ghosts[arrayPos].frozen==0)
                unfreezeGhost(i);
            break;
        }

        
        if(ghosts[arrayPos].x > ninjaman.x && world[ghosts[arrayPos].y][ghosts[arrayPos].x-1] != 1) 
            ghosts[arrayPos].x--;
        else if(ghosts[arrayPos].x < ninjaman.x && world[ghosts[arrayPos].y][ghosts[arrayPos].x+1] != 1) 
            ghosts[arrayPos].x++;
        else if(ghosts[arrayPos].y > ninjaman.y && world[ghosts[arrayPos].y-1][ghosts[arrayPos].x] != 1) 
            ghosts[arrayPos].y--;
        else if(ghosts[arrayPos].y < ninjaman.y && world[ghosts[arrayPos].y+1][ghosts[arrayPos].x] != 1) 
            ghosts[arrayPos].y++;

        
        checkGhostHit(i);
    }

}

function decrementLives(){
    lives--;
    document.getElementById('lives').innerHTML = ": " + lives.toString();
    if(lives==0) gameOver();
    return;
}

function gameOver() {
    document.getElementById('scorecard').innerHTML = "PUNTAJE: " + score + " HAZ MUERTO KP ";
    gameStatus = 0;
    return;
}

function drawGhosts() {
    console.log("drawGhosts()");
    for (let i=1; i<= ghosts.length;i++){
        document.getElementById('ghost'+i).style.top = ghosts[i-1].y * 40 + 'px';
        document.getElementById('ghost'+i).style.left = ghosts[i-1].x * 40 + 'px';
    }
}

initGhosts();

function checkGhostHit(ghostNumber){
    console.log("checkGhostHit()");
    var arrayPos =ghostNumber-1;
    if(ghosts[arrayPos].x == ninjaman.x && ghosts[arrayPos].y == ninjaman.y 
        && ghosts[arrayPos].frozen == 0) {
        freezeGhost(ghostNumber);
        decrementLives();
    }
}

function freezeScaredGhosts() {
    console.log("freezeScaredGhosts()");

    for(var i=1; i<=ghosts.length; i++){
        var arrayPos=i-1

        checkGhostHit(i);

    
        if(ghosts[arrayPos].y == ninjaman.y) {
            var worldRow = world[ninjaman.y];
            
            
            for (var b = ninjaman.x; b <= ghosts[arrayPos].x; b++)
            { 
                console.log("writing compare "+ghosts[arrayPos].x
                    +"  ---  "+ninjaman.x.toString()
                    +"  ---  "+worldRow[b]);

                if(worldRow[b] == 1) break;
                else if(b == ghosts[arrayPos].x)						
                    freezeGhost(i);						
            }
        }

    }
}

document.onkeydown = function(e){

    var nextPos = {
        x: ninjaman.x,
        y: ninjaman.y
    }

    if(gameStatus == 0) {
        gameOver();
        return;
    }
    
    if(e.keyCode == 37) {
        nextPos.x = ninjaman.x-1;
        if(world[ninjaman.y][nextPos.x] != 1 && nextPos.x >= 0)
            ninjaman.x--;
    }
    else if (e.keyCode == 39) {
        nextPos.x = ninjaman.x+1;
        if(world[ninjaman.y][nextPos.x] != 1 && nextPos.x < worldSize.x-1)
            ninjaman.x++;
    }
    else if (e.keyCode == 40 ) { 
        nextPos.y = ninjaman.y+1;
        if(world[nextPos.y][ninjaman.x] != 1 && nextPos.y  < worldSize.y-1)
            ninjaman.y++;
    }
    else if (e.keyCode == 38 ) {
        nextPos.y = ninjaman.y-1;
        if(world[nextPos.y][ninjaman.x] != 1 && nextPos.y >= 0)
            ninjaman.y--;
    }

    freezeScaredGhosts();
                        
    score += scoreDict[worldDict[
        world[ninjaman.y][ninjaman.x]
    ]];

    console.log(score);    		

    world[ninjaman.y][ninjaman.x] = 0;
    moveGhosts();
    drawGhosts();
    drawNinjaman();
    drawWorld();
    updateScoreCard(score);
}
