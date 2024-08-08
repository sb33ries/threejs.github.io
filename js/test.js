import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the GLTF model
const loader = new GLTFLoader();
loader.load(
  '/models/eye.gltf',
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // You can now interact with the loaded model
    // For example, you can rotate it:
    model.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (error) => {
    console.error(error);
  }
);

// Animate the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();