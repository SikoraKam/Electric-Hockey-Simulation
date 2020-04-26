import ElectricCharge from './electricCharge.js'
import Electron from "./electron.js"
import {play} from "./controller";
import {gameMode} from "./controller";


function init() {

    const canvas = document.getElementById('hockey');
    const context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0,0,canvas.width, canvas.height);

    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    if (gameMode === 'ON') {
        play();
        window.requestAnimationFrame(gameLoop);
    }
    else{
        //TODO: wyświetlić jakąś wiadomość na ekranie o końcu gry
    }
}




