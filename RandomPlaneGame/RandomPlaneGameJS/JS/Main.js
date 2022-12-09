

var ctx = document.getElementById("mCanvas").getContext("2d");
var up = false;
var down = false;
var right = false;

document.onkeydown = function(e) {
    if (e.keyCode == 87) {
        up = true;
    }
    if (e.keyCode == 83) {
        down = true;
    }
    if (e.keyCode == 68) {
        right = true;
    }
}

document.onkeyup = function(e) {
    if (e.keyCode == 87) {
        up = false;
    }
    if (e.keyCode == 83) {
        down = false;
    }
    if (e.keyCode == 68) {
        right = false;
    }
}

var plane = new Image();
plane.src = "Images/playerSprite.png";
var bg = new Image();
bg.src = "Images/Sky.png";
var cloud = new Image();
cloud.src = "Images/SkyNight.png";
var bullet = new Image();
bullet.src = "Images/fireBall.png";
var planeTwo = new Image();
planeTwo.src = "Images/plane2.png";
var smokePart = new Image();
smokePart.src = "Images/smoke.png";

class Cloud {
    x;
    y;
    w;
    h;
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.w = 1000;
        this.h = 600;
    }
    Update(xs, ys) {
        this.x += xs;
        this.y += ys;
        if (this.x < -1000) {
            this.x = 1000;
        }
        if (this.x > 1000) {
            this.x = -1000;
        }
        if (this.y < -600) {
            this.y = 600;
        }
        if (this.y > 600) {
            this.y = -600;
        }
    }
    Render() {
        ctx.drawImage(cloud, this.x, this.y, this.w, this.h);
    }
}

class Part {
    x;
    y;
    w;
    rot;
    speed;
    alpha;
    constructor(x, y, rot) {
        this.x = x;
        this.y = y;
        this.w = 25;
        this.rot = rot;
        this.speed = 5 + (Math.random() * 15);
        this.alpha = 1.0;
    }
    Update(velx, vely) {
        this.alpha -= 0.02;
        this.x += Math.cos(this.rot) * this.speed;
        this.y += Math.sin(this.rot) * this.speed;
        this.x += velx;
        this.y += vely;
    }
    Render() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(smokePart, -(this.w / 2), -(this.w / 2), this.w, this.w);
        ctx.restore();
    }
}

class Bullet {
    x;
    y;
    rot;
    speed;
    dead;
    constructor(x, y, rot) {
        this.x = x;
        this.y = y;
        this.rot = rot;
        this.speed = 40;
        this.dead = false;
    }
    Update(xv, yv) {
        console.log(this.x + "  " + this.y + "   " + this.rot);
        this.x += xv;
        this.y += yv;
        this.x += Math.cos(this.rot) * this.speed;
        this.y += Math.sin(this.rot) * this.speed;
        if (this.x > 1100 || this.x < -100 || this.y > 700 || this.y < -100){
            this.dead = true;
        }
    }
    Render() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(bullet, -50, -50, 100, 100);
        ctx.restore();
    }
}

class Enemy {
    x;
    y;
    rot;
    speed;
    dead;
    wave;
    witer;
    constructor() {
        var rand = Math.random() * 100;
        if (rand < 25) {
            this.x = -800;
            this.y = Math.random() * 600;
            this.rot = 0;
        } else if (rand < 50) {
            this.x = 1800;
            this.y = Math.random() * 600;
            this.rot = 180;
        } else if (rand < 75) {
            this.x = Math.random() * 900;
            this.y = -500;
            this.rot = 90;
        } else {
            this.x = Math.random() * 900;
            this.y = 500; 
            this.rot = 270;
        }
        this.rot *= Math.PI / 180.0;
        this.speed = (Math.random() * 10) + 10;
        this.dead = false;
        this.wave = false;
        this.witer = 0;
        if (Math.random() * 10 < 3) {
            this.wave = true;
        }
    }
    Update(velx, vely) {
        this.x += velx;
        this.y += vely;
        if (this.dead) {
            this.y += 10;
            this.rot += 0.15;
        } else {
            this.x += Math.cos(this.rot) * this.speed;
            this.y += Math.sin(this.rot) * this.speed;
            if (this.wave) {
                this.witer += 0.0001;
                this.rot += Math.sin(this.witer);
            }
        }
        if (this.x > 1800) {
            this.x = -800;
        }
        if (this.x < -800) {
            this.x = 1800;
        }
        if (this.y > 1000) {
            this.y = -500;
        }
        if (this.y < -500) {
            this.y = 1000;
        }
    }
    Render() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(planeTwo, -50, -25, 100, 50);
        ctx.restore();
    }
}

class Player {
    x;
    y;
    w;
    h;
    rot;
    velx;
    vely;
    speed;
    dead;
    constructor() {
        this.x = 450;
        this.y = 250;
        this.w = 100;
        this.h = 100;
        this.rot = 0.0;
        this.velx = 0.0;
        this.vely = 0.0;
        this.speed = 20.0;
        this.dead = false;
    }
    Render() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(plane, -this.w / 2, -this.h / 4, this.w, this.h / 2);
        ctx.restore();
    }
    Update() {
        if (this.dead) {
            this.rot += 0.15;
            this.y += 5;
        } else {    
            if (up) {
                this.rot -= 0.05;
            }
            if (down) {
                this.rot += 0.05;
            }
            this.velx = -(Math.cos(this.rot) * this.speed);
            this.vely = -(Math.sin(this.rot) * this.speed);
        }
    }   
}

var clouds = [];
for (var i = -1; i < 3; i++) {
    for (var j = -1; j < 3; j++) {
        clouds.push(new Cloud(j * 1000, i * 1000));
    }
}
var player = new Player();
var pdIter = 0;
var pdTime = 90;
var bullets = [];
var stime = 60;
var siter = 0;
var en = [];
var enIter = 0;
var enTime = 90;
var maxEn = 20;
var parts = [];

var score = 0;
var best = 0;
var menu = true;

function IsColliding(x, y, xtwo, ytwo, rad) {
    var dx = x - xtwo;
    var dy = y - ytwo;
    var dis = Math.sqrt(dx * dx + dy * dy);
    if (dis < rad) {
        return true;
    }
    return false;
}

function Render() {
    ctx.clearRect(0, 0, 1000, 600);
    //ctx.drawImage(bg, 0, 0, 1000, 600);
    for (var i = 0; i < clouds.length; i++) {
        clouds[i].Render();
    }
    for (var i = 0; i < parts.length; i++) {
        parts[i].Render();
    }
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].Render();
    }
    for (var i = 0; i < en.length; i++) {
        en[i].Render();
    }
    player.Render();
    if (menu) {
        ctx.font = "40px Verdana";
        ctx.fillText("Press W To Begin...", 50, 200);
        ctx.fillText("Best: " + best, 50, 50);
        ctx.fillText("Last: " + score, 50, 100);
    } else {
        ctx.font = "40px Verdana";
        ctx.fillText("Kills: " + score, 50, 50);
    }
}

function Update() {
    if (menu) {
        if (up) {
            menu = false;
            en.splice(0, en.length);
            bullets.splice(0, bullets.length);
            parts.splice(0, parts.length);
            player.y = 250;
            player.rot = 0;
            player.dead = false;
            score = 0;
        }
    } else {
        for (var i = 0; i < clouds.length; i++) {
            clouds[i].Update(player.velx, player.vely);
        }
        player.Update();
        siter++;
        if (right) {
            if (siter > stime) {
                bullets.push(new Bullet(player.x, player.y, player.rot));
                siter = 0;
            }
        }
        for (var i = 0; i < bullets.length; i++) {
            bullets[i].Update(player.velx, player.vely);
            if (bullets[i].dead) {
                bullets.splice(i, 1);
                continue;
            }
        }
        if (en.length < maxEn) {
            enIter++;
            if (enIter > enTime) {
                en.push(new Enemy());
                enIter = 0;
            }
        }
        for (var i = 0; i < en.length; i++) {
            en[i].Update(player.velx, player.vely);
            if (IsColliding(player.x, player.y, en[i].x, en[i].y, 75)) {
                player.dead = true;
            }
            for (var j = 0; j < bullets.length; j++) {
                if (IsColliding(bullets[j].x, bullets[j].y, en[i].x, en[i].y, 75)) {
                    en[i].dead = true;
                    bullets.splice(j, 1);
                    score++;
                    continue;
                }
            }
            if (en[i].dead && en[i].y > 800) {
                en.splice(i, 1);
                continue;
            }
            if (en[i].dead) {
                parts.push(new Part(en[i].x, en[i].y, en[i].rot));
            }
        }
        for (var i = 0; i < parts.length; i++) {
            parts[i].Update(player.velx, player.vely);
            if (parts[i].alpha < 0.1) {
                parts.splice(i, 1);
                continue;
            }
        }
        if (player.dead) {
            parts.push(new Part(player.x, player.y, player.rot - 180));
            pdIter++;
            if (pdIter > pdTime) {
                if (score > best) {
                    best = score;
                }
                menu = true;
            }
        } else {
            pdIter = 0;
        }
    }
    Render();
}

setInterval(Update, 1000 / 30);