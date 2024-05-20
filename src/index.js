import * as THREE from 'three';
import { TIFFLoader } from 'three/examples/jsm/loaders/TIFFLoader';
import EarthDay from './resources/EarthDay.jpg';
import EarthNight from './resources/EarthNight.jpg';
import EarthNormal from './resources/EarthNormalMap.tif';
import EarthSpecular from './resources/EarthSpecMap.tif';
import EarthClouds from './resources/Clouds.jpg';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const tLoader = new TIFFLoader();
const loader = new THREE.TextureLoader();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: loader.load(EarthDay),
  normalMap: tLoader.load(EarthNormal),
  specularMap: tLoader.load(EarthSpecular),
  specular: new THREE.Color('grey'),
  emissiveMap: loader.load(EarthNight),
  emissiveIntensity: 0.1,

});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const cloudsGeometry = new THREE.SphereGeometry(1.01, 32, 32);
const cloudsMaterial = new THREE.MeshPhongMaterial({
  map: loader.load(EarthClouds),
  transparent: true,
  opacity: 0.8,
  depthWrite: false,
});
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
