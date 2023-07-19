

let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width = 900;
canvas.height = 550;
document.body.appendChild(canvas);

let background,hero,beam,ghost,gameover
let gameOver = false
let score = 0
//히어로 좌표
let heroX = canvas.width/2-43;
let heroY = canvas.height-87;

let beamlist = [] //빔들을 저장하는 리스트
function beams() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = heroX + 12
        this.y = heroY
        this.alive = true // true면 살아있는 빔
        beamlist.push(this)
    } //초기화
this.update  = function() {
    this.y -= 7;
}

this.checkHit = function() {
        
    for(let i = 0; i < ghostList.length; i++) {
    if(
        this.y <= ghostList[i].y &&
        this.x >= ghostList[i].x &&
        this.x <= ghostList[i].x + 90)
        {score++;
        this.alive = false; // 죽은 빔
        ghostList.splice(i, 1);
        }
    }
  }
}

function random(min,max) {
    let randomNum = Math.floor(Math.random()*(max-min+1)) + min
    return randomNum
}

let ghostList = []
function ghosts() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.y = 0
        this.x = random(0, canvas.width-87)

        ghostList.push(this)
    }
    this.update = function() {
        this.y += 3;

        if(this.y >= canvas.height - 48) {
            gameOver = true;
        }
    }
}

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = "img/background.PNG";

    heroImage = new Image();
    heroImage.src = "img/hero.png";

    beamImage = new Image();
    beamImage.src = "img/beam.png";

    ghostImage = new Image();
    ghostImage.src = "img/ghost.png";

    gameoverImage = new Image();
    gameoverImage.src = "img/gameover.png";
}

let keysDown={}
function setupKeyboardListener() {
    document.addEventListener("keydown", function(event) {
        keysDown[event.keyCode] = true;
    });
    document.addEventListener("keyup", function(event) {
        delete keysDown[event.keyCode];
    if(event.keyCode == 32){
        createBeam() // 빔 생성
    }
    });
}

function createBeam() {
    let b = new beams() //빔 하나 생성
    b.init()
}


function createGhost() {
    const interval  = setInterval(function() {
        let e = new ghosts()
        e.init()
    },1200)
}

function update() {
    if(39 in keysDown) {
        heroX += 10;     //hero 속도
    } //right
    if(37 in keysDown) {
        heroX -= 10;
    } //left
    if(heroX <= 0) {
        heroX = 0
    }
    if(heroX > canvas.width-87) {
        heroX = canvas.width-87
    }

    for(let i = 0; i < beamlist.length; i++) {
        if(beamlist[i].alive) {
        beamlist[i].update();
        beamlist[i].checkHit();
        }
    }

    for(let i = 0; i < ghostList.length; i++) {
        ghostList[i].update();
    }
}

function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(heroImage, heroX, heroY);
    ctx.fillText(`score : ${score}`, 20, 35);
    ctx.fillStyle = "white";
    ctx.font = "25px Arial";
    
    for(let i = 0; i < beamlist.length; i++) {
        if(beamlist[i].alive) {
            ctx.drawImage(beamImage, beamlist[i].x, beamlist[i].y); 
        }
    }

    for(let i = 0; i < ghostList.length; i++) {
        ctx.drawImage(ghostImage, ghostList[i].x, ghostList[i].y);
    }
}

function main() {
    if(!gameOver) {
    update();
    render();
    requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameoverImage, 320, 120, 250, 250);
    }
}

loadImage();
setupKeyboardListener();
main();
createGhost();