import common from '../common';
import Scene from './Scene';
import GLTFLoader from 'three-gltf-loader';
import TWEEN from '@tweenjs/tween.js';

export default class GameScene extends Scene {
	constructor() {
		super();
		this.world = null;
		this._cameraPathIndex = 0;			// Which group the camera is tweening in.		(e.g. 2nd of 4 groups)
		this._cameraTweenGroups = [];
		this._cameraPaths = [];
	}

	init() {
		super.init();
		console.log('init');

		const alight = new THREE.AmbientLight(0xFFFFFF, 2);
		this.stage.add(alight);

		const eLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1);
		this.stage.add(eLight);

		const gridhelper = new THREE.GridHelper(100, 100);
		gridhelper.material.opacity = 0.1;
		this.stage.add(gridhelper);

		this._createLevel();

		$(document).on('click', null, null, () => {
			this.nextCameraGroup();
		});

		this.toggleCamera();

		document.addEventListener('keydown', (e) => {
			this.onKeyDown(e);
		}, false);
	}

	onKeyDown(event) {
		const keyCode = event.which;
		console.log(keyCode);
		switch (keyCode) {
			case 87:
				common.camera.position.z += 0.1;
				break;
			case 65:
				common.camera.position.x -= 0.1;
				break;
			case 68:
				common.camera.position.x += 0.1;
				break;
			case 83:
				common.camera.position.z -= 0.1;
				break;
			case 81:
				this.setOverHeadCamera();
				break;
			default:
				break;
		}
	}

	setOverHeadCamera() {
		this.camera.position.set(0, 50, 0);
		this.camera.lookAt(new THREE.Vector3(0, 0, 0))
	}

	update() {
		this.tweens.update();
	}

	createCameraTweens() {
		console.log('createCameraTweens');
		for (let i = 0; i < this._cameraPaths.length; i++) {
			let path = {
				positions: {
					x: [],
					y: [],
					z: [],
				},
				rotations: {
					x: [],
					y: [],
					z: []
				}
			};

			this._cameraTweenGroups.push([]);
			console.log(this._cameraPaths);
			for (let j = 0; j < this._cameraPaths[i].length; j++) {
				const node = this._cameraPaths[i][j];

				path.positions.x.push(node.position.x);
				path.positions.y.push(node.position.y);
				path.positions.z.push(node.position.z);

				path.rotations.x.push(node.rotation.x);
				path.rotations.y.push(node.rotation.y);
				path.rotations.z.push(node.rotation.z);

				//node.visible = false;
			}

			console.log(path);

			let t = new TWEEN.Tween(common.camera.position, this.tweens)
				.to({
					x: path.positions.x,
					y: path.positions.y,
					z: path.positions.z
				}, 5000)
				//.interpolation(TWEEN.Interpolation.CatmullRom)
				.onStart(() => {
					console.log('starting tween');
				})
				.easing(TWEEN.Easing.Linear.None);

			let r = new TWEEN.Tween(common.camera.rotation, this.tweens)
				.to({
					y: path.rotations.y
				}, 5000)
				.onUpdate(() => {
					this.stage.add(new THREE.ArrowHelper(common.camera.getWorldDirection(), common.camera.position, 2, 0xFF0000));
				})
				//.interpolation(TWEEN.Interpolation.CatmullRom)
				.easing(TWEEN.Easing.Linear.None);

			this._cameraTweenGroups[i].push(t);
			this._cameraTweenGroups[i].push(r);
		}

		console.log(this._cameraTweenGroups);
	}

	_createLevel() {
		/* Level test */
		const gltfloader = new GLTFLoader();
		gltfloader.load(
			'./assets/3d/demo_level-test.gltf',
			(object) => {
				this.stage.add(object.scene);
				const axesHelper = new THREE.AxesHelper(5);
				this.stage.add(axesHelper);
				this._parseCameras(object.scene);
			}, undefined,
			(error) => {
				console.error('ERROR LOADING', error);
				return false;
			}
		);
	}

	_parseCameras(level) {
		let pathArray = [];
		for (const node of level.children) {
			if(!node.name.startsWith('camerapath_')) continue;
			
			pathArray.push(node);
		}

		const steps = [6];

		let total = 0;
		for (let i = 0; i < steps.length; i++) {
			this._cameraPaths.push([]);
			for (let j = 0; j < steps[i]; j++, total++) {
				pathArray[total].updateMatrix();
				this._cameraPaths[i].push(pathArray[total]);
				console.log(pathArray[total].rotation.y);
			}
		}

		this.createCameraTweens();
	}

	nextCameraGroup() {
		console.log(this._cameraTweenGroups);
		if(!this._cameraTweenGroups[this._cameraPathIndex]) return;

		this._cameraTweenGroups[this._cameraPathIndex][0].start();
		this._cameraTweenGroups[this._cameraPathIndex][1].start();
		
		this._cameraPathIndex++;
	}

	toggleCamera() {
		this.stage.add(common.camera);
		common.camera.position.set(0, 0, 0);
	}
}