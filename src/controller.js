import ElectricCharge from "./electricCharge.js";
import Electron from "./electron.js"
import Obstacle from "./Obstacle";

const canvas = document.getElementById('hockey');
const context = canvas.getContext('2d');

//wspolczynnik
const k = 100000000;
const levelsOfDifficulty = {
    TRAINING: 'training',
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};
let difficulty = levelsOfDifficulty.TRAINING;


const gameStatus = {
    ON: 'on',
    OFF: 'off'
};

export let gameMode = gameStatus.ON;

let obstaclesForEasy = [];
let obstaclesForMedium = [];
let obstaclesForHard = [];


let electricChargeArray = [];


let electron = new Electron(0,0,0,0,600,400);


// główna funkcja gdzie dodajemy elementy, wyliczamy siłe, sprawdzamy kolizje, przesuwamy elektron itd.
//używana w funkcji animującej w game.js
export function play() {

    addElectricCharges();
    addObstacles();


    let results = CalculateForce(electricChargeArray);
    changeElectron();
    electron.update();

    if(collisionWithBoundary())
        gameMode = gameStatus.OFF;
    if(collisionWithCharge())
        gameMode = gameStatus.OFF;
    if(collisionWithObstacle())
        gameMode = gameStatus.OFF;


}


function addElectricCharges() {
    document.addEventListener("click",getClickPosition, false);

}

function getClickPosition(e) {
    const xPosition = e.clientX;
    const yPosition = e.clientY;

    const electricCharge = new ElectricCharge(false,30,30,xPosition,yPosition,
        "image","../negative_charge.svg.png");
    electricChargeArray.push(electricCharge);

    context.drawImage(electricCharge.image, electricCharge.x, electricCharge.y,
            electricCharge.width,electricCharge.height)
}

function addObstacles() {
    //TODO: create and add obstacles for every kind of level
}

function drawElectron() {
    context.fillStyle = 'white';
    let centerX = electron.positionX;
    let centerY = electron.positionY;


    context.beginPath();
    context.arc(centerX,centerY, electron.radius, 0, 2 * Math.PI,false);
    context.fill();

}

function CalculateForce(electricChargeArray) {
    let results = [];
    electricChargeArray.forEach(function (charge) {
        let r = Math.sqrt(Math.pow(electron.positionX - charge.x,2)
            + Math.pow(electron.positionY - charge.y,2));

        collisionWithCharge(r,electron,charge);

        let sin = (charge.x - electron.positionX) / r;
        let cos = (charge.y - electron.positionY) / r;

        if(charge.sign === electron.value){
            results[0] -= (sin / (Math.pow(r,2) * electron.mass)) * k;
            results[1] -= (cos / (Math.pow(r,2) * electron.mass)) * k;
        }else {
            results[0] += (sin / (Math.pow(r,2) * electron.mass)) * k;
            results[1] += (cos / (Math.pow(r,2) * electron.mass)) * k;
        }

    });
    return results;

}

function changeElectron(results) {
    electron.accelerationX = results[0];
    electron.accelerationY = results[1];
}

function collisionWithCharge(distance,electron, charge) {
    if(distance <= electron.radius + charge.width){
        electron.reset();
        return true;
    }
}

function collisionWithObstacle() {
    if(difficulty === levelsOfDifficulty.EASY){
       if( obstaclesForEasy.forEach(collisionWithObstacleChecker)){
            return true;
        }
    }
    if(difficulty === levelsOfDifficulty.MEDIUM){
        if( obstaclesForMedium.forEach(collisionWithObstacleChecker)){
            return true;
        }
    }
    if(difficulty === levelsOfDifficulty.HARD){
        if( obstaclesForHard.forEach(collisionWithObstacleChecker)){
            return true;
        }
    }
    
}

function collisionWithObstacleChecker(obstacle) {
    let distX = Math.abs(electron.positionX - obstacle.positionX - obstacle.width/2);
    let distY = Math.abs(electron.positionY - obstacle.positionY - obstacle.height/2);

    if(distX > (obstacle.width/2 + electron.radius))
        return false;
    if(distY > (obstacle.height/2 + electron.radius))
        return false;
    if(distX <= (obstacle.width/2))
        return true;
    if (distY <= (obstacle.height/2))
        return true;

    //corners
    let dx = distX - obstacle.width/2;
    let dy = distY - obstacle.height/2;

    return dx * dx + dy * dy <= electron.radius * electron.radius;
}

function collisionWithBoundary() {
    if(electron.positionX < 0 || electron.positionX > canvas.width
        || electron.positionY < 0 || electron.positionY > canvas.height){
        electron.reset();
        return true;
    }
}

