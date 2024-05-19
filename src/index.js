import * as THREE from "three";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Base + Box
 */
const cube = new THREE.BoxGeometry(1, 1, 1);
const cubeMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
cubeMat.roughness = 0.4;
const cubeMesh = new THREE.Mesh(cube, cubeMat);
cubeMesh.castShadow = true;
scene.add(cubeMesh);

const base = new THREE.PlaneGeometry(5, 5);
const baseMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
baseMat.roughness = 0.4;
const baseMesh = new THREE.Mesh(base, baseMat);
baseMesh.receiveShadow = true;
baseMesh.translateY(-1.0);
baseMesh.rotateX(-Math.PI / 2);

scene.add(baseMesh);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * lights
 */

const light1 = new THREE.PointLight({ color: "white" }, 1);
light1.position.set(0, 3, 2);
light1.castShadow = true;
light1.shadow.mapSize.width = 1024;
light1.shadow.mapSize.height = 1024;
light1.shadow.radius = 5;
scene.add(light1);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;

/**
 * Animate
 */

const render = () => {
  cubeMesh.rotateX(0.01);
  cubeMesh.rotateY(0.03);
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(render);
};

render();
