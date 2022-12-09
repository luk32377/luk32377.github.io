var canvas = document.getElementById("mcanvas");
var ctx = canvas.getContext("2d");

var left = false;
var right = false;
var up = false;
var skip = false;
var tposx = 0;
var tposy = 0;
var tposxtwo = 0;
var tposytwo = 0;
var tdown = false;
var tdowntwo = false;

canvas.ontouchstart = function(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0];
    var tx = touch.clientX - rect.left;
    var ty = touch.clientY - rect.top;
    tposx = tx;
    tposy = ty;
    if (e.touches.length > 1) {
        var touchtwo = e.touches[1]; 
        tposxtwo = touchtwo.clientX - rect.left;
        tposytwo = touchtwo.clientY - rect.top;
        tdowntwo = true;
    }
    tdown = true;
}

canvas.ontouchmove = function(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0];
    var tx = touch.clientX - rect.left;
    var ty = touch.clientY - rect.top;    
    tposx = tx;
    tposy = ty;
    tdown = true;
}

canvas.ontouchend = function(e) {
    e.preventDefault();
    if (e.touches.length < 2) {
        tdown = false;
    }
}

var tileone = new Image();
tileone.src = "Images/Tile.png";
var tiletwo = new Image();
tiletwo.src = "Images/TileTwo.png";
var bg = new Image();
bg.src = "Images/Sky.png";
var slime = new Image();
slime.src = "Images/Slime.png";
chickenFrames = [];
chickenFrames.push(new Image());
chickenFrames.push(new Image());
chickenFrames[0].src = "Images/Chicken/Idle.png";
chickenFrames[1].src = "Images/Chicken/Run.png";
var scampers = [];
for (var i = 0; i < 3; i++) {
    scampers.push(new Image());
}
scampers[0].src = "Images/Scampers/Idle.png";
scampers[1].src = "Images/Scampers/Run.png";
scampers[2].src = "Images/Scampers/JumpFlip.png";
spike = new Image();
spike.src = "Images/Spikes.png";
var portal = new Image();
portal.src = "Images/Portal.png";

document.onkeydown = function(e) {
    if (e.keyCode == 65) {
        left = true;
    }
    if (e.keyCode == 68) {
        right = true;
    }
    if (e.keyCode == 87) {
        up = true;
    }
    if (e.keyCode == 80) {
        skip = true;  
    }
}

document.onkeyup = function(e) {
    if (e.keyCode == 65) {
        left = false;
    }
    if (e.keyCode == 68) {
        right = false;
    }
    if (e.keyCode == 87) {
        up = false;
    }
}

class Bounds {
    x;
    y;
    w;
    h;
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

function IsColliding(one, two) {
    if (one.x + one.w >= two.x) {
        if (two.x + two.w >= one.x) {
            if (one.y + one.h >= two.y) {
                if (two.y + two.h >= one.y) {
                    return true;
                }
            }
        }
    }
    return false;
}

class Tile {
    x;
    y;
    w;
    h;
    top;
    constructor(x, y, top) {
        this.x = x;
        this.y = y;
        this.w = 100;
        this.h = 100;
        this.top = top;
    }
    Update(vx, vy) {
        this.x += vx;
        this.y += vy;
    }
    Render() {
        if (this.top) {
            ctx.drawImage(tileone, this.x, this.y, this.w, this.h);
        } else {
            ctx.drawImage(tiletwo, this.x, this.y, this.w, this.h);
        }
    }
    GetBounds() {
        return new Bounds(this.x, this.y, this.w, this.h);
    }
};

class Slime {
    x;
    y;
    w;
    h;
    maxh;
    minh;
    speed;
    dir;
    grounded;
    iter;
    time;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 100;
        this.h = 100;
        this.speed = 10;
        this.dir = 0;
        this.iter = 0;
        this.time = 15;
        this.minh = 50;
        this.maxh = 100;
    }
    Update(dx, dy, tiles) {
        this.x += dx;
        this.y += dy;
        var xx = this.x - 500;
        var yy = this.y - 300;
        var dis = Math.sqrt(xx * xx + yy * yy);
        if (dis < 500) {
            if (!this.grounded) {
                for (var i = 0; i < tiles.length; i++) {
                    if (IsColliding(tiles[i].GetBounds(), new Bounds(this.x + 20, this.y, this.w - 40, this.h))) {
                        this.grounded = true;
                        if (this.x < 500) {
                            this.dir = -1;
                        } else {
                            this.dir = 1;   
                        }
                    }
                }
            }

            if (this.grounded) {
                this.y -= this.speed;
                var col = false;
                for (var i = 0; i < tiles.length; i++) {
                    if (IsColliding(tiles[i].GetBounds(), new Bounds(this.x + (this.dir * this.speed), this.y, this.w, this.h))) {
                        col = true;
                        break;
                    }
                }
                if (!col) {
                    this.x -= this.dir * this.speed;
                }
                this.iter++;
                if (this.iter > this.time) {
                    this.grounded = false;
                    this.iter = 0;
                }
                if (this.h < this.maxh) {
                    this.h += 5;
                    this.y -= 5;
                } 
            } else {
                if (this.h > this.minh) {
                    this.h -= 5;
                    this.y += 5;
                }
                this.y += this.speed;
            }
        }
    }
    Render() {
        ctx.drawImage(slime, this.x, this.y, this.w, this.h);
    }
    GetBounds() {
        return new Bounds(this.x + 10, this.y, this.w - 20, this.h - 10);
    }
}

class Chicken {
    x;
    y;
    w;
    h;
    frame;
    maxFrame;
    state;
    flipped;
    iter;
    time;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 100;
        this.h = 100;
        this.frame = 0;
        this.maxFrame = 10;
        this.state = 0;
        this.flipped = false;
        this.iter = 0;
        this.time = 3;
        this.speed = 5;
    }
    Update(dx, dy, tiles) {
        this.x += dx;
        this.y += dy; 
        if (this.x < 500) {
            this.flipped = false;
        } else {
            this.flipped = true;
        }
        this.state = 0;
        var velx = 0;
        var xx = this.x - 500;
        var yy = this.y - 300;
        var dis = Math.sqrt(xx * xx + yy * yy);
        if (dis < 300 && dis > 20) {
            this.state = 1;
            if (this.flipped) {
                velx -= this.speed;
            } else {
                velx += this.speed;
            }
        }
        var col = false;
        for (var i = 0; i < tiles.length; i++) {
            if (IsColliding(tiles[i].GetBounds(), new Bounds(this.x + 20, this.y, this.w - 40, this.h))) {
                col = true;
            }
            if (this.state > 0) {
                if (IsColliding(tiles[i].GetBounds(), new Bounds(this.x + velx, this.y, this.w, this.h - 20))) {
                    velx = 0;
                }
            }
        }
        this.x += velx;
        if (!col) {
            this.y += this.speed;
        }
        this.iter++;
        if (this.iter > this.time) {
            this.frame++;
            if (this.frame >= this.maxFrame) {
                this.frame = 0;
            }
            this.iter = 0;
        }
    }
    Render() {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.flipped) {
            ctx.translate(this.w, 0);
            ctx.scale(-1, 1);
        }    
        ctx.drawImage(chickenFrames[this.state],
                      this.frame * (chickenFrames[this.state].width / this.maxFrame), 0,
                      (chickenFrames[this.state].width / this.maxFrame), chickenFrames[this.state].height,
                     0, 0, this.w, this.h);
        ctx.restore();  
    }
    GetBounds() {
        return new Bounds(this.x, this.y, this.w, this.h);
    }
}

class Spike {
    x;
    y;
    w;
    h;
    down;
    iter;
    max;
    min;
    dtime;
    diter;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 100;
        this.h = 100;
        this.iter = 0;
        this.down = true;
        this.max = 100;
        this.min = 0;
        this.dtime = 30;
        this.diter = 0;
    }
    Update(dx, dy) {
        this.x += dx;
        this.y += dy;
        if (this.down) {
            this.iter += 20;
            if (this.iter >= this.max) {
                this.down = false;
            }
            this.y -= 20;
        } else {
            if (this.iter <= this.min) {
                this.diter++;
                if (this.diter > this.dtime) {
                    this.down = true;
                    this.diter = 0;
                }
            } else {
                this.y += 2.5;
                this.iter -= 2.5;
            }
        }
    }
    Render() {
        ctx.drawImage(spike, this.x, this.y, this.w, this.h);
    }
    GetBounds() {
        return new Bounds(this.x, this.y, this.w, this.h);
    }
}

class Portal {
    x;
    y;
    w;
    h;
    rot;
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = 100;
        this.h = 100;
        this.rot = 0;
    }
    Update(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.rot += 1;   
    }
    Render() {
        ctx.save();
        ctx.translate(this.x + (this.w / 2), this.y + (this.h / 2));
        ctx.rotate(this.rot);
        ctx.drawImage(portal, -this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();
    }
    GetBounds() {
        return new Bounds(this.x, this.y, this.w, this.h);
    }
}

class Player {
    x;
    y;
    w;
    h;
    velx;
    vely;
    speed;
    isJumping;
    iter;
    time;
    frame;
    maxFrame;
    state;
    lastState;
    aiter;
    atime;
    flipped;
    constructor() {
        this.x = 490;
        this.y = 250;
        this.w = 80;
        this.h = 100;
        this.velx = 0;
        this.vely = 0;
        this.speed = 10;
        this.isJumping = false;
        this.iter = 0;
        this.time = 30;
        this.state = 0;
        this.lastState = 0;
        this.frame = 0;
        this.maxFrame = 10;
        this.aiter = 0;
        this.atime = 2;
        this.flipped = false;
    }
    Update(tiles) {
        this.velx = 0;
        this.vely = 0;
        this.state = 0;
        if (left || (tdown && tposx < 500 && tposy > 300)) {
            this.velx += this.speed;
            this.flipped = true;
        }
        if (right || (tdown && tposx >= 500 && tposy > 300)) {
            this.velx -= this.speed;
            this.flipped = false;
        }
        if (this.velx != 0) {
            if (this.state < 2) {
                this.state = 1;
            }
        }
        var cdown = false;
        for (var i = 0; i < tiles.length; i++) {
            if (IsColliding(tiles[i].GetBounds(), new Bounds(this.x - this.velx, this.y, this.w, this.h - 10))) {
                this.velx = 0;
            }
            if (IsColliding(tiles[i].GetBounds(), new Bounds(this.x + 10, this.y + this.vely, this.w - 20, this.h))) {
                if (tiles.at(i).GetBounds().y <= this.y) {
                    this.isJumping = false;
                } else {
                    cdown = true;
                }
            }
        }
        if (this.isJumping) {
            this.iter++;
            if (this.iter > this.time) {
                this.isJumping = false;
                this.iter = 0;
            }
            this.vely += this.speed;
        }
        if (cdown) {
            if (up || (tdown && tposy < 300) || (tdowntwo && tposytwo < 300)) {
                tdowntwo = false;
                this.isJumping = true;
                this.vely += this.speed * 4;
            }
        } else {
            this.state = 2;
            if (!this.isJumping) {
                this.vely -= this.speed;
            }
        }
        this.aiter++;
        if (this.state != this.lastState) {
            this.frame = 0;
            this.lastState = this.state;
        }
        if (this.aiter > this.atime) {
            this.frame++;
            if (this.frame >= this.maxFrame) {
                if (this.state == 2) {
                    this.frame = this.maxFrame - 1;
                } else {
                    this.frame = 0;
                }
            }
            this.aiter = 0;
        }
    }
    Render() {
        //ctx.fillStyle = "#FF0000";
        //ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.save();
        ctx.translate(this.x, this.y);
        var xoff = 0;
        var yoff = 0;
        if (this.state == 2) {
            xoff = 40;
            yoff = 50;
        }
        if (this.flipped) {
            ctx.translate(this.w, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(scampers[this.state], (scampers[this.state].width / this.maxFrame) * this.frame, 0, (scampers[this.state].width / this.maxFrame), scampers[this.state].height, -(xoff / 2), -yoff + 20, this.w + (xoff * 1.5), this.h + yoff);
        ctx.restore();
    }
    GetBounds() {
        return new Bounds(this.x + 30, this.y + 30, this.w - 60, this.h - 60);
    }
}

var tiles = [];
/*for (var i = 0; i < 10; i++) {
    tiles.push(new Tile(i * 100, 500));
}*/
var player = new Player();
var slimes = [];
//slimes.push(new Slime(900, 400));
var chickens = [];
//chickens.push(new Chicken(900, 400));
var spikes = [];
var port = new Portal();
var mapIter = 1;
var gameOver = false;
var gameOverIter = 0;
var gameOverTime = 180;

function LoadMap(num) {
    pposx = 0;
    pposy = 0;
    for (var i = 0; i < 40; i++) {
        for (var j = 0; j < 40; j++) {
           var k = 0;
            if (num == 1) {
                k = mapdata1[j + i * 40];
            } else if (num == 2) {
                k = mapdata2[j + i * 40];    
            } else if (num == 3) {
                k = mapdata3[j + i * 40];    
            } else if (num == 4) {
                k = mapdata4[j + i * 40];    
            } else if (num == 5) {
                k = mapdata5[j + i * 40];    
            } else if (num == 6) {
                k = mapdata6[j + i * 40];    
            } else if (num == 7) {
                k = mapdata7[j + i * 40];    
            }
            if (k == 1) {
               tiles.push(new Tile(j * 100, (40 - i) * 100, true));
           }
           if (k == 2) {
               tiles.push(new Tile(j * 100, (40 - i) * 100, false))
           }
           if (k == 3) {
               spikes.push(new Spike(j * 100, (40 - i) * 100));
               tiles.push(new Tile(j * 100, (40 - i) * 100, true));
           }
           if (k == 4) {
               slimes.push(new Slime(j * 100, (40 - i) * 100));
           }
           if (k == 5) {
                chickens.push(new Chicken(j * 100, (40 - i) * 100));
           }
           if (k == 6) {
               port.x = j * 100;
               port.y = (40 - i) * 100;
           }
           if (k == 7) {
                pposx = j * 100;
                pposy = (40 - i) * 100;    
           }
       } 
    }
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].x -= pposx - player.x;// + player.w;
        tiles[i].y -= pposy - player.y - player.h;
    }
    for (var i = 0; i < slimes.length; i++) {
        slimes[i].x -= pposx - player.x;// + player.w;
        slimes[i].y -= pposy - player.y - player.h;
    }
    for (var i = 0; i < chickens.length; i++) {
        chickens[i].x -= pposx - player.x;
        chickens[i].y -= pposy - player.y - player.h;
    }
    for (var i = 0; i < spikes.length; i++) {
        spikes[i].x -= pposx - player.x;
        spikes[i].y -= pposy - player.y - player.h;
    }
    port.x -= pposx - player.x;
    port.y -= pposy - player.y - player.h;
}

function UnloadMap() {
    tiles.splice(0, tiles.length);
    chickens.splice(0, chickens.length);
    slimes.splice(0, slimes.length);
    spikes.splice(0, spikes.length);
    player.velx = 0;
    player.vely = 0;
    player.flipped = false;
}

LoadMap(1);

function Render() {
    ctx.clearRect(0, 0, 1000, 600);
    ctx.drawImage(bg, 0, 0, 1000, 600);
    for (var i = 0; i < spikes.length; i++) {
        spikes[i].Render();
    }
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].Render();
    }
    player.Render();
    for (var i = 0; i < slimes.length; i++) {
        slimes[i].Render();
    }
    for (var i = 0; i < chickens.length; i++) {
        chickens[i].Render();
    }
    port.Render();
    if (gameOver) {
        ctx.save();
        ctx.globalAlpha = (1.0 / 180) * gameOverIter;
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 1000, 600);
        ctx.restore();
    }
}

function Update() {
    if (!gameOver) {
        gameOverIter = 0;       
        player.Update(tiles);
    } else {
        player.velx = 0;
        player.vely = 0;
        gameOverIter++;
        if (gameOverIter > gameOverTime) {
            gameOver = false;
            UnloadMap();
            LoadMap(mapIter);
        }
    }
    if (IsColliding(port.GetBounds(), player.GetBounds()) || skip) {
        UnloadMap();
        mapIter++;
        if (mapIter > 7) {
            mapIter = 1;
        }
        LoadMap(mapIter);
        skip = false;
    }
    port.Update(player.velx, player.vely);
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].Update(player.velx, player.vely);
    }
    for (var i = 0; i < slimes.length; i++) {
        slimes[i].Update(player.velx, player.vely, tiles);
        if (IsColliding(slimes[i].GetBounds(), player.GetBounds())) {
            gameOver = true;
        }
    }
    for (var i = 0; i < chickens.length; i++) {
        chickens[i].Update(player.velx, player.vely, tiles);
        if (IsColliding(chickens[i].GetBounds(), player.GetBounds())) {
            gameOver = true;
        }
    }
    for (var i = 0; i < spikes.length; i++) {
        spikes[i].Update(player.velx, player.vely);
        if (IsColliding(spikes[i].GetBounds(), new Bounds(player.x + 20, player.y, player.w - 20, player.h * 0.75))) {
            gameOver = true;
        }
    }
    Render();
}

setInterval(Update, 1000 / 30);