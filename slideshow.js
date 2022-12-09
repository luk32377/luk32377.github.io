
var canvas = document.getElementById("scanvas");
var ctx = canvas.getContext("2d");


var imcount = 5;

var images = [];
for (var i = 0; i < imcount; i++) {
    images.push(new Image());
}

images[0].src = "Images/TMN.png";
images[1].src = "Images/thirdperson.png"
images[2].src = "Images/ShootyBoi.png";
images[3].src = "Images/firstperson.png"
images[4].src = "Images/TMN2.png";

var imageIter = 0;
var itime = 30;
var ibegin = 0;

canvas.onmousedown = function(e) {
    imageIter++;
    if (imageIter >= imcount) {
        imageIter = 0;
    }
}

function Render() {
    //ctx.drawImage(images[imageIter], 0, 0, images[imageIter].width, images[imageIter].height, 0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
    ctx.drawImage(images[imageIter], 0, 0, 400, 400);
}

function Update() {
    ibegin++;
    if (ibegin > itime) {
        imageIter++;
        if (imageIter >= imcount) {
            imageIter = 0;
        }
        ibegin = 0;
    }
    
    Render();
}

setInterval(Update, 1000 / 15);