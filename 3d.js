import * as THREE from 'three';

const mount = document.querySelector('#stage');
if (!mount) throw new Error('VEX 3D mount not found');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x08070d, 0.075);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(0, 0.2, 7.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
mount.appendChild(renderer.domElement);

const root = new THREE.Group();
scene.add(root);

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.55, 5),
  new THREE.MeshPhysicalMaterial({
    color: 0x6d4cff,
    emissive: 0x2b176f,
    emissiveIntensity: 1.25,
    roughness: 0.25,
    metalness: 0.12,
    transmission: 0.18,
    thickness: 0.6,
    clearcoat: 0.7,
    clearcoatRoughness: 0.2,
  }),
);
root.add(core);

const inner = new THREE.Mesh(
  new THREE.SphereGeometry(1.18, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0x9d82ff, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending }),
);
root.add(inner);

const rings = [];
for (const [radius, tilt, speed, opacity] of [[2.0, 0.35, 0.24, 0.28], [2.35, -0.6, -0.16, 0.18], [2.7, 1.0, 0.1, 0.12]]) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0.012, 8, 180),
    new THREE.MeshBasicMaterial({ color: 0x9d82ff, transparent: true, opacity, blending: THREE.AdditiveBlending }),
  );
  ring.rotation.x = tilt;
  ring.userData.speed = speed;
  root.add(ring);
  rings.push(ring);
}

const stars = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: 0xb8a8ff, size: 0.025, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending }),
);
const starPositions = [];
for (let i = 0; i < 700; i += 1) {
  const radius = 5 + Math.random() * 9;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPositions.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi));
}
stars.geometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
scene.add(stars);

scene.add(new THREE.HemisphereLight(0xb6a7ff, 0x09070f, 1.4));
const key = new THREE.PointLight(0x8f72ff, 35, 18, 2);
key.position.set(3, 2.5, 4);
scene.add(key);
const rim = new THREE.PointLight(0x3f20a8, 24, 14, 2);
rim.position.set(-4, -2, -3);
scene.add(rim);

const pointer = new THREE.Vector2();
const targetRotation = new THREE.Vector2();
let zoom = 7.2;
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
    targetRotation.x = THREE.MathUtils.clamp(targetRotation.x, -0.8, 0.8);
  }
  previous = { x: event.clientX, y: event.clientY };
});
mount.addEventListener('pointerdown', (event) => { dragging = true; previous = { x: event.clientX, y: event.clientY }; mount.setPointerCapture(event.pointerId); });
mount.addEventListener('pointerup', (event) => { dragging = false; mount.releasePointerCapture(event.pointerId); });
mount.addEventListener('pointercancel', () => { dragging = false; });
mount.addEventListener('wheel', (event) => { event.preventDefault(); zoom = THREE.MathUtils.clamp(zoom + event.deltaY * 0.004, 4.8, 10); }, { passive: false });

for (const button of document.querySelectorAll('.control')) {
  button.addEventListener('click', () => {
    mode = button.dataset.mode;
    document.querySelectorAll('.control').forEach((item) => item.classList.toggle('active', item === button));
    if (mode === 'focus') zoom = 5.7;
    if (mode === 'orbit') zoom = 7.2;
    if (mode === 'drift') zoom = 8.1;
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
  const idle = mode === 'drift' ? 0.0007 : mode === 'focus' ? 0.00025 : 0.00045;

  if (!dragging) targetRotation.y += idle * 60;
  root.rotation.x += (targetRotation.x + pointer.y * 0.08 - root.rotation.x) * 0.035;
  root.rotation.y += (targetRotation.y + pointer.x * 0.12 - root.rotation.y) * 0.035;
  root.position.y = Math.sin(t * 0.8) * 0.055;
  core.rotation.z = Math.sin(t * 0.35) * 0.08;
  inner.scale.setScalar(1 + Math.sin(t * 1.2) * 0.025);
  rings.forEach((ring) => { ring.rotation.z += ring.userData.speed * 0.01; ring.rotation.y += ring.userData.speed * 0.006; });
  stars.rotation.y = t * 0.006;
  key.position.x += (pointer.x * 2.5 - key.position.x) * 0.025;
  key.position.y += (pointer.y * 2 - key.position.y) * 0.025;
  camera.position.z += (zoom - camera.position.z) * 0.06;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
