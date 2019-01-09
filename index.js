import jquery from 'jquery';
global.$ = jquery;

import * as THREE from 'three';
global.THREE = THREE;

import * as CANNON from 'cannon';
global.CANNON = CANNON;

import common from './common';
import GameScene from './scenes/GameScene';

window.onload = () => { 
	let THREErenderer = new THREE.WebGLRenderer();
	THREErenderer.setSize(window.innerWidth, window.innerHeight);

	common.THREErenderer = THREErenderer;
	$('#game').append(THREErenderer.domElement);

	let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.set(20, 5, 20);
	camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0, 'YXZ'));
	common.camera = camera;

	common.THREEstage = new THREE.Scene();
	common.scene = new GameScene();

	function animate() {
		requestAnimationFrame(animate);

		THREErenderer.render(common.THREEstage, common.camera);
		common.scene.update();
	}

	animate();
};
