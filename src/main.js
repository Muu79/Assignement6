import * as THREE from 'three';
// We need to use a special loader to load TIFF files on browser
import { TIFFLoader } from 'three/examples/jsm/loaders/TIFFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Adding local reference to resources
// Earth Textures
import EarthDay from './resources/EarthDay.jpg';
import EarthNight from './resources/EarthNight.jpg';
import EarthBump from './resources/EarthBumpMap.jpg';
import EarthSpecular from './resources/EarthSpecMap.jpg';
import EarthClouds from './resources/Clouds.jpg';

// Moon Textures
import MoonMap from './resources/MoonMap.tif';
import MoonBump from './resources/MoonBumpMap.jpg';
import { degToRad } from 'three/src/math/MathUtils.js';

const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', onResize);
// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Enabling shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Creating orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Define our seperate loaders
// As mentioned earlier .tiff files need a special loader
const tLoader = new TIFFLoader();
const loader = new THREE.TextureLoader();

// This function allows us to calculate where the sun would be
// reletive to the day i.e. number of full rotations.
const clacSunAngle = () => {
  // Check that sun is declared, defined and non null
  if (!sun || sun === null) return;
  // calculate the days based on the earth models rotatations
  // or use 0 if earth is undefined right now
  const days = earth ? (earth.rotation.y / (2 * Math.PI)) % 365.25 : 0;
  // The angle varies from 23.5 to -23.5, we use a cos function
  // scaled by the absolute angle possible
  const angle = 23.5 * Math.cos((2 * Math.PI * days) / 365.25 + Math.PI);
  // lastly set the sun using polar coordinates and the angle calculated above
  sun.position.set(10 * Math.cos(angle), 10 * Math.sin(angle), 10);
};
// Light setup
const sun = new THREE.DirectionalLight(0xffffff, 1);
// we place the light far away to emulate the sun
clacSunAngle();
sun.castShadow = true;
scene.add(sun);

// Adding ambient light
const ambientLight = new THREE.AmbientLight(0x555555, 0.05);
scene.add(ambientLight);

// Earth Creation
// First create the Geometry
const earthGeometry = new THREE.SphereGeometry(1, 300, 300);

// Next we prep all the textures to apply to the material
// Base color map
const earthTexture = loader.load(EarthDay);
// bump map allows for roughness (very minimal overall)
const earthBump = loader.load(EarthBump);
// specular map allows for reflections on ocean but not land
const earthSpecular = loader.load(EarthSpecular);
// Night texture is actually just an emissive map
const earthNight = loader.load(EarthNight);

// We then create the Material using the textures above
const earthMaterial = new THREE.MeshPhongMaterial({
  map: earthTexture,
  bumpMap: earthBump,
  bumpScale: 0.1,
  specularMap: earthSpecular,
  specular: new THREE.Color(0x262626),
  specularIntensity: 0.5,
  shininess: 200,
  emissiveMap: earthNight,
  emissive: new THREE.Color(0xffffff),
  emissiveIntensity: 0.1,
});

// Tying everything together we make the mesh
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
// We enable shadows
earth.castShadow = true;
earth.receiveShadow = true;
// lastly we add the mesh to the scene
scene.add(earth);

// Clouds
// First we create the geometry, slightly larger than the earth
const cloudsGeometry = new THREE.SphereGeometry(1.0009, 300, 300);
// Next we load the texture, we use it as an alpha map so the earth is still visible underneath
const cloudAlpha = loader.load(EarthClouds);
// We then create the material
const cloudsMaterial = new THREE.MeshPhongMaterial({
  alphaMap: cloudAlpha,
  transparent: true,
  opacity: 0.8,
  depthWrite: false,
});

// We then create the mesh
const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
clouds.position.set(0, 0, 0);
clouds.castShadow = true;
clouds.receiveShadow = true;
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
moon.position.set(2, 0, 0);
moon.castShadow = true;
moon.receiveShadow = true;
scene.add(moon);

// Helper function to rotate the moon around the earth
// Takes an angle (theta) in radians and a vector (axis)
// Theta effectively decides how far the moon rotates every frame
const orbit = (theta, axis) => {
  // We apply the angle to the position of the moon
  moon.position.applyAxisAngle(axis, theta);
  // We then rotate the moon around this axis
  moon.rotateOnAxis(axis, theta);
};

const sunDelay = 1;
let runner = 0;
function animate() {
  requestAnimationFrame(animate);
  // the earth rotates slowly along it's own axis
  earth.rotation.y += 0.001;
  // the clouds rotate slightly faster to give the illusion of sliding over the earth
  clouds.rotation.y += 0.002;
  // the moon rotates on it's own axis as well
  moon.rotation.y += 0.001;

  // we only update the sun every 60 frames
  // The effect is very small at slow rotations
  // You can change the earth rotation above and
  // experiment with the delay to see how the earth
  // looks in different seasons
  if (runner >= sunDelay) {
    clacSunAngle();
    runner = 0;
  } else runner++;

  // animate the moons orbit, we rotate by 0.005 radians per frame
  orbit(0.005, new THREE.Vector3(0, 1, 0));

  controls.update();
  renderer.render(scene, camera);
}

animate();
