/* ---------- 3D runway scene (three.js r128) ---------- */
(function () {
  var cv = document.getElementById('c');
  var R = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  R.setClearColor(0x050505);
  var S = new THREE.Scene();
  S.fog = new THREE.FogExp2(0x050505, 0.035);
  var C = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  var M = function (c, r, m) { return new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m || 0 }); };

  // runway, floor, walls, ceiling
  var run = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 70), M(0xf4f4f2, 0.12, 0.2)); run.position.set(0, -0.05, -25); S.add(run);
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 90), M(0x0a0a0a, 0.5)); floor.rotation.x = -Math.PI / 2; floor.position.set(0, -0.1, -25); S.add(floor);
  var wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); wall.position.set(0, 4, -60); S.add(wall);
  [-1, 1].forEach(function (s) { var w = new THREE.Mesh(new THREE.BoxGeometry(0.3, 8, 70), M(0x1a1a1a, 0.9)); w.position.set(s * 11, 4, -25); S.add(w); });
  var ceil = new THREE.Mesh(new THREE.BoxGeometry(24, 0.3, 70), M(0x050505, 0.9)); ceil.position.set(0, 8, -25); S.add(ceil);

  // your three photos hung as glowing panels along the runway
  var loader = new THREE.TextureLoader();
  var pics = ['images/runway.jpg', 'images/show.jpg', 'images/studio.jpg'];
  pics.forEach(function (src, i) {
    loader.load(src, function (tex) {
      [-1, 1].forEach(function (s, j) {
        var mat = new THREE.MeshBasicMaterial({ map: tex, color: 0xbbbbbb, fog: true });
        var p = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 5.7), mat);
        p.position.set(s * 10.7, 4.2, -6 - i * 14 - j * 7);
        p.rotation.y = -s * Math.PI / 2;
        S.add(p);
      });
    });
  });

  // seating
  var seats = new THREE.InstancedMesh(new THREE.BoxGeometry(0.9, 1.1, 0.9), M(0x151515, 0.6), 2 * 3 * 34), k = 0, d = new THREE.Object3D();
  [-1, 1].forEach(function (s) { for (var r = 0; r < 3; r++) for (var i = 0; i < 34; i++) { d.position.set(s * (3.4 + r * 1.5), 0.55 + r * 0.25, 8 - i * 1.7); d.rotation.y = -s * 0.1; d.updateMatrix(); seats.setMatrixAt(k++, d.matrix); } });
  S.add(seats);

  // lights
  var bar = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (var i = 0; i < 20; i++) [-1, 1].forEach(function (s) { var b = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 1.4), bar); b.position.set(s * 2.6, 7.7, 6 - i * 3.4); S.add(b); });
  for (var j = 0; j < 6; j++) { var l = new THREE.SpotLight(0xffffff, 2.4, 40, 0.5, 0.7, 1); l.position.set(j % 2 ? -3 : 3, 7.5, 5 - j * 9); l.target.position.set(0, 0, l.position.z - 3); S.add(l, l.target); }
  S.add(new THREE.AmbientLight(0xffffff, 0.18));

  // model silhouette
  var fig = new THREE.Group(), bm = M(0x0d0d0d, 0.4), skin = M(0xd8d0c8, 0.6);
  var dress = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.85, 24), bm); dress.position.y = 1.15;
  var torso = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 0.5, 24), bm); torso.position.y = 1.8;
  var neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.18, 12), skin); neck.position.y = 2.12;
  var head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), skin); head.position.y = 2.32;
  var legs = [-1, 1].map(function (s) { var g = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.78, 12), M(0x1a1a1a, 0.3)); g.position.set(s * 0.09, 0.4, 0); return g; });
  fig.add(dress, torso, neck, head, legs[0], legs[1]); fig.position.set(0, 0, -52); S.add(fig);

  // dust
  var pg = new THREE.BufferGeometry(), pa = [];
  for (var p = 0; p < 500; p++) pa.push((Math.random() - 0.5) * 14, Math.random() * 8, Math.random() * -60 + 8);
  pg.setAttribute('position', new THREE.Float32BufferAttribute(pa, 3));
  var dust = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.035, color: 0xffffff, transparent: true, opacity: 0.5 })); S.add(dust);

  function rs() { R.setSize(innerWidth, innerHeight, false); C.aspect = innerWidth / innerHeight; C.updateProjectionMatrix(); }
  addEventListener('resize', rs); rs();
  var mx = 0, my = 0, sc = 0, cur = 0;
  addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });
  function onS() { var h = document.documentElement.scrollHeight - innerHeight; sc = h > 0 ? Math.min(1, scrollY / h) : 0; }
  addEventListener('scroll', onS); onS();
  var t0 = performance.now();
  (function loop() {
    requestAnimationFrame(loop);
    var t = (performance.now() - t0) / 1000;
    cur += (sc - cur) * 0.05;
    C.position.set(mx * 1.2, 1.5 - my * 0.4 + cur * 0.4, 8 - cur * 40);
    C.lookAt(mx * -0.6, 1.5 + cur * 0.2, -30 - cur * 10);
    fig.position.z = Math.min(-52 + ((t * 1.6) % 48), C.position.z - 3);
    fig.position.x = Math.sin(t * 3.2) * 0.05; fig.rotation.y = Math.sin(t * 1.6) * 0.06;
    legs[0].rotation.x = Math.sin(t * 3.2) * 0.25; legs[1].rotation.x = -Math.sin(t * 3.2) * 0.25;
    dust.position.y = Math.sin(t * 0.3) * 0.2;
    R.render(S, C);
  })();
})();

/* ---------- Application form (Formspree) ---------- */
(function () {
  var f = document.getElementById('f'), msg = document.getElementById('msg');
  f.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (f.action.indexOf('YOUR_FORM_ID') > -1) { msg.textContent = 'Form not connected yet. Add your Formspree ID in index.html.'; return; }
    msg.textContent = 'Sending…';
    try {
      var r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
      if (r.ok) { f.reset(); msg.textContent = 'Application received. We’ll be in touch within 48 hours.'; }
      else msg.textContent = 'Something went wrong. Please try again.';
    } catch (err) { msg.textContent = 'Network error. Please try again.'; }
  });
})();
