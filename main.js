

let canvas;
let ctx;
canvas = document.getElementById("canvas")
ctx = canvas.getContext("2d")
canvas.width = 890;
canvas.height = 550;
document.body.appendChild(canvas);


let bg,hero,lightning,ghost,gameover
let gameOver = false
// let restartButton = document.getElementById("restart")
let score = 0
let heroX = canvas.width/2-43;
let heroY = canvas.height-87;

let mouse = {
    x: null, y:null
}

canvas.addEventListener('click', function(event) {
    location.reload();
    mouse.x = event.x;
    mouse.y = event.y;
})


let lightningList = []
function lightnings() {
    this.x = 0
    this.y = 0
    this.init = function() {
        this.x = heroX + 20
        this.y = heroY
        this.alive = true
        lightningList.push(this)
    }
    this.update = function() {
        this.y -= 7;   //번개 속도
    }

    this.hit = function() {

    for(let i = 0; i < ghostList.length; i++) {
        if(
            this.y <= ghostList[i].y &&
            this.x >= ghostList[i].x &&
            this.x <= ghostList[i].x + 50)
        {score++;
        this.alive = false;
        ghostList.splice(i, 1)   //맞았으면 빔도 사라지기
        }
    }
  }
}


function random(max, min) {
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}

let ghostList = []
function ghosts() {
    this.x = 0
    this.y = 0
    this.init = function() {
        this.y = 0
        this.x = random(0, canvas.width-87)

        ghostList.push(this)
    }
    this.update = function() {
        this.y += 3;

        if(this.y >= canvas.height - 61) {
            gameOver = true;
            // restartButton.style.display = "flex"
        }
    }
}


// restartButton.addEventListener("click", () => {
//     location.reload()
//     })


function loadImage() {
    bgImg = new Image();
    bgImg.src = "img/background.PNG"

    heroImg = new Image();
    heroImg.src = "img/hero.png";

    lightningImg = new Image();
    lightningImg.src = "img/lightning.png"

    ghostImg = new Image();
    ghostImg.src = "img/ghost.png"

    gameoverImg = new Image();
    gameoverImg.src = "img/gameover.png"

    restartImg = new Image();
    restartImg.src = "img/restart.png"
}


let keysDown = {}
function setupKeyboard() {
    document.addEventListener("keydown", function(event) {
        keysDown[event.keyCode] = true;
    });
    document.addEventListener("keyup", function(event) {
        delete keysDown[event.keyCode];
        if(event.keyCode == 32){
            createLightning()
        }
    });
}

function createLightning() {
    let b = new lightnings()
    b.init()
}

function createGhost() {
    const interval = setInterval(function() {
        let e = new ghosts()
        e.init()
    },1200)
}



function update() {
    if (39 in keysDown) {
        heroX += 10;
    }
    if (37 in keysDown) {
        heroX -= 10;
    }
    if (heroX <= 0) {
        heroX = 0
    }
    if(heroX > canvas.width-87) {
        heroX = canvas.width-87
    }
    for(let i = 0; i < lightningList.length; i++) {
        if(lightningList[i].alive) {
            lightningList[i].update();
            lightningList[i].hit();
        }
    }
    for(let i = 0; i < ghostList.length; i++) {
        ghostList[i].update();
    }
}

function render() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(heroImg, heroX, heroY)
    ctx.fillText(`score : ${score}`, 20, 35)
    ctx.fillStyle = "white";
    ctx.font = "25px Sans-serif";

    for(let i = 0; i < lightningList.length; i++) {
        if(lightningList[i].alive) {
            ctx.drawImage(lightningImg, lightningList[i].x, lightningList[i].y)
        }
    }
    for(let i = 0; i < ghostList.length; i++) {
        ctx.drawImage(ghostImg, ghostList[i].x, ghostList[i].y)
    }
}

function main() {
    if(!gameOver) {
    update();
    render();
    requestAnimationFrame(main);
    }
    else {
        ctx.drawImage(gameoverImg, 320, 20, 250, 250)
        ctx.drawImage(restartImg, 420, 250, 50, 50)
    }
}


loadImage();
setupKeyboard();
main();
createGhost();
