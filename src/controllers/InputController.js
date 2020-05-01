import Controller from './Controller';
import EVENTS from '../const/events.const';
import { GAME_DIFFICULTY } from '../const/game.const';

export default class InputController extends Controller {
  constructor() {
    super();
    this.registerButtonListeners();
    this.registerCheckboxListeners();
    this.registerRadioListeners();
    this.registerInputListeners();
    this.registerMouseListeners();
  }

  registerButtonListeners() {
    this.bindButton('.js-start', EVENTS.GAME_START);
    this.bindButton('.js-reset', EVENTS.GAME_RESET);
    this.bindButton('.js-clear', EVENTS.GAME_CLEAR);
  }

  registerCheckboxListeners() {
    this.bindCheckbox('.js-pause', EVENTS.PAUSE_TOGGLE);
    this.bindCheckbox('.js-puck', EVENTS.PUCK_TOGGLE);
    this.bindCheckbox('.js-trace', EVENTS.TRACE_TOGGLE);
    this.bindCheckbox('.js-field', EVENTS.FIELD_TOGGLE);
  }

  registerRadioListeners() {
    document
      .querySelectorAll('input[type="radio"][name="difficulty"]')
      .forEach((radio) => {
        radio.addEventListener('change', () => {
          this.eventBus.emit(EVENTS.DIFFICULTY_CHANGE, this.getDifficulty());
        });
      });
  }

  registerInputListeners() {
    document.querySelector('.js-mass').addEventListener('input', ($event) => {
      this.eventBus.emit(
        EVENTS.MASS_CHANGE,
        parseInt($event.target.value || 0)
      );
    });
  }

  registerMouseListeners() {
    document.querySelector('.js-canvas').addEventListener('click', ($event) => {
      this.eventBus.emit(EVENTS.MOUSE_LEFT_CLICK, {
        x: $event.clientX,
        y: $event.clientY,
      });
    });

    document
      .querySelector('.js-canvas')
      .addEventListener('contextmenu', ($event) => {
        $event.preventDefault();

        this.eventBus.emit(EVENTS.MOUSE_RIGHT_CLICK, {
          x: $event.clientX,
          y: $event.clientY,
        });
      });
  }

  getDifficulty() {
    const selected = document.querySelector(
      'input[type="radio"][name="difficulty"]:checked'
    );
    return GAME_DIFFICULTY.from(selected.value);
  }

  bindButton(className, eventName) {
    document.querySelector(className).addEventListener('click', () => {
      this.eventBus.emit(eventName);
    });
  }

  bindCheckbox(className, eventName) {
    document.querySelector(className).addEventListener('change', ($event) => {
      this.eventBus.emit(eventName, $event.target.checked);
    });
  }
}
