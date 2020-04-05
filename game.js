import ElectricCharge from './electricCharge.js'
import Electron from "./electron.js"

const canvas = document.getElementById('hockey');
const context = canvas.getContext('2d');

context.fillStyle = '#000';
context.fillRect(0,0,canvas.width, canvas.height);

context.scale(20,20);
// ponizej to probne wyswietlanie obrazka

let electricCharge;
let electron;


let myGameArea = {
    start : function () {
        drawElectricCharge();
        drawElectron();
    }

};

function startGame() {
    electricCharge = new ElectricCharge(false,3,3,10,10,
        "image","./negative_charge.svg.png");
    electron = new Electron(0,0,0,0,600,400);

    myGameArea.start();
}
function drawElectricCharge() {
    context.drawImage(electricCharge.image, electricCharge.x, electricCharge.y,
        electricCharge.width,electricCharge.height)
}

function drawElectron() {
    context.fillStyle = 'green';
    let centerX = electron.positionX;
    let centerY = electron.positionY;
    let radius = 70;

    context.beginPath();
    context.arc(centerX,centerY, radius, 0, 2 * Math.PI,false);
    context.fill();

}

startGame();


