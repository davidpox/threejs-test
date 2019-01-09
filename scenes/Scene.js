import common from '../common';
import TWEEN from '@tweenjs/tween.js';

export default class Scene{
	constructor() {
		this.stage = common.THREEstage;
		this.camera = common.camera;
		this._tweens = new TWEEN.Group();

		this.init();
	}

	init() {

	}

	destroy() {
		this._tweens.removeAll();
	}

	update() {
		this._tweens.update();
	}

	get tweens() {
		return this._tweens;
	}
}