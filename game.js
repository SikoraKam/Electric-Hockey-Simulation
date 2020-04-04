import ElectricCharge from './electricCharge.js'

const canvas = document.getElementById('hockey');
const context = canvas.getContext('2d');

context.fillStyle = '#000';
context.fillRect(0,0,canvas.width, canvas.height);

context.scale(20,20);
// ponizej to probne wyswietlanie obrazka

let electricCharge;
let myGameArea = {
    start : function () {
        document.body.insertBefore(canvas,document.body.childNodes[0]);
        updateElectricCharge();
    }

};

function startGame() {
    electricCharge = new ElectricCharge(false,3,3,10,10,
        "image","./negative_charge.svg.png");
    myGameArea.start();
}
function updateElectricCharge() {
    context.drawImage(electricCharge.image, electricCharge.x, electricCharge.y,
        electricCharge.width,electricCharge.height)
}

startGame();


