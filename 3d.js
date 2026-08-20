import * as THREE from 'three';

const mount = document.querySelector('#stage');
if (!mount) throw new Error('VEX 3D mount not found');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x08070d, 0.055);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(0.35, 0.15, 7.4);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
mount.appendChild(renderer.domElement);

const root = new THREE.Group();
root.position.x = 0.15;
scene.add(root);

scene.add(new THREE.HemisphereLight(0xb7a4ff, 0x07060c, 1.35));
const key = new THREE.PointLight(0x8d70ff, 38, 18, 2);
key.position.set(3, 2.5, 4);
scene.add(key);
const rim = new THREE.PointLight(0x3b1fa0, 28, 16, 2);
rim.position.set(-4, -2, -3);
scene.add(rim);

// Smooth stylized VEX serpent: one continuous tube gives the 3D page a real mascot silhouette
// without introducing a heavyweight external model.
const snakeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x0d0d14,
  metalness: 0.72,
  roughness: 0.2,
  clearcoat: 0.8,
  clearcoatRoughness: 0.14,
  emissive: 0x1b1034,
  emissiveIntensity: 0.5,
});

const points = [];
for (let i = 0; i < 13; i += 1) {
  const t = i / 12;
  points.push(new THREE.Vector3(
    Math.sin(t * Math.PI * 1.55) * 0.7 + t * 0.58,
    -1.75 + t * 3.35,
    Math.cos(t * Math.PI * 1.15) * 0.2,
  ));
}
const curve = new THREE.CatmullRomCurve3(points);
const body = new THREE.Mesh(new THREE.TubeGeometry(curve, 128, 0.27, 32, false), snakeMaterial);
root.add(body);

const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.44, 1.1, 32), snakeMaterial);
neck.position.set(0.55, 0.83, 0);
neck.rotation.z = -0.18;
root.add(neck);

const head = new THREE.Mesh(new THREE.SphereGeometry(0.54, 48, 32), snakeMaterial);
head.scale.set(1.3, 0.92, 1.12);
head.position.set(1.04, 1.43, 0.02);
head.rotation.z = -0.12;
root.add(head);

const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xb7a4ff });
for (const side of [-1, 1]) {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 12), eyeMaterial);
  eye.position.set(0.95 + side * 0.27, 1.55, 0.47);
  eye.scale.z = 0.5;
  root.add(eye);
}

const tongue = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(1.35, 1.27, 0.5),
    new THREE.Vector3(1.72, 1.13, 0.55),
    new THREE.Vector3(1.98, 1.21, 0.58),
  ]),
  new THREE.LineBasicMaterial({ color: 0x7657ff, transparent: true, opacity: 0.9 }),
);
root.add(tongue);

const halo = new THREE.Mesh(
  new THREE.TorusGeometry(2.05, 0.012, 8, 128),
  new THREE.MeshBasicMaterial({ color: 0x7657ff, transparent: true, opacity: 0.22 }),
);
halo.rotation.x = Math.PI / 2;
halo.position.set(0.55, -0.02, 0);
scene.add(halo);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(5.8, 96),
  new THREE.MeshBasicMaterial({ color: 0x0c0913, transparent: true, opacity: 0.42 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.05;
scene.add(floor);

const stars = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: 0xb7a4ff, size: 0.022, transparent: true, opacity: 0.48, blending: THREE.AdditiveBlending }),
);
const starPositions = [];
for (let i = 0; i < 520; i += 1) {
  const radius = 4.5 + Math.random() * 8;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPositions.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi));
}
stars.geometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
scene.add(stars);

const pointer = new THREE.Vector2();
const targetRotation = new THREE.Vector2();
let zoom = 7.4;
let dragging = false;
let previous = { x: 0, y: 0 };
let mode = 'orbit';

mount.addEventListener('pointermove', (event) => {
  const rect = mount.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  if (dragging) {
    targetRotation.y += (event.clientX - previous.x) * 0.008;
    targetRotation.x += (event.clientY - previous.y) * 0.008;
    targetRotation.x = THREE.MathUtils.clamp(targetRotation.x, -0.7, 0.7);
  }
  previous = { x: event.clientX, y: event.clientY };
});
mount.addEventListener('pointerdown', (event) => {
  dragging = true;
  previous = { x: event.clientX, y: event.clientY };
  mount.setPointerCapture(event.pointerId);
});
mount.addEventListener('pointerup', (event) => {
  dragging = false;
  mount.releasePointerCapture(event.pointerId);
});
mount.addEventListener('pointercancel', () => { dragging = false; });
mount.addEventListener('wheel', (event) => {
  event.preventDefault();
  zoom = THREE.MathUtils.clamp(zoom + event.deltaY * 0.004, 4.8, 10);
}, { passive: false });

for (const button of document.querySelectorAll('.control')) {
  button.addEventListener('click', () => {
    mode = button.dataset.mode;
    document.querySelectorAll('.control').forEach((item) => item.classList.toggle('active', item === button));
    if (mode === 'focus') zoom = 5.7;
    if (mode === 'orbit') zoom = 7.4;
    if (mode === 'drift') zoom = 8.2;
  });
}

function resize() {
  const width = mount.clientWidth || 1;
  const height = mount.clientHeight || 1;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();
  const idle = mode === 'drift' ? 0.0007 : mode === 'focus' ? 0.0002 : 0.00045;

  if (!dragging) targetRotation.y += idle * 60;
  root.rotation.x += (targetRotation.x + pointer.y * 0.08 - root.rotation.x) * 0.035;
  root.rotation.y += (targetRotation.y + pointer.x * 0.12 - root.rotation.y) * 0.035;
  root.position.y = Math.sin(t * 0.75) * 0.055;
  head.rotation.z = -0.12 + Math.sin(t * 0.55) * 0.025;
  halo.rotation.z = t * 0.035;
  stars.rotation.y = t * 0.006;
  key.position.x += (pointer.x * 2.5 + 3 - key.position.x) * 0.025;
  key.position.y += (pointer.y * 1.8 + 2.2 - key.position.y) * 0.025;
  camera.position.z += (zoom - camera.position.z) * 0.06;
  camera.lookAt(0.45, 0, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
