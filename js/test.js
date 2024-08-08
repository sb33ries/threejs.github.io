import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

class ThreeJSModelViewer {
  constructor(modelPath, containerElementId) {
    this.modelPath = modelPath;
    this.containerElementId = containerElementId;
    this.scale = 1; // Default scale

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 10);

    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;

    this.object = null;

    this.controls = null;

    this.loader = new GLTFLoader();
    this.loadModel();

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById(this.containerElementId).appendChild(this.renderer.domElement);

    this.addLights();
    this.addControls();
    this.animate();
    this.addResizeListener();
    this.addMouseMoveListener();
  }

  loadModel() {
    this.loader.load(
      this.modelPath,
      (gltf) => {
        this.object = gltf.scene;
        this.setScale(this.scale); // Apply the initial scale
        this.centerObject(); // Center the object at the origin
        this.scene.add(this.object);
        this.logObjectInfo();
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        console.log("Loaded!");
      },
      (error) => {
        console.error(error);
      }
    );
  }

  setScale(scale) {
    if (this.object) {
      this.object.scale.set(scale, scale, scale);
    }
  }

  centerObject() {
    if (this.object) {
      const box = new THREE.Box3().setFromObject(this.object);
      const size = new THREE.Vector3();
      box.getSize(size);
      const position = new THREE.Vector3();
      box.getCenter(position);

      // Subtract the center position from the object's position to center it at the origin
      this.object.position.sub(position);
    }
  }

  logObjectInfo() {
    const box = new THREE.Box3().setFromObject(this.object);
    console.log("Object bounding box:", box);

    const size = new THREE.Vector3();
    box.getSize(size);
    const position = new THREE.Vector3();
    box.getCenter(position);

    console.log("Object position (center of bounding box):", position);
    console.log("Object size (dimensions of bounding box):", size);

    this.object.traverse((child) => {
      console.log("Object child:", child.visible);
    });
  }

  addLights() {
    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(500, 500, 500);
    topLight.castShadow = true;
    this.scene.add(topLight);

    const ambientLight = new THREE.AmbientLight(0x333333, 5);
    this.scene.add(ambientLight);
  }

  addControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    if (this.object && this.object.name === "eye") {
      this.object.rotation.y = -3 + this.mouseX / window.innerWidth * 3;
      this.object.rotation.x = -1.2 + this.mouseY * 2.5 / window.innerHeight;
    }

    this.renderer.render(this.scene, this.camera);
  };

  addResizeListener() {
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  addMouseMoveListener() {
    document.onmousemove = (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    };
  }
}

// Usage example
const viewer = new ThreeJSModelViewer('models/car/scene.gltf', 'container3D');
viewer.setScale(5); // Set the initial scale to 5