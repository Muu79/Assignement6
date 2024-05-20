import * as THREE from 'three';
import { TIFFLoader } from 'three/examples/jsm/loaders/TIFFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import EarthDay from './resources/EarthDay.jpg';
import EarthNight from './resources/EarthNight.jpg';
import EarthBump from './resources/EarthBumpMap.jpg';
import EarthSpecular from './resources/EarthSpecMap.jpg';
import EarthClouds from './resources/Clouds.jpg';

import MoonMap from './resources/MoonMap.tif';
import MoonBump from './resources/MoonBumpMap.jpg';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


const controls = new OrbitControls(camera, renderer.domElement);

const tLoader = new TIFFLoader();
const loader = new THREE.TextureLoader();

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(300, 0, -300);
sun.castShadow = true;
scene.add(sun);

const earthGeometry = new THREE.SphereGeometry(1, 300, 300);
const earthTexture = loader.load(EarthDay);
const earthBump = loader.load(EarthBump);
const earthSpecular = loader.load(EarthSpecular);
const earthNight = loader.load(EarthNight);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: earthTexture,
  bumpMap: earthBump,
  bumpScale: 0.05,
  specularMap: earthSpecular,
  specular: new THREE.Color(0x262626),
  shininess: 100,
  emissiveMap: earthNight,
  emissive: new THREE.Color(0x666666),
  emissiveIntensity: 0.3,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;
earth.rotateZ(23.5/180*Math.PI);
scene.add(earth);

const cloudsGeometry = new THREE.SphereGeometry(1.007, 300, 300);
const cloudsMaterial = new THREE.MeshPhongMaterial({
  alphaMap: loader.load(EarthClouds),
  transparent: true,
  opacity: 0.8,
  depthWrite: false,
});
camera.position.z = 5;
const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
clouds.castShadow = true;
scene.add(clouds);

const moonGeometry = new THREE.SphereGeometry(0.27, 300, 300);
const moonTexture = tLoader.load(MoonMap);
const moonBump = loader.load(MoonBump);
const moonMaterial = new THREE.MeshPhongMaterial({
  map: moonTexture,
  bumpMap: moonBump,
  bumpScale: 1,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(5, 0, 0);
moon.castShadow = true;
moon.receiveShadow = true;
scene.add(moon);

const orbit = () => {
  moon.position.x = 5 * Math.cos(Date.now() * 0.0001);
  moon.position.z = 5 * Math.sin(Date.now() * 0.0001);
}

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.001;
  clouds.rotation.y += 0.0015;
  moon.rotation.y += 0.001;
  orbit();
  controls.update();
  renderer.render(scene, camera);
}

animate();
