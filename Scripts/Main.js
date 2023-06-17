

var imsep = document.getElementById("switcher");
var switching = false;
var sshot = document.getElementById("sshots");
var ss = [];
for (var i = 0; i < 5; i++) {
    ss.push("");
}
ss[0] = "Images/firstperson.png";
ss[1] = "Images/ShootyBoi.png";
ss[2] = "Images/thirdperson.png";
ss[3] = "Images/SPS.png";
ss[4] = "Images/PlaneGame.png";
var ii = 0;

function switchNinja() {
    if (switching) {
        imsep.src = "Images/TMN.png";
        switching = false;
    } else {
        imsep.src = "Images/TMN2.png";
        switching = true;
    }
}

function SlideShow() {
    ii++;
    if (ii >= ss.length) {
        ii = 0;
    }
    sshot.src = ss[ii];
}

setInterval(switchNinja, 3000);
var calltimer = setInterval(SlideShow, 5000);



sshot.onclick = function(e) {
    clearInterval(calltimer);
    SlideShow();
    calltimer = setInterval(SlideShow, 5000);
}