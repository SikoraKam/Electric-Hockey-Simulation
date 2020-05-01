import './assets/scss/main.scss';
import Game from './Game';
import GameController from './controllers/GameController';
import InputController from './controllers/InputController';

new InputController();
new GameController(new Game()).start();
