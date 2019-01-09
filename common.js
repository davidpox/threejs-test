export default {
	/**
     * @static
     * @type {PIXI.CanvasRenderer|PIXI.WebGLRenderer}
     */
	renderer: null,

	/**
     * @static
     * @type {THREE.WebGLRenderer}
     */
	THREErenderer: null,

	/**
     * @static
     * @type {PIXI.Container}
     */
	stage: null,

	/**
     * @static
     * @type {THREE.Scene}
     */
	THREEstage: null,

	/**
     * @static
     * @type {THREE.PerspectiveCamera}
     */
	camera: null,

	assets: null,

	current_level: 'stage_1',

	level_data: null,

	level_settings: null,
};