var canvas = document.querySelector('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var c = canvas.getContext("2d");

const a = new Image();
a.src = "cap.png";
const b = new Image();
b.src = "bla.png";
const ca = new Image();
ca.src = "fal.png";
const d = new Image();
d.src = "hul.png";
const e = new Image();
e.src = "tho.png";
const f = new Image();
f.src = "iro.png";
const g = new Image();
g.src = "spi.png";
const logo = new Image();
logo.src = "avengerlogo.png";

// var colour = ["#520120", "#08403E", "#706513", "#B57114", "#962B09"];
var character = [a, b, ca, d, e, f, g];

// c.fillStyle="pink";
// c.fillRect(100,100,100,100);
// c.strokeStyle="red";


// c.beginPath();
// c.moveTo(250,250);
// c.lineTo(200,200);
// c.stroke();

// for( var i=0;i<10;i++)
// {   var x=Math.random() *window.innerWidth;
//     var y=Math.random() *window.innerHeight;
//     c.beginPath();
//     c.arc(x,y,40,0,6.28);
//     c.stroke();
// }

// var x = Math.random() * window.innerWidth;
// var y = Math.random() * window.innerHeight;
var point = {
    x: undefined,
    y: undefined
}
addEventListener("mousemove", function (event) {
    point.x = event.x;
    point.y = event.y;
})

var x, y, dx, dy, radius,clr;
class Circle {
    constructor(x, y, dx, dy, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
    //  clr = character[Math.floor(Math.random() * 8)];
    clr = logo;
        this.draw = function () {
            c.beginPath();
            c.drawImage(clr, this.x, this.y, this.radius, this.radius);
            c.closePath();
        };
        this.move = function () {
            this.draw();
            this.x += this.dx;
            this.y += this.dy;
            if (this.x < this.radius || this.x > window.innerWidth - this.radius) { this.dx = (-this.dx); }
            if (this.y < this.radius || this.y > window.innerHeight - this.radius) { this.dy = (-this.dy); }

            if (point.x - this.x <= 50 && point.x - this.x >= -50 && point.y - this.y <= 50 && point.y - this.y >= -50) {
                if (this.radius <= 100) { this.radius += 1; }
            }
            else if (this.radius >= 2) {

                { this.radius -= 1; }
            }
        };



    }
}

var circlearr = [];
for (var i = 0; i < 1000; i++) {
    var x = Math.random() * window.innerWidth;
    var y = Math.random() * window.innerHeight;
    radius = 2;
    dx = Math.random();
    dy = Math.random();
    circlearr[i] = new Circle(x, y, dx, dy, radius);
};

function animate(){

    requestAnimationFrame(animate);
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (var i = 0; i < 1000; i++) {
        circlearr[i].draw();

        circlearr[i].move();
    }

}

animate()