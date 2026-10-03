"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";

// "Where I've worked" illustration: a developer (Mixamo character + its "Typing" animation,
// public/models/coder.fbx) at a desk, typing on a laptop whose screen writes code, with code
// glyphs drifting up from it. Desk and laptop are primitives. three.js and the model only
// download once the section is near the screen, and the scene only renders while visible.
// The pointer turns it a little. Decorative, so hidden from screen readers.

const MODEL_URL = "/models/coder.fbx";
// Mixamo works in centimetres and faces +z; the scene is in metres with the desk towards -z
const MODEL_SCALE = 0.01;
// Puts the model's hands (46–50 cm in front of its hips) on the laptop keyboard
const MODEL_Z = 0.46;

const SCREEN_W = 512;
const SCREEN_H = 340;

const COLORS = {
  desk: 0x6b4f37,
  deskLeg: 0x2a3343,
  chair: 0x343f50,
  laptop: 0xb9c2cf,
  mug: 0xd9ae72,
};

const TOKEN_COLORS = ["#c4a7ff", "#8da2ff", "#d9ae72", "#e6ecf3", "#7d8aa0", "#4fd18b", "#ff9e7a"];

// One "line of code" on the laptop: indent plus coloured token widths, in screen pixels
type CodeLine = { indent: number; tokens: { w: number; color: string }[] };

function randomCode(count: number): CodeLine[] {
  const lines: CodeLine[] = [];
  let indent = 0;
  for (let i = 0; i < count; i++) {
    if (Math.random() < 0.25 && indent > 0) indent--;
    const tokens = Array.from({ length: 2 + Math.floor(Math.random() * 4) }, () => ({
      w: 18 + Math.random() * 70,
      color: TOKEN_COLORS[Math.floor(Math.random() * TOKEN_COLORS.length)],
    }));
    lines.push({ indent, tokens });
    if (Math.random() < 0.3 && indent < 3) indent++;
  }
  return lines;
}

// Draws the editor on the laptop screen, with `typed` token widths revealed so far
function drawScreen(ctx: CanvasRenderingContext2D, lines: CodeLine[], typed: number, caretOn: boolean) {
  ctx.fillStyle = "#0e1520";
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  // title bar
  ctx.fillStyle = "#151e2b";
  ctx.fillRect(0, 0, SCREEN_W, 30);
  ["#ff6b6b", "#f7c25c", "#4fd18b"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(18 + i * 18, 15, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  const lineH = 24;
  let left = typed;
  let caret: [number, number] | null = null;
  for (let i = 0; i < lines.length; i++) {
    const y = 44 + i * lineH;
    ctx.fillStyle = "#3b4759";
    ctx.fillRect(14, y + 6, 14, 6);
    let x = 46 + lines[i].indent * 22;
    for (const t of lines[i].tokens) {
      if (left <= 0) break;
      const w = Math.min(t.w, left);
      ctx.fillStyle = t.color;
      ctx.beginPath();
      ctx.roundRect(x, y + 3, w, 11, 4);
      ctx.fill();
      left -= t.w;
      x += w + 8;
      if (left <= 0) caret = [x - 6, y];
    }
    if (left <= 0) {
      caret ??= [x, y];
      break;
    }
  }
  if (caret && caretOn) {
    ctx.fillStyle = "#8da2ff";
    ctx.fillRect(caret[0], caret[1], 7, 17);
  }
}

function glyphTexture(T: typeof THREE, text: string, color: string) {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.font = '700 40px ui-monospace, "Cascadia Code", Menlo, Consolas, monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, 64, 34);
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  return tex;
}

export default function CoderScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    const start = () =>
      import("three").then((T) => {
        if (disposed) return;
        let renderer: THREE.WebGLRenderer;
        try {
          renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
        } catch {
          return; // no WebGL: the column simply stays empty
        }
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = T.PCFShadowMap;
        renderer.outputColorSpace = T.SRGBColorSpace;
        host.appendChild(renderer.domElement);

        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(32, 1, 0.1, 30);
        // Over the developer's right shoulder, so the laptop screen faces the viewer
        camera.position.set(2.35, 1.75, 2.75);
        const target = new T.Vector3(0.02, 0.6, 0.18);

        // Lights: soft sky fill, a key light that casts shadows, and the screen's own glow
        scene.add(new T.HemisphereLight(0xdfe7ff, 0x2a3140, 1.6));
        const key = new T.DirectionalLight(0xffffff, 2.2);
        key.position.set(2.5, 4, 2);
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        key.shadow.camera.left = -1.5;
        key.shadow.camera.right = 1.5;
        key.shadow.camera.top = 1.5;
        key.shadow.camera.bottom = -1.5;
        key.shadow.radius = 4;
        scene.add(key);
        const screenGlow = new T.PointLight(0x7b93ff, 1.4, 1.6, 2);
        scene.add(screenGlow);

        const rig = new T.Group();
        scene.add(rig);

        const mats: THREE.Material[] = [];
        const geos: THREE.BufferGeometry[] = [];
        const mat = (color: number, rough = 0.7, metal = 0) => {
          const m = new T.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
          mats.push(m);
          return m;
        };
        const box = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) => {
          const g = new T.BoxGeometry(w, h, d);
          geos.push(g);
          const mesh = new T.Mesh(g, m);
          mesh.position.set(x, y, z);
          mesh.castShadow = mesh.receiveShadow = true;
          rig.add(mesh);
          return mesh;
        };
        const v = (x: number, y: number, z: number) => new T.Vector3(x, y, z);

        // Floor shadow catcher
        const floorGeo = new T.CircleGeometry(1.6, 48);
        geos.push(floorGeo);
        const floorMat = new T.ShadowMaterial({ opacity: 0.28 });
        mats.push(floorMat);
        const floor = new T.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        rig.add(floor);

        // Desk, at real desk height: the animation types with the hands about 70 cm up
        const deskMat = mat(COLORS.desk, 0.55);
        const legMat = mat(COLORS.deskLeg, 0.5, 0.3);
        box(1.5, 0.05, 0.75, deskMat, 0, 0.645, -0.05);
        for (const [x, z] of [
          [-0.7, -0.38],
          [0.7, -0.38],
          [-0.7, 0.28],
          [0.7, 0.28],
        ])
          box(0.04, 0.62, 0.04, legMat, x, 0.31, z);

        // Laptop: base, keyboard plate, and a screen hinged at the back
        const laptopMat = mat(COLORS.laptop, 0.35, 0.6);
        box(0.46, 0.018, 0.3, laptopMat, 0, 0.679, -0.02);
        box(0.4, 0.002, 0.13, mat(0x2a3343, 0.8), 0, 0.689, -0.03);
        const hinge = new T.Group();
        hinge.position.set(0, 0.688, -0.165);
        hinge.rotation.x = -0.28;
        rig.add(hinge);
        const lidGeo = new T.BoxGeometry(0.46, 0.28, 0.012);
        geos.push(lidGeo);
        const lid = new T.Mesh(lidGeo, laptopMat);
        lid.position.set(0, 0.14, 0);
        lid.castShadow = true;
        hinge.add(lid);
        const screenCanvas = document.createElement("canvas");
        screenCanvas.width = SCREEN_W;
        screenCanvas.height = SCREEN_H;
        const sctx = screenCanvas.getContext("2d")!;
        const screenTex = new T.CanvasTexture(screenCanvas);
        screenTex.colorSpace = T.SRGBColorSpace;
        screenTex.anisotropy = 4;
        const screenGeo = new T.PlaneGeometry(0.43, 0.25);
        geos.push(screenGeo);
        const screenMat = new T.MeshBasicMaterial({ map: screenTex, toneMapped: false });
        mats.push(screenMat);
        const screen = new T.Mesh(screenGeo, screenMat);
        screen.position.set(0, 0.14, 0.0065);
        hinge.add(screen);
        hinge.updateMatrixWorld(true);
        screenGlow.position.copy(screen.getWorldPosition(new T.Vector3())).add(v(0, 0, 0.25));

        // Coffee mug
        const mugGeo = new T.CylinderGeometry(0.04, 0.036, 0.09, 20);
        geos.push(mugGeo);
        const mug = new T.Mesh(mugGeo, mat(COLORS.mug, 0.4));
        mug.position.set(0.46, 0.715, 0.05);
        mug.castShadow = true;
        rig.add(mug);

        // Chair, under the model's hips (58 cm up, just behind its origin)
        const chairMat = mat(COLORS.chair, 0.6);
        box(0.48, 0.06, 0.46, chairMat, 0, 0.44, 0.45);
        box(0.46, 0.52, 0.06, chairMat, 0, 0.76, 0.71).rotation.x = -0.12;
        box(0.05, 0.38, 0.05, legMat, 0, 0.22, 0.45);
        box(0.5, 0.03, 0.06, legMat, 0, 0.03, 0.45);
        box(0.06, 0.03, 0.5, legMat, 0, 0.03, 0.45);

        // The developer: loaded in the background; the desk shows first
        let mixer: THREE.AnimationMixer | null = null;
        let model: THREE.Group | null = null;
        import("three/addons/loaders/FBXLoader.js")
          .then(({ FBXLoader }) => new FBXLoader().loadAsync(MODEL_URL))
          .then((obj) => {
            if (disposed) return;
            obj.scale.setScalar(MODEL_SCALE);
            obj.rotation.y = Math.PI;
            obj.position.set(0, 0, MODEL_Z);
            obj.traverse((o) => {
              if (!(o as THREE.Mesh).isMesh) return;
              const mesh = o as THREE.Mesh;
              mesh.castShadow = true;
              mesh.frustumCulled = false; // skinned bounds don't follow the animation
              // Untextured materials (Mixamo's mannequin) get a neutral studio finish
              const fix = (m: THREE.Material) => {
                if ((m as THREE.MeshPhongMaterial).map) return m;
                const joint = /joint/i.test(m.name);
                const s = new T.MeshStandardMaterial({ color: joint ? 0x2a3343 : 0x9aa7bb, roughness: 0.55 });
                mats.push(s);
                m.dispose();
                return s;
              };
              mesh.material = Array.isArray(mesh.material) ? mesh.material.map(fix) : fix(mesh.material);
            });
            const clip = obj.animations.find((a) => a.duration > 0);
            if (clip) {
              mixer = new T.AnimationMixer(obj);
              mixer.clipAction(clip).play();
              if (reduced) mixer.setTime(2);
            }
            rig.add(obj);
            model = obj;
            if (reduced) render(0);
          })
          .catch(() => {
            // Model missing or unreadable: the desk scene still shows
          });

        // Code glyphs drifting up from the screen
        const glyphs = ["</>", "{ }", "=>", "( )", "</>", "[ ]"].map((text, i) => {
          const tex = glyphTexture(T, text, TOKEN_COLORS[i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 5]);
          const m = new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
          mats.push(m);
          const sprite = new T.Sprite(m);
          sprite.scale.set(0.16, 0.08, 1);
          rig.add(sprite);
          return { sprite, tex, phase: i / 6, x: (Math.random() - 0.5) * 0.5 };
        });

        const code = randomCode(11);
        const totalWidth = code.reduce((n, l) => n + l.tokens.reduce((m, t) => m + t.w, 0), 0);

        const layout = () => {
          const w = host.clientWidth;
          const h = host.clientHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };

        const pointer = { x: 0, y: 0 };
        const section = host.closest("section");
        const onMove = (e: PointerEvent) => {
          pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
          pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        const onLeave = () => {
          pointer.x = 0;
          pointer.y = 0;
        };

        const timer = new T.Timer();
        let yaw = 0;
        let typed = 0;
        let lastScreen = -1;
        let frame = 0;
        let visible = true;

        const render = (dt: number) => {
          const t = timer.getElapsed();
          mixer?.update(dt);
          // Screen: type a little each frame, hold when full, then start a new file
          typed += dt * 260;
          if (typed > totalWidth + 600) typed = 0;
          const caretOn = Math.floor(t * 2) % 2 === 0;
          const key = Math.floor(Math.min(typed, totalWidth) / 6) * 2 + (caretOn ? 1 : 0);
          if (key !== lastScreen) {
            drawScreen(sctx, code, Math.min(typed, totalWidth), caretOn);
            screenTex.needsUpdate = true;
            lastScreen = key;
          }
          for (const g of glyphs) {
            const p = (t * 0.22 + g.phase) % 1;
            g.sprite.position.set(g.x + Math.sin(p * 6 + g.phase * 9) * 0.05, 0.92 + p * 0.7, -0.15 + p * 0.15);
            g.sprite.material.opacity = Math.sin(p * Math.PI) * 0.9;
          }
          const targetYaw = finePointer ? pointer.x * 0.35 : Math.sin(t * 0.2) * 0.15;
          yaw += (targetYaw - yaw) * Math.min(dt * 3, 1);
          rig.rotation.y = yaw;
          camera.position.y = 1.75 - (finePointer ? pointer.y * 0.2 : 0);
          camera.lookAt(target);
          renderer.render(scene, camera);
        };

        const loop = () => {
          frame = 0;
          timer.update();
          render(Math.min(timer.getDelta(), 0.05));
          if (!reduced && visible && !document.hidden) frame = requestAnimationFrame(loop);
        };
        const wake = () => {
          if (!frame && !reduced) {
            timer.update(); // so the first frame after a pause doesn't jump
            frame = requestAnimationFrame(loop);
          }
        };

        layout();
        if (reduced) typed = totalWidth * 0.7;
        render(0);
        host.dataset.ready = "true";
        wake();

        const io = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) wake();
        });
        io.observe(host);
        const ro = new ResizeObserver(() => {
          layout();
          if (reduced) render(0);
        });
        ro.observe(host);
        const onVisibility = () => !document.hidden && wake();
        document.addEventListener("visibilitychange", onVisibility);
        if (finePointer && section) {
          section.addEventListener("pointermove", onMove);
          section.addEventListener("pointerleave", onLeave);
        }

        cleanup = () => {
          cancelAnimationFrame(frame);
          io.disconnect();
          ro.disconnect();
          document.removeEventListener("visibilitychange", onVisibility);
          section?.removeEventListener("pointermove", onMove);
          section?.removeEventListener("pointerleave", onLeave);
          model?.traverse((o) => (o as THREE.Mesh).isMesh && (o as THREE.Mesh).geometry.dispose());
          geos.forEach((g) => g.dispose());
          mats.forEach((m) => m.dispose());
          glyphs.forEach((g) => g.tex.dispose());
          screenTex.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      });

    // Load three.js only when the section is about to come on screen
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        start();
      },
      { rootMargin: "400px 0px" },
    );
    near.observe(host);

    return () => {
      disposed = true;
      near.disconnect();
      cleanup();
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="coder-scene" />;
}
