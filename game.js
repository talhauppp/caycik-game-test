// =========================================================================
// HTML5 Canvas Adapter for Tkinter Canvas API
// Maps Tkinter Canvas methods (create_rectangle, create_oval, create_polygon,
// create_line, create_text, move, delete) directly to HTML5 Canvas 2D Context.
// =========================================================================

class TkCanvasShim {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.items = []; // Display list of drawn items
    this.nextId = 1;
    this.tagsMap = new Map(); // tag -> Set of items
  }

  delete(tagOrAll) {
    if (!tagOrAll || tagOrAll === "all") {
      this.items = [];
      this.tagsMap.clear();
      return;
    }
    const toRemove = this.tagsMap.get(tagOrAll);
    if (toRemove) {
      this.items = this.items.filter(item => !toRemove.has(item));
      this.tagsMap.delete(tagOrAll);
    }
  }

  move(tag, dx, dy) {
    const matched = this.tagsMap.get(tag);
    if (!matched) return;
    for (const item of matched) {
      if (item.coords) {
        for (let i = 0; i < item.coords.length; i += 2) {
          item.coords[i] += dx;
          item.coords[i + 1] += dy;
        }
      }
    }
  }

  tag_lower(tag1, tag2) {
    // Reorder layers if needed
  }

  _addItem(type, coords, kw) {
    const item = { id: this.nextId++, type, coords: [...coords], kw: { ...kw } };
    this.items.push(item);
    let tags = kw.tags;
    if (tags) {
      if (!Array.isArray(tags)) tags = [tags];
      for (const t of tags) {
        if (!this.tagsMap.has(t)) this.tagsMap.set(t, new Set());
        this.tagsMap.get(t).add(item);
      }
    }
    return item.id;
  }

  create_rectangle(x1, y1, x2, y2, kw={}) {
    return this._addItem("rect", [x1, y1, x2, y2], kw);
  }

  create_oval(x1, y1, x2, y2, kw={}) {
    return this._addItem("oval", [x1, y1, x2, y2], kw);
  }

  create_polygon(pts, kw={}) {
    const flat = Array.isArray(pts[0]) ? pts.flat() : pts;
    return this._addItem("polygon", flat, kw);
  }

  create_line(pts, kw={}) {
    const flat = Array.isArray(pts[0]) ? pts.flat() : pts;
    return this._addItem("line", flat, kw);
  }

  create_text(x, y, kw={}) {
    return this._addItem("text", [x, y], kw);
  }

  render(targetCtx, scale=1.0) {
    const ctx = targetCtx || this.ctx;
    for (const item of this.items) {
      const kw = item.kw;
      const fill = kw.fill;
      const outline = kw.outline;
      const width = kw.width !== undefined ? kw.width : 1;

      ctx.save();
      if (kw.dash && ctx.setLineDash) {
        ctx.setLineDash(Array.isArray(kw.dash) ? kw.dash : [kw.dash, kw.dash]);
      }

      if (item.type === "rect") {
        const [x1, y1, x2, y2] = item.coords;
        const w = x2 - x1, h = y2 - y1;
        if (fill && fill !== "") {
          ctx.fillStyle = fill;
          ctx.fillRect(x1, y1, w, h);
        }
        if (outline && outline !== "" && width > 0) {
          ctx.strokeStyle = outline;
          ctx.lineWidth = width;
          ctx.strokeRect(x1, y1, w, h);
        }
      } else if (item.type === "oval") {
        const [x1, y1, x2, y2] = item.coords;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const rx = Math.max(0.1, Math.abs(x2 - x1) / 2);
        const ry = Math.max(0.1, Math.abs(y2 - y1) / 2);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        if (fill && fill !== "") {
          ctx.fillStyle = fill;
          ctx.fill();
        }
        if (outline && outline !== "" && width > 0) {
          ctx.strokeStyle = outline;
          ctx.lineWidth = width;
          ctx.stroke();
        }
      } else if (item.type === "polygon") {
        const pts = item.coords;
        if (pts.length >= 4) {
          ctx.beginPath();
          ctx.moveTo(pts[0], pts[1]);
          for (let i = 2; i < pts.length; i += 2) {
            ctx.lineTo(pts[i], pts[i + 1]);
          }
          ctx.closePath();
          if (fill && fill !== "") {
            ctx.fillStyle = fill;
            ctx.fill();
          }
          if (outline && outline !== "" && width > 0) {
            ctx.strokeStyle = outline;
            ctx.lineWidth = width;
            ctx.stroke();
          }
        }
      } else if (item.type === "line") {
        const pts = item.coords;
        if (pts.length >= 4) {
          ctx.beginPath();
          ctx.moveTo(pts[0], pts[1]);
          for (let i = 2; i < pts.length; i += 2) {
            ctx.lineTo(pts[i], pts[i + 1]);
          }
          ctx.strokeStyle = fill || outline || "#000000";
          ctx.lineWidth = width;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();
        }
      } else if (item.type === "text") {
        const [x, y] = item.coords;
        const font = kw.font;
        if (font) {
          if (Array.isArray(font)) {
            const family = font[0];
            const size = font[1];
            const weight = font[2] || "normal";
            ctx.font = `${weight} ${size}px ${family}`;
          } else {
            ctx.font = font;
          }
        }
        ctx.fillStyle = fill || "#000000";
        const anchor = kw.anchor || "center";
        if (anchor === "w") ctx.textAlign = "left";
        else if (anchor === "e") ctx.textAlign = "right";
        else ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(kw.text || "", x, y);
      }
      ctx.restore();
    }
  }
}

// =========================================================================
// ÇAYCIK: BOSS SAVAŞI - 100% Orijinal Python Kaynak Kodundan Birebir Çevrilmiştir.
// Tüm 12 Bölüm, 5 Boss, Parallax Katmanları, Sesler ve Kurallar Birebir Aynıdır.
// =========================================================================

function py_in(item, container) {
  if (Array.isArray(container) || typeof container === 'string') return container.includes(item);
  if (container instanceof Set) return container.has(item);
  if (typeof container === 'object' && container !== null) return item in container;
  return false;
}

function py_choice(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

class Random {
  constructor(seed=1) { this.seed = seed; }
  random() {
    let x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  uniform(a, b) { return a + this.random() * (b - a); }
  randint(a, b) { return Math.floor(a + this.random() * (b - a + 1)); }
  choice(arr) { return arr[Math.floor(this.random() * arr.length)]; }
}

const random = {
  random: () => Math.random(),
  uniform: (a, b) => a + Math.random() * (b - a),
  randint: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
  choice: (arr) => arr[Math.floor(Math.random() * arr.length)],
  sample: (arr, n) => {
    let copy = [...arr];
    let res = [];
    for (let i = 0; i < n && copy.length; i++) {
      let idx = Math.floor(Math.random() * copy.length);
      res.push(copy.splice(idx, 1)[0]);
    }
    return res;
  },
  randrange: (n) => Math.floor(Math.random() * n),
  Random: Random
};

const math = Math;
math.tau = Math.PI * 2;

"\nÇAYCIK: BOSS SAVAŞI\n===================\n1930'lar çizgi film tarzında, Cuphead'den esinlenen 2D boss savaşı.\nTek dosya - sadece Python standart kütüphanesi (tkinter). Kurulum gerektirmez.\n\nKONTROLLER\n  Sol/Sağ veya A/D   : koş\n  Space / Z          : zıpla (havada basılı tut = daha yüksek)\n  Havada PEMBE nesneye tekrar zıpla : PARRY (EX kartı kazanırsın)\n  X / J              : ateş (basılı tut)  - Yukarı/W ile yukarı nişan\n  Shift / C          : atılma (dash) - atılırken dokunulmazsın\n  Q / E              : EX atışı (1 kart harcar)\n  Esc                : duraklat        F11 : tam ekran\n  FARE MODU (Ayarlar > Kontroller): imleç yönüne nişan, sol tık ateş, sağ tık EX\n\nTüm tuşlar, tam ekran, çözünürlük ve zorluk AYARLAR menüsünden değiştirilebilir.\n\nİlerleme ve notlar, oyunun yanındaki \"caycik_kayit.json\" dosyasına kaydedilir.\n";
/* import */;
/* import */;
/* import */;
/* import */;
/* import */;
/* import */;
/* import */;
/* import */;
/* import */;
let [W, H] = [960, 540];
let GROUND = 452;
let GRAV = 0.85;
let INK = "#1b1209";
let CREAM = "#f7e8c0";
let WHITE = "#fffaf0";
let GOLD = "#f2b632";
let RED = "#c8372d";
let PINK = "#ff6fb5";
let FONT = "Georgia";
let SAVE = "caycik_kayit.json";
let LEFT = ["left", "a"];
let RIGHT = ["right", "d"];
let UPK = ["up", "w"];
let DOWNK = ["down", "s"];
let JUMP = ["space", "z", "k"];
let SHOOT = ["x", "j"];
let DASH = ["shift_l", "shift_r", "c", "l"];
let EXK = ["q", "e", "v"];
let OKK = ["return", "space", "z"];
let BACKK = ["escape"];
let NORM = ({ ["shift_r"]: "shift_l", ["control_r"]: "control_l", ["alt_r"]: "alt_l" });
let KEYNAMES = ({ ["left"]: "←", ["right"]: "→", ["up"]: "↑", ["down"]: "↓", ["space"]: "BOŞLUK", ["shift_l"]: "SHIFT", ["control_l"]: "CTRL", ["alt_l"]: "ALT", ["return"]: "ENTER", ["tab"]: "TAB", ["caps_lock"]: "CAPS", ["backspace"]: "⌫", ["delete"]: "DEL" });
let DEFAULT_BINDS = ({ left: ["left", "a"], right: ["right", "d"], up: ["up", "w"], jump: ["space", "z"], shoot: ["x", "j"], dash: ["shift_l", "c"], ex: ["q", "e"] });
let ACTIONS = [["left", "Sola git"], ["right", "Sağa git"], ["up", "Yukarı nişan (klavye)"], ["jump", "Zıpla / Parry"], ["shoot", "Ateş"], ["dash", "Atılma (Dash)"], ["ex", "EX atışı"]];
let KEYACTS = new Set(ACTIONS.map([a, _] => a));
let DEFAULT_SETTINGS = ({ fullscreen: false, res: 0, grain: true, shake: true, sound: true, aim: "keyboard", diff: [1, 1, 1] });
let RES = [[960, 540], [1280, 720], [1600, 900], [1920, 1080]];
let DIFF = [({ name: "KOLAY", hp: 5, bhp: 0.7, bt: 0.82, shot: 0.9, cap: 79, col: "#6fd04a", info: "KOLAY: 5 can · boss %30 daha zayıf ve yavaş · en yüksek not B" }), ({ name: "NORMAL", hp: 3, bhp: 1.0, bt: 1.0, shot: 1.0, col: GOLD, info: "NORMAL: 3 can · standart savaş" }), ({ name: "ZOR", hp: 2, bhp: 1.3, bt: 1.15, shot: 1.1, bonus: 5, col: "#ff5a4a", info: "ZOR: 2 can · boss %30 daha dayanıklı ve hızlı · +5 puan" })];
function hx(c) {
  return tuple([1, 3, 5].map(i => Math.floor(c.slice(i, (i + 2)))));
}
function mix(a, b, t) {
  let [a, b] = [hx(a), hx(b)];
  return ("#%02x%02x%02x" % tuple(range(3).map(i => Math.floor((a[i] + ((b[i] - a[i]) * t))))));
}
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}
function seg_dist(px, py, x1, y1, x2, y2) {
  let [dx, dy] = [(x2 - x1), (y2 - y1)];
  let l = ((dx * dx) + (dy * dy));
  let t = (l === 0 ? 0 : clamp(((((px - x1) * dx) + ((py - y1) * dy)) / l), 0, 1));
  return Math.hypot((px - (x1 + (t * dx))), (py - (y1 + (t * dy))));
}
function keyname(k) {
  return ((!k) ? "—" : KEYNAMES.get(k, k.upper()));
}
function star_pts(cx, cy, r1, r2, n, rot) {
  let pts = [];
  for (let i = 0; i < (n * 2); i++) {
    let a = (rot + ((i * Math.PI) / n));
    let r = ((i % 2) === 0 ? r1 : r2);
    pts.append([(cx + (Math.cos(a) * r)), (cy + (Math.sin(a) * r))]);
  }
  return pts;
}
class Cv {
  "Tuvali ölçekleyen ince sarmalayıcı: oyun mantıksal 960x540 koordinatlarında çizer,\n    gerçek tuvale (çözünürlüğe göre) ölçeklenmiş olarak aktarır.";
  constructor(r) {
    this.r = r;
    this.S = 1.0;
  }
  _co(a) {
    if ((a.length === 1) && (isinstance(a[0], [list, tuple]))) {
      let a = a[0];
    }
    return a.map(v => (v * this.S));
  }
  _kw(k) {
    let S = this.S;
    if (py_in("width", k)) {
      k["width"] = (k["width"] * S);
    }
    if (py_in("dash", k)) {
      k["dash"] = tuple(k["dash"].map(d => Math.max(1, Math.floor((d * S)))));
    }
    if (py_in("font", k)) {
      let f = k["font"];
      k["font"] = ([f[0], Math.max(6, Math.floor(Math.round((f[1] * S))))] + tuple(f.slice(2)));
    }
    return k;
  }
  create_rectangle() {
    return this.r.create_rectangle();
  }
  create_oval() {
    return this.r.create_oval();
  }
  create_polygon() {
    return this.r.create_polygon();
  }
  create_line() {
    return this.r.create_line();
  }
  create_text() {
    return this.r.create_text();
  }
  move(tag, dx, dy) {
    this.r.move(tag, (dx * this.S), (dy * this.S));
  }
  __getattr__(n) {
    return getattr(this.r, n);
  }
}
class Sfx {
  "Sadece Windows'ta (winsound) çalışır; diğer sistemlerde sessiz kalır.";
  constructor() {
    this.ok = false;
    this.on = true;
    this.d = ({  });
    try {
      /* import */;
      this.ws = winsound;
      this.d = ({ ["blip"]: this.mk(700, 0.05), ["ok"]: this.mk(900, 0.09, 400), ["hurt"]: this.mk(220, 0.28, (-160)), ["parry"]: this.mk(1100, 0.14, 700), ["dash"]: this.mk(500, 0.08, (-250)), ["ko"]: this.mk(600, 0.7, (-500)), ["go"]: this.mk(500, 0.25, 600) });
      this.ok = true;
    } catch (e) {
      this.ok = false;
    }
  }
  mk(f, dur, slide) {
    let sr = 22050;
    let n = Math.floor((sr * dur));
    let b = io.BytesIO();
    let w = wave.open(b, "wb");
    w.setnchannels(1);
    w.setsampwidth(2);
    w.setframerate(sr);
    let fr = bytearray();
    let ph = 0.0;
    for (let i = 0; i < n; i++) {
      let f2 = (f + ((slide * i) / n));
      let ph = ((ph + (f2 / sr)) % 1.0);
      let v = (ph < 0.5 ? 1 : (-1));
      fr += struct.pack("<h", Math.floor(((v * (1 - (i / n))) * 5000)));
    }
    w.writeframes(bytes(fr));
    w.close();
    return b.getvalue();
  }
  play(k) {
    if ((this.on) && (this.ok) && (py_in(k, this.d))) {
      try {
        this.ws.PlaySound(this.d[k], (this.ws.SND_MEMORY + this.ws.SND_ASYNC));
      } catch (e) {
        /* pass */;
      }
    }
  }
}
class Bullet {
  constructor(x, y, vx, vy, ex) {
    let [this.x, this.y, this.vx, this.vy] = [x, y, vx, vy];
    this.ex = ex;
    this.r = (ex ? 18 : 6);
    this.age = 0;
    this.dead = false;
    this.hit = false;
    this.hits = new Set();
  }
}
class Player {
  constructor() {
    this.x = 170.0;
    this.y = Number(GROUND);
    this.vx = this.vy = 0.0;
    this.face = 1;
    this.on = true;
    this.coy = 0;
    this.hp = 3;
    this.maxhp = 3;
    this.inv = 0;
    this.hurt = 0;
    this.dash = 0;
    this.dd = 1;
    this.dcd = 0;
    this.cd = 0;
    this.mz = 0;
    this.card = 0.0;
    this.parries = 0;
    this.jh = false;
    this.t = 0;
  }
  box() {
    return [(this.x - 13), (this.y - 54), (this.x + 13), (this.y - 3)];
  }
  aimvec(g) {
    if ((g.mouse_mode) && (g.state === "fight")) {
      let [dx, dy] = [(g.mx - (this.x - g.camx)), (g.my - (this.y - 36))];
      let d = (Math.hypot(dx, dy)) || (1.0);
      return [(dx / d), (dy / d)];
    }
    let up = g.act("up");
    let mv = (g.act("left")) || (g.act("right"));
    if ((up) && (mv)) {
      return [(this.face * 0.7071), (-0.7071)];
    }
    if (up) {
      return [0.0, (-1.0)];
    }
    return [Number(this.face), 0.0];
  }
  update(g) {
    this.t += 1;
    for (let a of ["inv", "hurt", "dcd", "cd", "mz"]) {
      let v = getattr(this, a);
      if (v > 0) {
        setattr(this, a, (v - 1));
      }
    }
    if (this.hp <= 0) {
      return;
    }
    let l = g.act("left");
    let r = g.act("right");
    let locked = this.hurt > 14;
    if (this.dash > 0) {
      this.dash -= 1;
      this.vx = (this.dd * 14.5);
      this.vy = 0;
      if ((this.t % 2) === 0) {
        g.dust((this.x - (this.dd * 10)), (this.y - 4), 1);
      }
    } else {
      let tgt = (((r ? 1 : 0) - (l ? 1 : 0)) * 5.5);
      if (locked) {
        let tgt = 0;
      }
      this.vx += ((tgt - this.vx) * (this.on ? 0.42 : 0.24));
      if ((!locked)) {
        if ((r) && ((!l))) {
          this.face = 1;
        } else if ((l) && ((!r))) {
          this.face = (-1);
        }
      }
      if ((g.actp("dash")) && (this.dcd <= 0) && ((!locked))) {
        this.dash = 12;
        this.dcd = 38;
        this.dd = this.face;
        g.sfx.play("dash");
        g.dust(this.x, (this.y - 4), 5);
      }
    }
    if ((g.mouse_mode) && (this.dash === 0) && ((!locked))) {
      this.face = (g.mx >= (this.x - g.camx) ? 1 : (-1));
    }
    let jp = g.actp("jump");
    if ((jp) && ((!locked))) {
      if ((this.on) || (this.coy > 0)) {
        this.vy = (-16.8);
        this.on = false;
        this.coy = 0;
        this.jh = true;
        g.dust(this.x, this.y, 5);
      } else {
        g.try_parry();
      }
    }
    if ((this.jh) && ((!g.act("jump")))) {
      this.jh = false;
      if (this.vy < (-6)) {
        this.vy *= 0.45;
      }
    }
    if (this.dash === 0) {
      this.vy = Math.min((this.vy + GRAV), 17.0);
    }
    let [lo, hi] = g.xrange();
    this.x = clamp((this.x + this.vx), lo, hi);
    let oy = this.y;
    this.y += this.vy;
    let was = this.on;
    this.on = false;
    if (this.vy >= 0) {
      for (let [x1, x2, top] of g.plats) {
        if (((x1 - 8) <= this.x && this.x <= (x2 + 8)) && (oy <= (top + 2)) && (this.y >= top)) {
          this.y = Number(top);
          this.vy = 0;
          this.on = true;
        }
      }
      if ((this.y >= GROUND) && (oy <= (GROUND + 2)) && (g.ground_at(this.x))) {
        this.y = Number(GROUND);
        this.vy = 0;
        this.on = true;
      }
    }
    if (this.on) {
      this.coy = 6;
      if ((!was)) {
        g.dust(this.x, this.y, 6);
      }
    } else {
      this.coy = Math.max(0, (this.coy - 1));
    }
    let can = (g.intro <= 60) && ((!locked)) && (this.dash === 0) && (g.ko === 0);
    if ((can) && (g.shooting()) && (this.cd <= 0)) {
      this.cd = 5;
      let [ax, ay] = this.aimvec(g);
      let ang = (Math.atan2(ay, ax) + ((-0.03) + Math.random() * (0.03 - (-0.03))));
      g.bul.append(Bullet((this.x + (ax * 30)), ((this.y - 36) + (ay * 26)), (Math.cos(ang) * 18), (Math.sin(ang) * 18)));
      this.mz = 4;
    }
    if ((can) && (g.ex_pressed()) && (this.card >= 1)) {
      this.card -= 1;
      let [ax, ay] = this.aimvec(g);
      g.bul.append(Bullet((this.x + (ax * 30)), ((this.y - 36) + (ay * 26)), (ax * 13), (ay * 13), true));
      this.mz = 8;
      g.shake = 6;
      g.burst((this.x + (ax * 30)), (this.y - 36), GOLD, 10, 5);
    }
  }
}
class Shot {
  constructor(kind, x, y, vx, vy, r, pink, g, hp, hh, sp, ph, life, skin) {
    this.skin = skin;
    let [this.kind, this.x, this.y, this.vx, this.vy] = [kind, x, y, vx, vy];
    let [this.r, this.pink, this.g, this.hp, this.hh, this.sp, this.ph, this.life] = [r, pink, g, hp, hh, sp, ph, life];
    this.t = 0;
    this.dead = false;
    this.ang = ((vx) || (vy) ? Math.atan2(vy, vx) : 0.0);
    this.flash = 0;
    this.spin = (0 + Math.random() * (6 - 0));
  }
  update(G) {
    this.t += 1;
    let k = this.kind;
    if (k === "carrot") {
      if (this.t < 200) {
        let p = G.p;
        let want = Math.atan2(((p.y - 30) - this.y), (p.x - this.x));
        let d = ((((want - this.ang) + Math.PI) % (2 * Math.PI)) - Math.PI);
        this.ang += clamp(d, (-0.045), 0.045);
      }
      this.vx = (Math.cos(this.ang) * this.sp);
      this.vy = (Math.sin(this.ang) * this.sp);
    } else if (k === "fly") {
      this.vx = (Math.sin(((this.t * 0.07) + this.ph)) * 2.6);
    } else if (k === "gear") {
      if ((this.y >= (GROUND - this.r)) && (this.vy >= 0)) {
        this.y = (GROUND - this.r);
        this.vy = (-8.5);
      }
      this.spin -= 0.2;
    } else if (py_in(k, ["card", "star"])) {
      this.spin += 0.22;
    } else if (k === "roll") {
      this.spin -= 0.15;
    } else if (k === "bee") {
      this.vy = (Math.sin(((this.t * 0.12) + this.ph)) * 2.6);
    }
    this.vy += this.g;
    this.x += this.vx;
    this.y += this.vy;
    if ((k === "bomb") && (this.y >= (GROUND - this.r))) {
      this.dead = true;
      G.bomb_boom(this);
    }
    if ((py_in(this.skin, ["honey", "snow"])) && (this.vy > 0) && (this.y >= (GROUND - this.r))) {
      this.dead = true;
      G.burst(this.x, (GROUND - 6), (this.skin === "snow" ? "#ffffff" : GOLD), 8, 4);
    }
    if ((k === "ice") && (this.y >= (GROUND - 10))) {
      this.dead = true;
      G.burst(this.x, (GROUND - 6), "#bfeaff", 8, 4);
    }
    if (this.flash > 0) {
      this.flash -= 1;
    }
    if ((this.t > this.life) || (this.x < (G.camx - 90)) || (this.x > ((G.camx + W) + 90)) || (this.y > (H + 90)) || (this.y < (-140))) {
      this.dead = true;
    }
  }
}
function hits_player(sh, p) {
  if (sh.kind === "wave") {
    return (Math.abs((sh.x - p.x)) < (sh.r + 10)) && (p.y > (GROUND - sh.hh));
  }
  let [bx1, by1, bx2, by2] = p.box();
  let cx = clamp(sh.x, bx1, bx2);
  let cy = clamp(sh.y, by1, by2);
  return Math.hypot((sh.x - cx), (sh.y - cy)) < (sh.r * 0.8);
}
class Base {
  pick(opts) {
    let o = (opts.filter(x => x !== this.last).map(x => x)) || (opts);
    this.last = py_choice(o);
    return this.last;
  }
  hurt(d) {
    this.hp = Math.max(0, (this.hp - d));
    this.flash = 2;
  }
}
class Frog extends Base {
  name = "KURBAĞA KRAL";
  maxhp = 250;
  constructor(g) {
    this.g = g;
    this.hp = this.maxhp;
    this.x = 770.0;
    this.y = Number(GROUND);
    this.vx = this.vy = 0.0;
    this.st = "idle";
    this.tm = 60;
    this.t = 0;
    this.flash = 0;
    this.ph = 1;
    this.face = (-1);
    this.n = 0;
    this.sq = 1.0;
    this.mouth = 0;
    this.last = "";
    this.dead = false;
  }
  boxes() {
    return [[(this.x - 70), (this.y - 165), (this.x + 70), (this.y - 8)]];
  }
  update() {
    let g = this.g;
    let p = g.p;
    this.t += 1;
    this.flash = Math.max(0, (this.flash - 1));
    this.mouth = Math.max(0, (this.mouth - 1));
    if (!py_in(this.st, ["air"])) {
      this.face = (p.x < this.x ? (-1) : 1);
    }
    if ((this.ph === 1) && (this.hp <= (this.maxhp * 0.5))) {
      this.ph = 2;
      this.st = "roar";
      this.tm = 70;
      g.shake = 12;
    }
    let st = this.st;
    if (st === "idle") {
      this.sq = (1 + (0.03 * Math.sin((this.t * 0.12))));
      this.tm -= 1;
      if (this.tm <= 0) {
        let a = this.pick((["spit", "jump"] + (this.ph === 2 ? ["flies"] : [])));
        this.st = (a + "_w");
        this.tm = 26;
        this.n = 0;
      }
    } else if (st === "roar") {
      this.sq = (1.1 + (0.05 * Math.sin(this.t)));
      this.mouth = 2;
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "idle";
        this.tm = 30;
      }
    } else if (st === "spit_w") {
      this.sq = 0.9;
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "spit";
        this.tm = 0;
      }
    } else if (st === "spit") {
      this.tm -= 1;
      if (this.tm <= 0) {
        let total = (this.ph === 1 ? 3 : 5);
        let mx = (this.x + (this.face * 66));
        let my = (this.y - 100);
        let ang = (Math.atan2(((p.y - 30) - my), (p.x - mx)) + ((-0.12) + Math.random() * (0.12 - (-0.12))));
        let sp = (this.ph === 1 ? 5.6 : 6.6);
        let pink = (this.n === (total - 1)) || ((this.ph === 2) && (this.n === 1));
        g.shots.append(Shot("ball", mx, my, (Math.cos(ang) * sp), (Math.sin(ang) * sp)));
        this.mouth = 10;
        this.n += 1;
        this.tm = (this.ph === 1 ? 18 : 13);
        this.sq = 1.08;
        if (this.n >= total) {
          this.st = "idle";
          this.tm = (this.ph === 1 ? 55 : 38);
        }
      }
    } else if (st === "jump_w") {
      this.sq = 0.78;
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "air";
        this.vy = (-23.0);
        let T = ((2 * 23.0) / 0.9);
        let tx = (this.x > 480 ? (170 + Math.random() * (330 - 170)) : (640 + Math.random() * (790 - 640)));
        this.vx = ((tx - this.x) / T);
      }
    } else if (st === "air") {
      this.vy += 0.9;
      this.x += this.vx;
      this.y += this.vy;
      this.sq = (this.vy < 0 ? 1.18 : 1.05);
      if (this.y >= GROUND) {
        this.y = Number(GROUND);
        this.vy = 0;
        this.vx = 0;
        this.st = "land";
        this.tm = 34;
        g.shake = 12;
        g.dust(this.x, GROUND, 10);
        let sp = (this.ph === 1 ? 6.5 : 7.8);
        for (let d of [(-1), 1]) {
          g.shots.append(Shot("wave", (this.x + (d * 60)), (GROUND - 2), (d * sp), 0));
        }
      } else if (this.vy > 0) {
        let bx = this.boxes()[0];
        let [px1, py1, px2, py2] = p.box();
        if ((px1 < bx[2]) && (px2 > bx[0]) && (py1 < bx[3]) && (py2 > bx[1])) {
          g.hurt_player();
        }
      }
    } else if (st === "land") {
      this.sq = (0.8 + (0.2 * (1 - (this.tm / 34.0))));
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "idle";
        this.tm = (this.ph === 1 ? 40 : 26);
      }
    } else if (st === "flies_w") {
      this.mouth = 2;
      this.sq = 1.1;
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "flies";
        this.tm = 0;
      }
    } else if (st === "flies") {
      this.tm -= 1;
      if (this.tm <= 0) {
        g.shots.append(Shot("fly", (80 + Math.random() * (880 - 80)), (-20), 0, 2.4));
        this.n += 1;
        this.tm = 16;
        if (this.n >= 7) {
          this.st = "idle";
          this.tm = 45;
        }
      }
    }
  }
  draw(g, ox) {
    let p = g.p;
    let x = (this.x + ox);
    let y = this.y;
    let sq = this.sq;
    let fl = this.flash > 0;
    function C(c) {
      return (fl ? "#ffffff" : c);
    }
    let [green, dk, belly] = [C("#69b043"), C("#3d7a2b"), C("#e4f09a")];
    g.ov(x, (GROUND + 5), 92, 9, mix(g.gcol, INK, 0.5), 0, "");
    g.ov((x - 62), (y - (20 * sq)), 34, (22 * sq), dk);
    g.ov((x + 62), (y - (20 * sq)), 34, (22 * sq), dk);
    g.ov(x, (y - (72 * sq)), 82, (72 * sq), green);
    g.ov(x, (y - (52 * sq)), 56, (46 * sq), belly, 2);
    for (let d of [(-1), 1]) {
      g.ov((x + (d * 60)), (y - 8), 36, 13, green);
      g.ov((x + (d * 40)), (y - (60 * sq)), 17, (26 * sq), dk, 2);
    }
    for (let d of [(-1), 1]) {
      let ex = (x + (d * 38));
      let ey = (y - (146 * sq));
      g.ov(ex, ey, 28, 28, green);
      g.ov(ex, ey, 21, 21, C("#fffbe8"), 2);
      let dx = (p.x - ex);
      let dy = ((p.y - 30) - ey);
      let dd = (Math.hypot(dx, dy)) || (1);
      g.ov((ex + ((dx / dd) * 8)), (ey + ((dy / dd) * 8)), 9, 11, INK, 0, "");
      let lid = (this.ph === 1 ? 4 : 12);
      g.pl([[(ex + (d * 30)), (ey - 34)], [(ex - (d * 30)), (ey - 34)], [(ex - (d * 30)), ((ey - lid) - 2)], [(ex + (d * 30)), ((ey - lid) - 18)]], green, 3);
    }
    let my = (y - (92 * sq));
    if (this.mouth > 0) {
      g.ov(x, (my + 6), 50, 24, "#7a1f1f");
      g.ov(x, (my + 18), 28, 9, PINK, 0, "");
    } else {
      g.ln([[(x - 54), (my - 6)], [x, (my + 12)], [(x + 54), (my - 6)]], 6, INK, true);
    }
    let cy = (y - (184 * sq));
    g.pl([[(x - 26), (cy + 8)], [(x - 26), (cy - 20)], [(x - 13), (cy - 6)], [x, (cy - 26)], [(x + 13), (cy - 6)], [(x + 26), (cy - 20)], [(x + 26), (cy + 8)]], C(GOLD));
    g.ov(x, (cy - 2), 5, 5, C(RED), 2);
    for (let [wx, wy] of [[(-50), (-100)], [(-62), (-70)], [55, (-105)], [64, (-64)]]) {
      g.ov((x + wx), (y + (wy * sq)), 6, 5, dk, 2);
    }
  }
}
class Mage extends Base {
  name = "SİHİRBAZ TAVŞAN";
  maxhp = 320;
  constructor(g) {
    this.g = g;
    this.hp = this.maxhp;
    let [this.bx, this.by] = [760.0, 250.0];
    let [this.x, this.y] = [this.bx, this.by];
    this.st = "idle";
    this.tm = 70;
    this.t = 0;
    this.flash = 0;
    this.ph = 1;
    this.n = 0;
    this.vol = 0;
    this.last = "";
    this.dead = false;
    this.vis = 1.0;
    this.puff = 0;
  }
  boxes() {
    if (this.vis < 0.5) {
      return [];
    }
    return [[(this.x - 62), (this.y - 110), (this.x + 62), (this.y + 105)]];
  }
  fan() {
    let g = this.g;
    let p = g.p;
    let n = (this.ph === 1 ? 5 : 7);
    let sp = (this.ph === 1 ? 6.2 : 7.0);
    let spread = (this.ph === 1 ? 1.0 : 1.3);
    let a0 = (Math.atan2(((p.y - 30) - this.y), (p.x - this.x)) + ((-0.15) + Math.random() * (0.15 - (-0.15))));
    let pk = (Math.random() < 0.75 ? random.randrange(n) : (-1));
    for (let i = 0; i < n; i++) {
      let a = ((a0 - (spread / 2)) + ((spread * i) / (n - 1)));
      g.shots.append(Shot("card", (this.x - 20), this.y, (Math.cos(a) * sp), (Math.sin(a) * sp)));
    }
  }
  update() {
    let g = this.g;
    let p = g.p;
    this.t += 1;
    this.flash = Math.max(0, (this.flash - 1));
    this.y = (this.by + (Math.sin((this.t * 0.06)) * 16));
    this.x = (this.bx + (Math.sin((this.t * 0.031)) * 18));
    if ((this.ph === 1) && (this.hp <= (this.maxhp * 0.5))) {
      this.ph = 2;
      g.shake = 10;
      this.st = "idle";
      this.tm = 40;
      g.burst(this.x, this.y, PINK, 24, 6);
    }
    let st = this.st;
    if (st === "idle") {
      this.tm -= 1;
      if (this.tm <= 0) {
        let a = this.pick((["cards", "carrots", "tele"] + (this.ph === 2 ? ["stars"] : [])));
        this.st = (a + "_w");
        this.tm = 26;
        this.n = 0;
        if (a === "cards") {
          this.vol = (this.ph === 1 ? 2 : 3);
        }
      }
    } else if (st === "cards_w") {
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "cards";
        this.tm = 0;
      }
    } else if (st === "cards") {
      this.tm -= 1;
      if (this.tm <= 0) {
        if (this.vol <= 0) {
          this.st = "idle";
          this.tm = (this.ph === 1 ? 55 : 38);
        } else {
          this.fan();
          this.vol -= 1;
          this.tm = 44;
        }
      }
    } else if (st === "carrots_w") {
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "carrots";
      }
    } else if (st === "carrots") {
      let n = (this.ph === 1 ? 2 : 3);
      let pk = random.randrange(n);
      for (let i = 0; i < n; i++) {
        let a = (Math.atan2(((p.y - 30) - this.y), (p.x - this.x)) + ((i - ((n - 1) / 2.0)) * 0.7));
        let sp = (4.4 + (0.7 * (this.ph - 1)));
        g.shots.append(Shot("carrot", (this.x - 30), (this.y + 10), (Math.cos(a) * 3), (Math.sin(a) * 3)));
      }
      this.st = "idle";
      this.tm = 85;
    } else if (st === "tele_w") {
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "vanish";
        this.tm = 22;
        g.burst(this.x, this.y, "#e9dcff", 14, 4);
      }
    } else if (st === "vanish") {
      this.vis = (this.tm / 22.0);
      this.tm -= 1;
      if (this.tm <= 0) {
        let spots = [[800, 260], [170, 250], [480, 190]];
        let spots = spots.filter(q => Math.abs((q[0] - this.bx)) > 60).map(q => q);
        let [this.bx, this.by] = py_choice(spots);
        this.st = "appear";
        this.tm = 22;
      }
    } else if (st === "appear") {
      this.vis = (1 - (this.tm / 22.0));
      this.tm -= 1;
      if (this.tm <= 0) {
        this.vis = 1.0;
        this.st = "cards_w";
        this.tm = 10;
        this.vol = 1;
        g.burst(this.bx, this.by, "#e9dcff", 14, 4);
      }
    } else if (st === "stars_w") {
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "stars";
        this.tm = 0;
        this.n = 0;
      }
    } else if (st === "stars") {
      this.tm -= 1;
      if (this.tm <= 0) {
        if (this.n >= 3) {
          this.st = "idle";
          this.tm = 55;
        } else {
          let gi = Math.floor(1 + Math.random() * (8 - 1 + 1));
          let pk = py_choice(range(10).filter(i => Math.abs((i - gi)) > 1).map(i => i));
          for (let i = 0; i < 10; i++) {
            if (Math.abs((i - gi)) <= 1) {
              continue;
            }
            g.shots.append(Shot("star", (48 + ((i * (W - 96)) / 9.0)), (-20), 0, 4.2));
          }
          this.n += 1;
          this.tm = 70;
        }
      }
    }
  }
  draw(g, ox) {
    let p = g.p;
    if (this.vis < 0.06) {
      return;
    }
    let x = (this.x + ox);
    let y = this.y;
    let fl = this.flash > 0;
    function C(c) {
      return (fl ? "#ffffff" : c);
    }
    let sc = (0.55 + (0.45 * this.vis));
    g.ov(x, (GROUND + 5), (60 * sc), 8, mix(g.gcol, INK, 0.5), 0, "");
    g.pl([[(x - (60 * sc)), (y + 10)], [(x + (60 * sc)), (y + 10)], [(x + (92 * sc)), (y + (140 * sc))], [(x - (92 * sc)), (y + (140 * sc))]], C("#7a35b5"), 3, true);
    g.ov(x, (y + (55 * sc)), (48 * sc), (62 * sc), C("#241532"));
    g.ov(x, (y + (55 * sc)), (22 * sc), (42 * sc), C("#fff6e0"), 2);
    let sw = (Math.sin((this.t * 0.12)) * 6);
    g.limb([(x - (36 * sc)), (y + 44)], [(x - (80 * sc)), ((y + 20) + sw)], 6);
    g.ov((x - (82 * sc)), ((y + 18) + sw), 10, 10, WHITE);
    g.limb([(x + (36 * sc)), (y + 44)], [(x + (78 * sc)), ((y + 64) - sw)], (-6));
    g.ov((x + (80 * sc)), ((y + 66) - sw), 10, 10, WHITE);
    for (let d of [(-1), 1]) {
      let e = [[(x + (d * 14)), (y - 30)], [(x + (d * 22)), ((y - (118 * sc)) - 6)], [(x + (d * 46)), (y - (112 * sc))], [(x + (d * 36)), (y - 30)]];
      g.pl(e, C(WHITE), 3, true);
      g.pl([[(x + (d * 20)), (y - 36)], [(x + (d * 27)), (y - (100 * sc))], [(x + (d * 38)), (y - (96 * sc))], [(x + (d * 31)), (y - 36)]], C("#ffb3d1"), 0, true, "");
    }
    g.ov(x, (y - 6), (42 * sc), (38 * sc), C(WHITE));
    g.rc((x - 27), (y - 84), (x + 27), (y - 40), C("#1b1b22"));
    g.rc((x - 27), (y - 58), (x + 27), (y - 46), C(RED), 2);
    g.ov(x, (y - 41), 42, 8, C("#1b1b22"));
    if (py_in(this.st, ["cards_w", "carrots_w", "stars_w", "tele_w"])) {
      g.pl(star_pts(x, (y - 98), 12, 5, 4, (this.t * 0.2)), GOLD, 2);
    }
    for (let d of [(-1), 1]) {
      let ex = (x + (d * 15));
      let ey = (y - 10);
      g.ov(ex, ey, 9, 11, WHITE, 2);
      let dx = (p.x - ex);
      let dy = ((p.y - 30) - ey);
      let dd = (Math.hypot(dx, dy)) || (1);
      g.ov((ex + ((dx / dd) * 3)), (ey + ((dy / dd) * 3)), 4, 6, INK, 0, "");
      g.ln([[(ex - (d * 12)), ((ey - 17) + (this.ph === 2 ? 4 : 0))], [(ex + (d * 8)), (ey - 10)]], 4, INK);
    }
    g.ov(x, (y + 3), 6, 4, C(PINK), 2);
    g.rc((x - 6), (y + 9), (x + 6), (y + 21), WHITE, 2);
    g.ln([[x, (y + 9)], [x, (y + 21)]], 1, INK);
    for (let d of [(-1), 1]) {
      g.ln([[(x + (d * 10)), (y + 4)], [(x + (d * 38)), y]], 2, INK);
      g.ln([[(x + (d * 10)), (y + 8)], [(x + (d * 38)), (y + 12)]], 2, INK);
    }
  }
}
class Clock extends Base {
  name = "ZAMAN EFENDİSİ";
  maxhp = 420;
  cx = 745.0;
  cy = 225.0;
  L = 520;
  constructor(g) {
    this.g = g;
    this.hp = this.maxhp;
    this.st = "idle";
    this.tm = 80;
    this.t = 0;
    this.flash = 0;
    this.ph = 1;
    this.n = 0;
    this.last = "";
    this.dead = false;
    this.beams = [];
    this.live = false;
    this.a0 = 0.0;
    this.dr = 1;
    this.el = 0;
    this.om = 0.034;
    this.hand = 0.0;
  }
  boxes() {
    return [[(this.cx - 100), (this.cy - 100), (this.cx + 100), (this.cy + 100)]];
  }
  ring() {
    let g = this.g;
    let n = (this.ph === 1 ? 16 : 22);
    let off = (0 + Math.random() * ((Math.PI * 2) - 0));
    let sp = (this.ph === 1 ? 3.8 : 4.5);
    let pk = new Set(random.sample(range(n), 2));
    for (let i = 0; i < n; i++) {
      let a = (off + ((i * (Math.PI * 2)) / n));
      g.shots.append(Shot("ball", this.cx, this.cy, (Math.cos(a) * sp), (Math.sin(a) * sp)));
    }
  }
  update() {
    let g = this.g;
    let p = g.p;
    this.t += 1;
    this.flash = Math.max(0, (this.flash - 1));
    this.hand += 0.03;
    if ((this.ph === 1) && (this.hp <= (this.maxhp * 0.5))) {
      this.ph = 2;
      this.st = "idle";
      this.tm = 50;
      this.beams = [];
      this.live = false;
      g.shake = 12;
      this.ring();
    }
    let st = this.st;
    if (st === "idle") {
      this.tm -= 1;
      if (this.tm <= 0) {
        let a = this.pick((["ring", "sweep", "gear"] + (this.ph === 2 ? ["bomb"] : [])));
        this.st = (a + "_w");
        this.tm = 36;
        this.n = 0;
        if (a === "sweep") {
          this.dr = py_choice([(-1), 1]);
          let ang = Math.atan2(((p.y - 30) - this.cy), (p.x - this.cx));
          this.a0 = (ang - (this.dr * 1.1));
          this.om = (this.ph === 1 ? 0.034 : 0.04);
          this.live = false;
          this.beams = ([this.a0] + (this.ph === 2 ? [(this.a0 + Math.PI)] : []));
          this.tm = 50;
        }
      }
    } else if (st === "ring_w") {
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "ring";
        this.tm = 0;
      }
    } else if (st === "ring") {
      this.tm -= 1;
      if (this.tm <= 0) {
        if (this.n >= (this.ph === 1 ? 2 : 3)) {
          this.st = "idle";
          this.tm = 60;
        } else {
          this.ring();
          this.n += 1;
          this.tm = 44;
        }
      }
    } else if (st === "sweep_w") {
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "sweep";
        this.el = 0;
        this.live = true;
        this.tm = 150;
      }
    } else if (st === "sweep") {
      this.el += 1;
      let a = (this.a0 + ((this.dr * this.el) * this.om));
      this.beams = ([a] + (this.ph === 2 ? [(a + Math.PI)] : []));
      for (let b of this.beams) {
        let d = seg_dist(p.x, (p.y - 28), this.cx, this.cy, (this.cx + (this.L * Math.cos(b))), (this.cy + (this.L * Math.sin(b))));
        if (d < 20) {
          g.hurt_player();
        }
      }
      this.tm -= 1;
      if (this.tm <= 0) {
        this.beams = [];
        this.live = false;
        this.st = "idle";
        this.tm = 60;
      }
    } else if (st === "gear_w") {
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "gear";
        this.tm = 0;
      }
    } else if (st === "gear") {
      this.tm -= 1;
      if (this.tm <= 0) {
        let total = (this.ph === 1 ? 2 : 3);
        g.shots.append(Shot("gear", (W + 30), (GROUND - 28), (this.ph === 1 ? (-5.4) : (-6.4)), 0));
        this.n += 1;
        this.tm = 55;
        if (this.n >= total) {
          this.st = "idle";
          this.tm = 80;
        }
      }
    } else if (st === "bomb_w") {
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "bomb";
        this.tm = 0;
      }
    } else if (st === "bomb") {
      this.tm -= 1;
      if (this.tm <= 0) {
        let x = clamp((p.x + ((-150) + Math.random() * (150 - (-150)))), 40, 920);
        g.shots.append(Shot("bomb", x, (-24), 0, 2.5));
        this.n += 1;
        this.tm = 24;
        if (this.n >= 4) {
          this.st = "idle";
          this.tm = 75;
        }
      }
    }
  }
  draw(g, ox) {
    let p = g.p;
    let cx = (this.cx + ox);
    let cy = (this.cy + (Math.sin((this.t * 0.05)) * 5));
    let fl = this.flash > 0;
    function C(c) {
      return (fl ? "#ffffff" : c);
    }
    let gold = C("#e8b43a");
    g.ov(cx, (GROUND + 5), 90, 9, mix(g.gcol, INK, 0.5), 0, "");
    for (let d of [(-1), 1]) {
      g.ln([[(cx + (d * 40)), (cy + 100)], [(cx + (d * 55)), (GROUND - 16)]], 14, INK);
      g.ln([[(cx + (d * 40)), (cy + 100)], [(cx + (d * 55)), (GROUND - 16)]], 8, CREAM);
      g.ov((cx + (d * 62)), (GROUND - 8), 24, 11, "#8a4a22");
    }
    let ring_ = (this.st.endswith("_w") ? (Math.sin((this.t * 0.9)) * 0.2) : 0);
    for (let d of [(-1), 1]) {
      let bxp = (cx + (d * 70));
      let byp = (cy - 100);
      g.ln([[(cx + (d * 40)), (cy - 90)], [bxp, byp]], 8, INK);
      g.ov((bxp + ((d * ring_) * 30)), (byp - 8), 28, 20, C("#d9d9e8"));
      g.ov((bxp + ((d * ring_) * 30)), (byp - 8), 10, 7, INK, 0, "");
    }
    g.ov(cx, cy, 118, 118, gold, 5);
    g.ov(cx, cy, 96, 96, C(CREAM), 3);
    for (let i = 0; i < 12; i++) {
      let a = ((i * Math.PI) / 6);
      g.ln([[(cx + (Math.cos(a) * 80)), (cy + (Math.sin(a) * 80))], [(cx + (Math.cos(a) * 92)), (cy + (Math.sin(a) * 92))]], 4, INK);
    }
    for (let d of [(-1), 1]) {
      let ex = (cx + (d * 30));
      let ey = (cy - 20);
      g.ov(ex, ey, 14, 20, INK, 0, "");
      let dx = (p.x - ex);
      let dy = ((p.y - 30) - ey);
      let dd = (Math.hypot(dx, dy)) || (1);
      g.ov((ex + ((dx / dd) * 4)), (ey + ((dy / dd) * 6)), 6, 8, "#ffffff", 0, "");
      g.ln([[(ex - (d * 18)), (ey - 28)], [(ex + (d * 14)), (ey - 18)]], 5, INK);
    }
    g.pl([[(cx - 36), (cy + 28)], [cx, (cy + 46)], [(cx + 36), (cy + 28)], [(cx + 30), (cy + 22)], [cx, (cy + 32)], [(cx - 30), (cy + 22)]], INK, 3, true);
    for (let i = (-2); i < 3; i++) {
      g.rc(((cx + (i * 11)) - 4), (cy + 28), ((cx + (i * 11)) + 4), (cy + 36), WHITE, 1);
    }
    if ((!this.beams)) {
      for (let [ln_, ang, w] of [[50, this.hand, 6], [34, (this.hand / 12.0), 8]]) {
        g.ln([[cx, cy], [(cx + (Math.cos(ang) * ln_)), (cy + (Math.sin(ang) * ln_))]], w, INK);
      }
    }
    for (let a of this.beams) {
      let tx = (cx + (this.L * Math.cos(a)));
      let ty = (cy + (this.L * Math.sin(a)));
      if ((!this.live)) {
        if ((Math.floor(this.t / 4) % 2) === 0) {
          g.c.create_line(cx, cy, tx, ty);
          g.tx(clamp((cx + (150 * Math.cos(a))), 30, (W - 30)), clamp((cy + (150 * Math.sin(a))), 60, (H - 80)), "!", 30, RED);
        }
      } else {
        let [nx, ny] = [(-Math.sin(a)), Math.cos(a)];
        g.pl([[(cx + (nx * 12)), (cy + (ny * 12))], [tx, ty], [(cx - (nx * 12)), (cy - (ny * 12))]], C(GOLD), 4);
        g.ln([[cx, cy], [(cx + ((tx - cx) * 0.9)), (cy + ((ty - cy) * 0.9))]], 3, WHITE);
      }
    }
  }
}
class Snowman extends Base {
  name = "KAR ADAM KRAL";
  maxhp = 300;
  constructor(g) {
    this.g = g;
    this.hp = this.maxhp;
    this.x = 780.0;
    this.y = Number(GROUND);
    this.st = "idle";
    this.tm = 70;
    this.t = 0;
    this.flash = 0;
    this.ph = 1;
    this.n = 0;
    this.last = "";
    this.dead = false;
    this.face = (-1);
    this.sq = 1.0;
  }
  boxes() {
    return [[(this.x - 72), (this.y - 255), (this.x + 72), (this.y - 6)]];
  }
  update() {
    let g = this.g;
    let p = g.p;
    this.t += 1;
    this.flash = Math.max(0, (this.flash - 1));
    this.face = (p.x < this.x ? (-1) : 1);
    this.sq = (1 + (0.025 * Math.sin((this.t * 0.1))));
    if ((this.ph === 1) && (this.hp <= (this.maxhp * 0.5))) {
      this.ph = 2;
      this.st = "roar";
      this.tm = 60;
      g.shake = 12;
    }
    let st = this.st;
    if (st === "idle") {
      this.tm -= 1;
      if (this.tm <= 0) {
        let a = this.pick(["balls", "roll", "ice"]);
        this.st = (a + "_w");
        this.tm = 28;
        this.n = 0;
      }
    } else if (st === "roar") {
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = "idle";
        this.tm = 35;
      }
    } else if (py_in(st, ["balls_w", "roll_w", "ice_w"])) {
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = st.slice(0, (-2));
        this.tm = 0;
      }
    } else if (st === "balls") {
      this.tm -= 1;
      if (this.tm <= 0) {
        let total = (this.ph === 1 ? 3 : 5);
        let [mx, my] = [(this.x - 50), (this.y - 215)];
        let T = (55 + Math.random() * (75 - 55));
        let tx = (p.x + ((-50) + Math.random() * (50 - (-50))));
        let vx = ((tx - mx) / T);
        let vy = ((((p.y - 30) - my) / T) - ((0.5 * 0.28) * T));
        g.shots.append(Shot("ball", mx, my, vx, vy));
        this.n += 1;
        this.tm = (this.ph === 1 ? 24 : 16);
        if (this.n >= total) {
          this.st = "idle";
          this.tm = (this.ph === 1 ? 60 : 42);
        }
      }
    } else if (st === "roll") {
      this.tm -= 1;
      if (this.tm <= 0) {
        let cnt = (this.ph === 1 ? 1 : 2);
        g.shots.append(Shot("roll", (this.x - 60), (GROUND - 34), (-(this.ph === 1 ? 5.2 : 6.4)), 0));
        this.n += 1;
        this.tm = 60;
        if (this.n >= cnt) {
          this.st = "idle";
          this.tm = (this.ph === 1 ? 80 : 55);
        }
      }
    } else if (st === "ice") {
      this.tm -= 1;
      if (this.tm <= 0) {
        let total = (this.ph === 1 ? 6 : 9);
        if (this.n === 0) {
          let x = (p.x + ((-40) + Math.random() * (40 - (-40))));
        } else {
          let x = clamp((p.x + ((-170) + Math.random() * (170 - (-170)))), 30, 930);
        }
        g.shots.append(Shot("ice", x, (-30), 0, 3.0));
        this.n += 1;
        this.tm = (this.ph === 1 ? 15 : 11);
        if (this.n >= total) {
          this.st = "idle";
          this.tm = 55;
        }
      }
    }
  }
  draw(g, ox) {
    let x = (this.x + ox);
    let y = this.y;
    let fl = this.flash > 0;
    function C(c) {
      return (fl ? "#ffffff" : c);
    }
    let wh = C("#f4fbff");
    let sq = this.sq;
    let f = this.face;
    g.ov(x, (GROUND + 5), 95, 9, mix(g.gcol, INK, 0.5), 0, "");
    g.ov(x, (y - (62 * sq)), 82, (62 * sq), wh);
    g.ov(x, (y - (150 * sq)), 58, (52 * sq), wh);
    g.ov(x, (y - (226 * sq)), 44, (40 * sq), wh);
    for (let yy of [(-172), (-150), (-128)]) {
      g.ov(x, (y + (yy * sq)), 6, 6, INK, 0, "");
    }
    let cast = py_in(this.st, ["balls_w", "balls", "ice_w", "ice"]);
    let lift = (cast ? (-60) : 28);
    let ay = (y - (160 * sq));
    for (let d of [(-1), 1]) {
      let tip = [(x + (d * 122)), (ay + lift)];
      g.ln([[(x + (d * 52)), ay], tip], 9, INK);
      g.ln([[(x + (d * 52)), ay], tip], 5, "#7a4a22");
      g.ln([[(tip[0] - (d * 18)), (tip[1] + (lift * (-0.25)))], [(tip[0] + (d * 12)), (tip[1] - 14)]], 4, "#7a4a22");
    }
    g.pl([[(x - 48), (y - (192 * sq))], [(x + 48), (y - (192 * sq))], [(x + 44), (y - (172 * sq))], [(x - 44), (y - (172 * sq))]], C(RED), 3, true);
    g.pl([[(x + 20), (y - (176 * sq))], [(x + 44), (y - (176 * sq))], [(x + 52), (y - (120 * sq))], [(x + 30), (y - (126 * sq))]], C(RED), 3, true);
    let hy = (y - (230 * sq));
    for (let d of [(-1), 1]) {
      g.ov((x + (d * 16)), hy, 6, 7, INK, 0, "");
      g.ln([[(x + (d * 26)), (hy - 14)], [(x + (d * 8)), (hy - 8)]], 4, INK);
    }
    g.pl([[(x + (f * 2)), (hy + 6)], [(x + (f * 2)), (hy + 16)], [(x + (f * 44)), (hy + 12)]], C("#ff8c1a"), 3);
    for (let k = 0; k < 5; k++) {
      g.ov(((x - 16) + (k * 8)), ((hy + 28) + (((k - 2) ** 2) * 1.4)), 3, 3, INK, 0, "");
    }
    g.ov(x, (y - (262 * sq)), 46, 9, C("#2d3a8a"));
    g.rc((x - 31), (y - (298 * sq)), (x + 31), (y - (262 * sq)), C("#2d3a8a"));
    g.rc((x - 31), (y - (276 * sq)), (x + 31), (y - (266 * sq)), C(GOLD), 2);
  }
}
class Bee extends Base {
  name = "KRAL ARI";
  maxhp = 300;
  constructor(g) {
    this.g = g;
    this.hp = this.maxhp;
    let [this.bx, this.by] = [760.0, 210.0];
    let [this.x, this.y] = [this.bx, this.by];
    this.st = "idle";
    this.tm = 70;
    this.t = 0;
    this.flash = 0;
    this.ph = 1;
    this.n = 0;
    this.last = "";
    this.dead = false;
    this.ty = 300.0;
    this.vx = 0.0;
  }
  boxes() {
    return [[(this.x - 70), (this.y - 60), (this.x + 70), (this.y + 60)]];
  }
  update() {
    let g = this.g;
    let p = g.p;
    this.t += 1;
    this.flash = Math.max(0, (this.flash - 1));
    if ((this.ph === 1) && (this.hp <= (this.maxhp * 0.5))) {
      this.ph = 2;
      g.shake = 10;
      g.burst(this.x, this.y, GOLD, 24, 6);
      if (py_in(this.st, ["dive_w", "dive", "ret"])) {
        this.st = "ret";
        this.x = 1120.0;
      } else {
        this.st = "idle";
        this.tm = 40;
      }
    }
    let st = this.st;
    if (py_in(st, ["idle", "honey_w", "honey", "swarm_w", "swarm"])) {
      this.y = (this.by + (Math.sin((this.t * 0.06)) * 18));
      this.x = (this.bx + (Math.sin((this.t * 0.04)) * 20));
    }
    if (st === "idle") {
      this.tm -= 1;
      if (this.tm <= 0) {
        let a = this.pick(["honey", "swarm", "dive"]);
        this.n = 0;
        if (a === "dive") {
          this.st = "dive_w";
          this.tm = 44;
        } else {
          this.st = (a + "_w");
          this.tm = 26;
        }
      }
    } else if (py_in(st, ["honey_w", "swarm_w"])) {
      this.tm -= 1;
      if (this.tm <= 0) {
        this.st = st.slice(0, (-2));
        this.tm = 0;
      }
    } else if (st === "honey") {
      this.tm -= 1;
      if (this.tm <= 0) {
        let total = (this.ph === 1 ? 5 : 7);
        g.shots.append(Shot("ball", (this.x - 20), (this.y + 25), ((-6.5) + Math.random() * ((-1.2) - (-6.5))), ((-7) + Math.random() * ((-2) - (-7)))));
        this.n += 1;
        this.tm = 12;
        if (this.n >= total) {
          this.st = "idle";
          this.tm = (this.ph === 1 ? 60 : 40);
        }
      }
    } else if (st === "swarm") {
      this.tm -= 1;
      if (this.tm <= 0) {
        let total = (this.ph === 1 ? 6 : 8);
        g.shots.append(Shot("bee", (this.x - 30), (this.y + ((-30) + Math.random() * (60 - (-30)))), (-(this.ph === 1 ? 3.4 : 4.2)), 0));
        this.n += 1;
        this.tm = 14;
        if (this.n >= total) {
          this.st = "idle";
          this.tm = 55;
        }
      }
    } else if (st === "dive_w") {
      this.tm -= 1;
      this.x += ((900 - this.x) * 0.12);
      this.ty = clamp((p.y - 40), 130, (GROUND - 45));
      this.y += ((this.ty - this.y) * 0.12);
      if (this.tm <= 0) {
        this.st = "dive";
        this.vx = (-17.0);
        this.n += 1;
      }
    } else if (st === "dive") {
      this.x += this.vx;
      this.y = this.ty;
      let bx = this.boxes()[0];
      let pb = p.box();
      if ((pb[0] < bx[2]) && (pb[2] > bx[0]) && (pb[1] < bx[3]) && (pb[3] > bx[1])) {
        g.hurt_player();
      }
      if (this.x < (-140)) {
        this.st = "ret";
        this.x = 1120.0;
        this.y = this.by;
      }
    } else if (st === "ret") {
      this.x += ((this.bx - this.x) * 0.07);
      this.y += ((this.by - this.y) * 0.1);
      if (Math.abs((this.x - this.bx)) < 8) {
        let [this.x, this.y] = [this.bx, this.by];
        if (this.n < (this.ph === 1 ? 1 : 2)) {
          this.st = "dive_w";
          this.tm = 36;
        } else {
          this.st = "idle";
          this.tm = (this.ph === 1 ? 60 : 40);
        }
      }
    }
  }
  draw(g, ox) {
    let p = g.p;
    let x = (this.x + ox);
    let y = this.y;
    let fl = this.flash > 0;
    function C(c) {
      return (fl ? "#ffffff" : c);
    }
    g.ov(x, (GROUND + 5), Math.max(20, (70 - ((GROUND - y) * 0.12))), 7, mix(g.gcol, INK, 0.5), 0, "");
    if ((this.st === "dive_w") && ((Math.floor(this.t / 4) % 2) === 0)) {
      g.c.create_line(0, this.ty, W, this.ty);
      g.tx((W - 40), (this.ty - 18), "!", 30, RED);
    }
    let wing = ((Math.abs(Math.sin((this.t * 0.8))) * 14) + 12);
    g.ov((x + 5), (y - 64), 38, wing, C("#e6f6ff"), 3);
    g.ov((x + 45), (y - 58), 28, (wing * 0.8), C("#e6f6ff"), 3);
    g.ov(x, y, 66, 52, C(GOLD));
    for (let dx of [(-8), 16, 40]) {
      let k = Math.sqrt(Math.max(0.05, (1 - ((dx / 66.0) ** 2))));
      g.ov((x + dx), y, 7, (50 * k), INK, 0, "");
    }
    g.ov((x - 58), (y - 6), 36, 34, C(GOLD));
    let [ex, ey] = [(x - 66), (y - 14)];
    g.ov(ex, ey, 11, 13, WHITE, 2);
    let dx = (p.x - ex);
    let dy = ((p.y - 30) - ey);
    let dd = (Math.hypot(dx, dy)) || (1);
    g.ov((ex + ((dx / dd) * 4)), (ey + ((dy / dd) * 4)), 4, 6, INK, 0, "");
    g.ln([[(ex - 14), (ey - 18)], [(ex + 10), (ey - 8)]], 4, INK);
    g.ln([[(x - 80), (y + 12)], [(x - 66), (y + 20)], [(x - 52), (y + 12)]], 4, INK, true);
    g.ln([[(x - 70), (y - 36)], [(x - 84), (y - 66)]], 4, INK);
    g.ov((x - 86), (y - 68), 5, 5, INK, 0, "");
    g.pl([[(x - 76), (y - 36)], [(x - 76), (y - 52)], [(x - 66), (y - 44)], [(x - 58), (y - 56)], [(x - 50), (y - 44)], [(x - 42), (y - 52)], [(x - 42), (y - 36)]], C(GOLD), 3);
    g.pl([[(x + 62), (y - 9)], [(x + 104), y], [(x + 62), (y + 9)]], C("#2b2b33"), 3);
  }
}
class RGEnemy {
  "Koş & ateş bölümlerindeki düşmanlar.";
  constructor(kind, x, y, x1, x2, hp, col) {
    this.kind = kind;
    this.x = Number(x);
    this.y = Number(y);
    this.y0 = Number(y);
    this.x1 = (x1 !== null ? x1 : (x - 100));
    this.x2 = (x2 !== null ? x2 : (x + 100));
    this.hp = hp;
    this.t = Math.floor(0 + Math.random() * (60 - 0 + 1));
    this.vx = (kind === "walker" ? (-1.4) : 0.0);
    this.vy = 0.0;
    this.face = (-1);
    this.dead = false;
    this.flash = 0;
    this.cd = Math.floor(30 + Math.random() * (90 - 30 + 1));
    this.col = col;
  }
  box() {
    if (this.kind === "bat") {
      return [(this.x - 20), (this.y - 16), (this.x + 20), (this.y + 16)];
    }
    if (this.kind === "turret") {
      return [(this.x - 26), (this.y - 44), (this.x + 26), this.y];
    }
    return [(this.x - 18), (this.y - 42), (this.x + 18), this.y];
  }
  update(G) {
    this.t += 1;
    if (this.flash > 0) {
      this.flash -= 1;
    }
    let p = G.p;
    let k = this.kind;
    if (k === "walker") {
      this.x += this.vx;
      if (this.x < this.x1) {
        this.x = this.x1;
        this.vx = Math.abs(this.vx);
      } else if (this.x > this.x2) {
        this.x = this.x2;
        this.vx = (-Math.abs(this.vx));
      }
      this.face = (this.vx > 0 ? 1 : (-1));
    } else if (k === "hopper") {
      if ((this.y < (this.y0 - 0.5)) || (this.vy < 0)) {
        this.vy += 0.8;
        this.y += this.vy;
        this.x = clamp((this.x + this.vx), this.x1, this.x2);
        if ((this.y >= this.y0) && (this.vy > 0)) {
          this.y = this.y0;
          this.vy = 0;
          this.vx = 0;
          this.cd = (55 + Math.floor(0 + Math.random() * (40 - 0 + 1)));
        }
      } else {
        this.cd -= 1;
        this.face = (p.x > this.x ? 1 : (-1));
        if ((this.cd <= 0) && (Math.abs((p.x - this.x)) < 480)) {
          this.vy = (-13.5);
          this.vx = (this.face * 3.2);
          this.y -= 1;
        }
      }
    } else if (k === "bat") {
      this.x -= 2.6;
      this.y = (this.y0 + (Math.sin((this.t * 0.08)) * 45));
      if (this.x < (G.camx - 160)) {
        this.dead = true;
      }
    } else if (k === "turret") {
      this.cd -= 1;
      if ((this.cd <= 0) && ((G.camx + 30) <= this.x && this.x <= ((G.camx + W) - 30))) {
        this.cd = Math.floor((110 / G.dif["bt"]));
        let [mx, my] = [this.x, (this.y - 30)];
        let a = Math.atan2(((p.y - 30) - my), (p.x - mx));
        let sp = (4.6 * G.dif["shot"]);
        G.shots.append(Shot("ball", mx, my, (Math.cos(a) * sp), (Math.sin(a) * sp)));
      }
    }
  }
}
function gen_rg(cfg, hpm) {
  "Koş & ateş bölümü dünyasını (tohuma göre, her seferinde aynı) üretir.";
  let rnd = new random.Random(cfg["seed"]);
  let L = cfg["len"];
  let dens = cfg.get("dens", 1.0);
  let [segs, plats, movers, ens, coins, orbs] = [[], [], [], [], [], []];
  let ecol = cfg.get("ecol", "#c0552e");
  let seg0 = [0.0];
  function E(kind, x, y, x1, x2, hp) {
    ens.append(RGEnemy(kind, x, y, x1, x2, Math.max(1, Math.floor(Math.round((hp * hpm)))), ecol));
  }
  function pit(x, gap) {
    segs.append([seg0[0], x]);
    seg0[0] = (x + gap);
  }
  let cx = 760.0;
  let last = "";
  let allt = ["flat", "pit", "stairs", "gauntlet", "mover", "tower", "pit2"];
  while (cx < (L - 1100)) {
    let t = rnd.choice(allt.filter(a => a !== last).map(a => a));
    let last = t;
    if (t === "flat") {
      let w = rnd.uniform(640, 900);
      let n = Math.max(1, Math.floor(Math.round((rnd.randint(2, 4) * dens))));
      for (let i = 0; i < n; i++) {
        let x = ((cx + 80) + (((w - 160) * (i + (rnd.random() * 0.6))) / n));
        let k = rnd.choice(["walker", "walker", "hopper", "turret"]);
        if (k === "walker") {
          E("walker", x, GROUND, (x - 110), (x + 110), 2);
        } else if (k === "hopper") {
          E("hopper", x, GROUND, (x - 140), (x + 140), 3);
        } else {
          E("turret", x, GROUND);
        }
      }
      cx += w;
    } else if (t === "pit") {
      let gap = rnd.uniform(250, 300);
      let gx = (cx + 260);
      E("walker", (cx + 120), GROUND, (cx + 20), (cx + 220), 2);
      pit(gx, gap);
      plats.append([((gx + (gap / 2)) - 45), ((gx + (gap / 2)) + 45), (GROUND - 38)]);
      orbs.append([(gx + (gap * 0.3)), (GROUND - 175)]);
      if ((coins.length < 5) && (rnd.random() < 0.7)) {
        coins.append([(gx + (gap / 2)), (GROUND - 105)]);
      }
      E("bat", ((gx + gap) + 380), (GROUND - 150));
      let cx = ((gx + gap) + 220);
    } else if (t === "stairs") {
      let xs = (cx + 120);
      plats += [[xs, (xs + 130), (GROUND - 100)], [(xs + 230), (xs + 360), (GROUND - 180)], [(xs + 470), (xs + 600), (GROUND - 100)]];
      E("walker", (xs + 65), (GROUND - 100), (xs + 15), (xs + 115), 2);
      E("walker", (xs + 295), (GROUND - 180), (xs + 245), (xs + 345), 2);
      if (coins.length < 5) {
        coins.append([(xs + 295), (GROUND - 245)]);
      }
      E("hopper", (xs + 360), GROUND, (xs + 200), (xs + 520), 3);
      E("bat", (cx + 680), (GROUND - 200));
      cx += 800;
    } else if (t === "gauntlet") {
      for (let i = 0; i < (Math.floor((3 * dens)) + 1); i++) {
        E("bat", ((cx + 300) + (i * 170)), (GROUND - rnd.choice([70, 110, 150])));
      }
      E("turret", (cx + 620), GROUND);
      E("hopper", (cx + 240), GROUND, (cx + 100), (cx + 380), 3);
      cx += 800;
    } else if (t === "mover") {
      let gap = 400.0;
      let gx = (cx + 220);
      pit(gx, gap);
      movers.append(({ bx: (gx + (gap / 2)), y: (GROUND - 28), w: 110, amp: 115, spd: 0.032, ph: rnd.uniform(0, 6), x1: 0.0, dx: 0.0 }));
      orbs.append([(gx + (gap / 2)), (GROUND - 190)]);
      if (coins.length < 5) {
        coins.append([((gx + (gap / 2)) + 80), (GROUND - 120)]);
      }
      E("bat", ((gx + gap) + 300), (GROUND - 120));
      let cx = ((gx + gap) + 240);
    } else if (t === "tower") {
      let xs = (cx + 160);
      plats += [[xs, (xs + 110), (GROUND - 100)], [(xs + 170), (xs + 280), (GROUND - 195)], [(xs + 30), (xs + 140), (GROUND - 290)]];
      E("walker", (xs + 55), (GROUND - 100), (xs + 10), (xs + 100), 2);
      if (coins.length < 5) {
        coins.append([(xs + 85), (GROUND - 335)]);
      }
      E("bat", (cx + 560), (GROUND - 160));
      E("turret", (cx + 440), GROUND);
      cx += 700;
    } else if (t === "pit2") {
      let x0 = (cx + 200);
      let gap = 230.0;
      pit(x0, gap);
      plats.append([((x0 + (gap / 2)) - 40), ((x0 + (gap / 2)) + 40), (GROUND - 30)]);
      let isl0 = (x0 + gap);
      E("hopper", (isl0 + 110), GROUND, (isl0 + 30), (isl0 + 190), 3);
      let x1 = (isl0 + 220);
      pit(x1, gap);
      plats.append([((x1 + (gap / 2)) - 40), ((x1 + (gap / 2)) + 40), (GROUND - 50)]);
      orbs.append([(x1 + (gap / 2)), (GROUND - 190)]);
      if (coins.length < 5) {
        coins.append([(x1 + (gap / 2)), (GROUND - 115)]);
      }
      let cx = ((x1 + gap) + 200);
    }
  }
  E("walker", (L - 760), GROUND, (L - 860), (L - 660), 2);
  E("hopper", (L - 520), GROUND, (L - 640), (L - 400), 3);
  E("turret", (L - 360), GROUND);
  segs.append([seg0[0], Number(L)]);
  let xs_ = [];
  for (let [a, b] of segs) {
    if ((b - a) > 400) {
      xs_.append([a, b]);
    }
  }
  while (coins.length < 5) {
    let [a, b] = rnd.choice(xs_);
    coins.append([rnd.uniform((a + 150), (b - 150)), (GROUND - 75)]);
  }
  let coins = coins.slice(0, 5);
  return ({ segs: segs, plats: plats, movers: movers, ens: ens, coins: coins, orbs: orbs, goal: (L - 200.0), len: Number(L) });
}
function _rg(name, sub, theme, sky, ray, ground, far, near, pit, ecol, length, seed, par, stars, dens) {
  return ({ name: name, sub: sub, kind: "rg", theme: theme, sky: sky, ray: ray, ground: ground, far: far, near: near, pit: pit, ecol: ecol, len: length, seed: seed, par: par, stars: stars, dens: dens, plats: [] });
}
let LEVELS = [({ name: "KURBAĞA KRAL", sub: "Bataklıkta Kavga", cls: Frog, theme: "swamp", sky: ["#fbe08a", "#f08f45"], ray: "#fff0b0", ground: "#6f9a3a", plats: [], par: 75, stars: 1 }), _rg("BATAKLIK KOŞUSU", "Koş, zıpla, ateş et!", "swamp", ["#fbe08a", "#f08f45"], "#fff0b0", "#6f9a3a", "#8dbb50", "#4e8a35", "#3c6a8a", "#c0552e", 6000, 11, 80, 1, 0.9), _rg("SONBAHAR ORMANI", "Düşen yapraklar, dikenli dostlar", "forest", ["#f7c97a", "#d9733a"], "#ffe2a8", "#8a5a2a", "#c9843a", "#7a3a1f", "#5a3a22", "#a33a2a", 6800, 23, 90, 1, 1.0), ({ name: "SİHİRBAZ TAVŞAN", sub: "Şapkadan Çıkan Bela", cls: Mage, theme: "stage", sky: ["#4b2a7a", "#c25a8a"], ray: "#7a4aa8", ground: "#8a4a2a", plats: [[120, 300, 350], [660, 840, 350]], par: 95, stars: 2 }), _rg("SİRK ÇATILARI", "Gösteri başlıyor", "circus", ["#6a3a9a", "#f08a9a"], "#a06ac8", "#b0392e", "#8a4aa8", "#e8c050", "#2a1a3a", "#e8c050", 7200, 37, 100, 2, 1.1), _rg("KARLI ZİRVE", "Buz gibi bir macera", "snow", ["#bfe6ff", "#f2fbff"], "#ffffff", "#dfeefa", "#a8cce6", "#2f6f58", "#6ab4e6", "#4a6ab8", 7400, 41, 105, 2, 1.1), ({ name: "KAR ADAM KRAL", sub: "Soğuk Karşılama", cls: Snowman, theme: "snow", sky: ["#a8d8f2", "#f4fbff"], ray: "#ffffff", ground: "#e8f2fa", plats: [[380, 560, 340]], par: 100, stars: 2 }), _rg("YANARDAĞ YOLU", "Zemin kızgın, kan kaynıyor", "lava", ["#4a1a1a", "#e0602a"], "#8a2a1a", "#4a3a3a", "#7a2a22", "#a8402a", "#ff7a2a", "#6a5a5a", 7600, 53, 110, 3, 1.2), _rg("DİŞLİ FABRİKASI", "Çarklar durmuyor", "tower", ["#17424a", "#3e8a7a"], "#2c6a68", "#5a4a3a", "#2b6a66", "#3c8a82", "#102a30", "#d8a02a", 8000, 67, 120, 3, 1.2), ({ name: "KRAL ARI", sub: "Bal Kokusu", cls: Bee, theme: "meadow", sky: ["#8fd8ff", "#fff3b0"], ray: "#ffffff", ground: "#79b844", plats: [[120, 300, 350], [660, 840, 350]], par: 105, stars: 3 }), _rg("BULUT PATİKASI", "Yer yok, sadece bulut", "sky", ["#7ad0ff", "#e8f8ff"], "#ffffff", "#f4f8ff", "#b8e0f8", "#98c8ec", "#4aa0e0", "#e8708a", 8400, 79, 125, 3, 1.2), ({ name: "ZAMAN EFENDİSİ", sub: "Vakit Daralıyor", cls: Clock, theme: "tower", sky: ["#17424a", "#3e8a7a"], ray: "#2c6a68", ground: "#5a4a3a", plats: [[90, 250, 360], [400, 560, 305]], par: 120, stars: 3 })];
let MENU_CFG = ({ theme: "menu", sky: ["#f7d77a", "#ee9446"], ray: "#ffe9a0", ground: "#7b4d2b", plats: [] });
let GRADE_RANK = ({ [""]: 0, ["D"]: 1, ["C"]: 2, ["B"]: 3, ["A"]: 4, ["S"]: 5 });
let HOWTO = ["Boss savaşları + KOŞ & ATEŞ bölümleri: sona ulaş, altınları topla!", "", "Varsayılan tuşlar (AYARLAR > KONTROLLER'den değiştirilebilir):", "A/D veya ← →  ...  koş          Space / Z  ...  zıpla (basılı = yüksek)", "X / J  ...  ateş (basılı tut),  ↑ / W ile yukarı nişan", "Shift / C  ...  atılma: atılırken hiçbir şey sana zarar veremez", "Q / E  ...  EX atışı (1 kart harcar, çok güçlü)", "FARE MODU: imleç yönüne nişan al, sol tık ateş, sağ tık EX", "", "PARRY: Havadayken PEMBE bir nesneye / pembe küreye tekrar zıpla!", "Her parry sana 1 EX kartı kazandırır. Çukura düşersen 1 can kaybedersin.", "Zorluk: ayarlardan hepsi, bölüm seçimden ↑↓ ile tek tek değişir.", "Hızlı bitir, az hasar al, çok parry yap = daha yüksek not.   F11: tam ekran"];
class Game {
  constructor(root) {
    this.root = root;
    root.title("ÇAYCIK: Boss Savaşı");
    root.resizable(false, false);
    root.configure();
    this.save = this.load();
    this.settings = this.save["settings"];
    this.binds = this.settings["binds"];
    this.cv = tk.Canvas(root);
    this.cv.pack();
    this.c = Cv(this.cv);
    this.keys = new Set();
    this.pressed = new Set();
    this.rel = ({  });
    this.mx = this.my = 0.0;
    this.mb = new Set();
    this.mpress = new Set();
    this.cap = null;
    this.msg = "";
    this.msgt = 0;
    this.stab = 0;
    this.sidx = 0;
    this.sslot = 0;
    this.set_back = "menu";
    this.cur = "";
    root.bind("<KeyPress>", this.kd);
    root.bind("<KeyRelease>", this.ku);
    root.bind("<FocusOut>", (e) => [this.keys.clear(), this.mb.clear()]);
    this.cv.bind("<Motion>", this.on_motion);
    for (let nb of [1, 2, 3]) {
      let bb = (nb === 1 ? 1 : 3);
      this.cv.bind(("<ButtonPress-%d>" % nb), (e, bb) => this.on_mouse(e, bb, true));
      this.cv.bind(("<ButtonRelease-%d>" % nb), (e, bb) => this.on_mouse(e, bb, false));
    }
    this.sfx = Sfx();
    this.sfx.on = bool(this.settings["sound"]);
    this.state = "menu";
    this.sel = 0;
    this.lsel = 0;
    this.psel = 0;
    this.dsel = 0;
    this.t = 0;
    this.iris = null;
    this.iris_c = [(W / 2), (H / 2)];
    this.p = Player();
    this.boss = null;
    let [this.shots, this.bul, this.parts, this.pops] = [[], [], [], []];
    this.plats = [];
    this.cfg = MENU_CFG;
    this.gcol = MENU_CFG["ground"];
    this.bgkey = null;
    this.bgoff = [0, 0];
    this.intro = 0;
    this.ko = 0;
    this.ft = 0;
    this.shake = 0;
    this.hitstop = 0;
    this.dying = 0;
    this.lv = 0;
    this.rt = 0;
    this.res = ({  });
    this.quit = false;
    this.mode = "boss";
    this.camx = 0.0;
    this.fin = 0;
    this.rg = null;
    this.coin_list = [];
    this.orbs = [];
    this.got = 0;
    this.ncoin = 0;
    this.safe = [110.0, Number(GROUND)];
    this.bacc = 0.0;
    this.dif = DIFF[1];
    this.acc = 0.0;
    this.last = time.perf_counter();
    this.apply_display();
    this.loop();
  }
  kd(e) {
    let k = e.keysym.lower();
    let k = NORM.get(k, k);
    if (py_in(k, this.rel)) {
      try {
        this.root.after_cancel(this.rel.pop(k));
      } catch (e) {
        this.rel.pop(k, null);
      }
    }
    if (k === "f11") {
      if (!py_in(k, this.keys)) {
        this.keys.add(k);
        this.toggle_fullscreen();
      }
      return;
    }
    if ((this.state === "settings") && (this.cap !== null)) {
      this.capture(k);
      return;
    }
    if (!py_in(k, this.keys)) {
      this.keys.add(k);
      this.pressed.add(k);
    }
  }
  ku(e) {
    let k = e.keysym.lower();
    let k = NORM.get(k, k);
    if (py_in(k, this.rel)) {
      return;
    }
    this.rel[k] = this.root.after(25, (k) => this.drop(k));
  }
  drop(k) {
    this.keys.discard(k);
    this.rel.pop(k, null);
  }
  held() {
    return any(n.map(k => py_in(k, this.keys)));
  }
  mouse_mode() {
    return this.settings["aim"] === "mouse";
  }
  act(name) {
    return any(this.binds[name].map(k => (k) && (py_in(k, this.keys))));
  }
  actp(name) {
    return any(this.binds[name].map(k => (k) && (py_in(k, this.pressed))));
  }
  shooting() {
    return (this.act("shoot")) || ((this.mouse_mode) && (py_in(1, this.mb)));
  }
  ex_pressed() {
    return (this.actp("ex")) || ((this.mouse_mode) && (py_in(3, this.mpress)));
  }
  on_motion(e) {
    this.mx = (e.x / this.c.S);
    this.my = (e.y / this.c.S);
  }
  on_mouse(e, b, down) {
    this.on_motion(e);
    if (down) {
      this.mb.add(b);
      this.mpress.add(b);
    } else {
      this.mb.discard(b);
    }
  }
  flash(text) {
    this.msg = text;
    this.msgt = 150;
  }
  persist() {
    this.save["settings"] = this.settings;
    this.store();
  }
  hint() {
    function b(n) {
      return keyname((this.binds[n][0]) || (this.binds[n][1]));
    }
    let shoot = (this.mouse_mode ? "SOL TIK" : b("shoot"));
    let ex = (this.mouse_mode ? "SAĞ TIK" : b("ex"));
    return ("Koş: %s/%s   Zıpla: %s   Ateş: %s   Atıl: %s   EX: %s" % [b("left"), b("right"), b("jump"), shoot, b("dash"), ex]);
  }
  capture(k) {
    let [name, slot] = this.cap;
    this.cap = null;
    let b = this.binds;
    if (k === "escape") {
      return;
    }
    if (py_in(k, ["delete", "backspace"])) {
      if (b[name][(1 - slot)]) {
        b[name][slot] = "";
        this.persist();
      } else {
        this.flash("Her eylemde en az bir tuş kalmalı");
      }
      return;
    }
    if (py_in(k, ["p", "return", "f11"])) {
      this.flash("Bu tuş sistem için ayrılmış");
      return;
    }
    let old = b[name][slot];
    if (old === k) {
      return;
    }
    for (let [a, lst] of b.items()) {
      for (let i = 0; i < lst.length; i++) {
        let kk = lst[i];
        if ((kk === k) && ((!(a === name) && (i === slot)))) {
          if ((old === "") && ((!any(range(2).filter(j => j !== i).map(j => lst[j]))))) {
            this.flash("Bu tuş başka bir eylemin tek tuşu");
            return;
          }
          lst[i] = old;
        }
      }
    }
    b[name][slot] = k;
    this.sfx.play("ok");
    this.persist();
  }
  toggle_fullscreen() {
    this.settings["fullscreen"] = (!this.settings["fullscreen"]);
    this.apply_display();
    this.persist();
  }
  apply_display() {
    let st = this.settings;
    let r = this.root;
    try {
      r.attributes("-fullscreen", bool(st["fullscreen"]));
    } catch (e) {
      /* pass */;
    }
    try {
      r.update_idletasks();
    } catch (e) {
      /* pass */;
    }
    try {
      let [sw, sh] = [Math.floor(r.winfo_screenwidth()), Math.floor(r.winfo_screenheight())];
    } catch (e) {
      let [sw, sh] = [1920, 1080];
    }
    if (st["fullscreen"]) {
      let S = Math.min((sw / Number(W)), (sh / Number(H)));
    } else {
      let S = (RES[clamp(st["res"], 0, (RES.length - 1))][0] / Number(W));
      let S = Math.min(S, ((sw - 40) / Number(W)), ((sh - 120) / Number(H)));
    }
    let S = Math.max(0.5, S);
    this.c.S = S;
    this.cv.config();
    if ((!st["fullscreen"])) {
      try {
        r.geometry("");
      } catch (e) {
        /* pass */;
      }
    }
    this.bgkey = null;
    this.bgoff = [0, 0];
  }
  hit() {
    return any(n.map(k => py_in(k, this.pressed)));
  }
  load() {
    let d = ({  });
    try {
    } catch (e) {
      let d = ({  });
    }
    d.setdefault("unlocked", 1);
    d.setdefault("grades", ({  }));
    d.setdefault("times", ({  }));
    if (d.get("ver") !== 2) {
      d["unlocked"] = 1;
      d["grades"] = ({  });
      d["times"] = ({  });
      d["coins"] = ({  });
      d["ver"] = 2;
    }
    d.setdefault("coins", ({  }));
    if ((!isinstance(d.get("settings"), dict))) {
      d["settings"] = ({  });
    }
    let st = d["settings"];
    for (let [k, v] of DEFAULT_SETTINGS.items()) {
      if (!py_in(k, st)) {
        st[k] = (isinstance(v, list) ? Array.from(v) : v);
      }
    }
    if ((!isinstance(st["diff"], list))) {
      st["diff"] = [];
    }
    st["diff"] = (Array.from(st["diff"]) + ([1] * LEVELS.length)).slice(0, LEVELS.length);
    st["diff"] = st["diff"].map(x => (isinstance(x, int) ? clamp(Math.floor(x), 0, 2) : 1));
    if ((!isinstance(st.get("binds"), dict))) {
      st["binds"] = ({  });
    }
    for (let [a, v] of DEFAULT_BINDS.items()) {
      let b = st["binds"].get(a);
      if ((!(isinstance(b, list)) && (b.length === 2))) {
        st["binds"][a] = Array.from(v);
      }
    }
    return d;
  }
  store() {
    try {
    } catch (e) {
      /* pass */;
    }
  }
  go(cb, center) {
    if (this.iris === null) {
      this.iris = [0, 0, cb];
      this.iris_c = (center) || ([(W / 2), (H / 2)]);
    }
  }
  set_state(st) {
    this.state = st;
    this.sel = (st === "menu" ? 0 : this.sel);
    this.rt = 0;
  }
  xrange() {
    if ((this.mode === "rg") && (this.rg)) {
      return [(this.camx + 20), (this.rg["len"] - 20)];
    }
    return [20, (W - 20)];
  }
  ground_at(x) {
    if ((this.mode !== "rg") || ((!this.rg))) {
      return true;
    }
    for (let [a, b] of this.rg["segs"]) {
      if ((a - 6) <= x && x <= (b + 6)) {
        return true;
      }
    }
    return false;
  }
  solid(p) {
    if ((Math.abs((p.y - GROUND)) < 1.5) && (this.ground_at((p.x - 30))) && (this.ground_at((p.x + 30)))) {
      return true;
    }
    for (let [x1, x2, top] of this.rg["plats"]) {
      if ((Math.abs((p.y - top)) < 1.5) && ((x1 + 25) <= p.x && p.x <= (x2 - 25))) {
        return true;
      }
    }
    return false;
  }
  setup_rg() {
    let w = gen_rg(this.cfg, this.dif["bhp"]);
    this.rg = w;
    this.plats = Array.from(w["plats"]);
    this.coin_list = w["coins"].map([x, y] => [x, y, false]);
    this.orbs = w["orbs"].map([x, y] => [x, y, false]);
    this.ncoin = this.coin_list.length;
    this.got = 0;
    this.p.x = 110.0;
    this.safe = [110.0, Number(GROUND)];
  }
  start_level(i) {
    this.lv = i;
    this.cfg = LEVELS[i];
    this.mode = this.cfg.get("kind", "boss");
    this.p = Player();
    this.dif = DIFF[clamp(this.settings["diff"][i], 0, 2)];
    this.p.hp = this.p.maxhp = this.dif["hp"];
    this.bacc = 0.0;
    let [this.shots, this.bul, this.parts, this.pops] = [[], [], [], []];
    this.plats = this.cfg["plats"];
    this.camx = 0.0;
    this.fin = 0;
    this.orbs = [];
    this.coin_list = [];
    this.got = this.ncoin = 0;
    if (this.mode === "rg") {
      this.boss = null;
      this.setup_rg();
    } else {
      this.boss = this.cfg["cls"](this);
      this.boss.maxhp = Math.floor((this.boss.maxhp * this.dif["bhp"]));
      this.boss.hp = this.boss.maxhp;
    }
    this.intro = 130;
    this.ft = 0;
    this.ko = 0;
    this.shake = 0;
    this.hitstop = 0;
    this.dying = 0;
    this.build_bg(["lv", i], this.cfg);
    this.state = "fight";
    this.sfx.play("go");
  }
  to_menu() {
    this.mode = "boss";
    this.camx = 0.0;
    this.state = "menu";
    this.sel = 0;
    this.p = Player();
    this.plats = [];
    let [this.shots, this.bul, this.parts, this.pops] = [[], [], [], []];
  }
  dust(x, y, n) {
    for (let _ = 0; _ < n; _++) {
      this.parts.append([(x + ((-8) + Math.random() * (8 - (-8)))), (y - 2), ((-1.5) + Math.random() * (1.5 - (-1.5))), ((-1.2) + Math.random() * ((-0.2) - (-1.2))), 18, 18, "#efe3c4", (4 + Math.random() * (7 - 4)), 2]);
    }
  }
  burst(x, y, col, n, sp) {
    for (let _ = 0; _ < n; _++) {
      let a = (0 + Math.random() * ((Math.PI * 2) - 0));
      let v = (1 + Math.random() * (sp - 1));
      this.parts.append([x, y, (Math.cos(a) * v), ((Math.sin(a) * v) - 1), Math.floor(16 + Math.random() * (32 - 16 + 1)), 32, col, (3 + Math.random() * (6 - 3)), py_choice([0, 0, 1])]);
    }
  }
  pop(x, y, text, col) {
    this.pops.append([x, y, text, 45, col]);
  }
  bomb_boom(sh) {
    this.burst(sh.x, (GROUND - 10), "#ffb347", 18, 6);
    this.shake = 6;
    for (let d of [(-1), 1]) {
      this.shots.append(Shot("wave", (sh.x + (d * 20)), (GROUND - 2), (d * 5.5), 0));
    }
  }
  try_parry() {
    let p = this.p;
    for (let o of this.orbs) {
      if (((!o[2])) && (Math.hypot((o[0] - p.x), (o[1] - (p.y - 30))) < 46)) {
        o[2] = true;
        p.card = Math.min(5.0, (p.card + 1));
        p.parries += 1;
        p.vy = (-13.0);
        p.jh = false;
        this.hitstop = 5;
        this.burst(o[0], o[1], PINK, 18, 6);
        this.pop(p.x, (p.y - 70), "PARRY!", PINK);
        this.sfx.play("parry");
        return;
      }
    }
    for (let sh of this.shots) {
      if ((sh.pink) && ((!sh.dead)) && (Math.hypot((sh.x - p.x), (sh.y - (p.y - 30))) < (sh.r + 38))) {
        sh.dead = true;
        p.card = Math.min(5.0, (p.card + 1));
        p.parries += 1;
        p.vy = (-13.0);
        p.jh = false;
        this.hitstop = 5;
        this.burst(sh.x, sh.y, PINK, 18, 6);
        this.pop(p.x, (p.y - 70), "PARRY!", PINK);
        this.sfx.play("parry");
        return;
      }
    }
  }
  hurt_player() {
    let p = this.p;
    if ((p.inv > 0) || (p.dash > 0) || (p.hp <= 0) || (this.ko > 0) || (this.fin > 0) || (this.intro > 30)) {
      return false;
    }
    p.hp -= 1;
    p.inv = 110;
    p.hurt = 26;
    p.vy = (-9.0);
    p.vx = ((-p.face) * 4.0);
    p.on = false;
    this.shake = 14;
    this.hitstop = 6;
    this.burst(p.x, (p.y - 30), "#ffffff", 16, 6);
    this.sfx.play("hurt");
    if (p.hp <= 0) {
      this.dying = 1;
      this.pop(p.x, (p.y - 80), "ÖLDÜN!", RED);
    }
    return true;
  }
  update() {
    this.t += 1;
    if (this.msgt > 0) {
      this.msgt -= 1;
    }
    if (this.iris) {
      let it = this.iris;
      it[1] += 1;
      if ((it[0] === 0) && (it[1] >= 22)) {
        it[2]();
        it[0] = 1;
        it[1] = 0;
      } else if ((it[0] === 1) && (it[1] >= 22)) {
        this.iris = null;
      }
      this.pressed.clear();
      this.mpress.clear();
      return;
    }
    let st = this.state;
    if (st === "menu") {
      this.upd_menu();
    } else if (st === "select") {
      this.upd_select();
    } else if (st === "howto") {
      if (this.hit()) {
        this.sfx.play("blip");
        this.go(() => this.set_state("menu"));
      }
    } else if (st === "settings") {
      this.upd_settings();
    } else if (st === "fight") {
      this.upd_fight();
    } else if (st === "pause") {
      this.upd_pause();
    } else if (st === "result") {
      this.rt += 1;
      if ((this.rt > 100) && (this.hit("return", "space", "z"))) {
        this.sfx.play("ok");
        this.go(this.after_result);
      }
    } else if (st === "dead") {
      this.rt += 1;
      if (this.hit("up", "w", "down", "s")) {
        this.dsel = (1 - this.dsel);
        this.sfx.play("blip");
      }
      if ((this.rt > 20) && (this.hit())) {
        this.sfx.play("ok");
        if (this.dsel === 0) {
          this.go(() => this.start_level(this.lv));
        } else {
          this.go(this.to_menu);
        }
      }
    } else if (st === "ending") {
      this.rt += 1;
      if ((this.rt % 4) === 0) {
        this.parts.append([(0 + Math.random() * (W - 0)), (-10), ((-1) + Math.random() * (1 - (-1))), (1 + Math.random() * (3 - 1)), 200, 200, py_choice([GOLD, PINK, "#7ad0ff", RED, "#9be36b"]), (4 + Math.random() * (8 - 4)), 3]);
      }
      this.upd_parts();
      if ((this.rt > 90) && (this.hit())) {
        this.go(this.to_menu);
      }
    }
    this.pressed.clear();
    this.mpress.clear();
  }
  upd_menu() {
    let n = 5;
    if (this.hit()) {
      this.sel = ((this.sel - 1) % n);
      this.sfx.play("blip");
    }
    if (this.hit()) {
      this.sel = ((this.sel + 1) % n);
      this.sfx.play("blip");
    }
    if (this.hit()) {
      this.sfx.play("ok");
      if (this.sel === 0) {
        let i = (Math.min(this.save["unlocked"], LEVELS.length) - 1);
        this.go(() => this.start_level(i));
      } else if (this.sel === 1) {
        this.go(() => this.set_state("select"));
      } else if (this.sel === 2) {
        this.go(() => this.open_settings("menu"));
      } else if (this.sel === 3) {
        this.go(() => this.set_state("howto"));
      } else {
        this.quit = true;
        this.root.destroy();
      }
    }
  }
  upd_select() {
    let n = LEVELS.length;
    if (this.hit()) {
      this.lsel = ((this.lsel - 1) % n);
      this.sfx.play("blip");
    }
    if (this.hit()) {
      this.lsel = ((this.lsel + 1) % n);
      this.sfx.play("blip");
    }
    if ((this.hit()) || (this.hit())) {
      let dd = this.settings["diff"];
      dd[this.lsel] = ((dd[this.lsel] + (this.hit() ? 1 : (-1))) % 3);
      this.persist();
      this.sfx.play("blip");
    }
    if (this.hit()) {
      this.go(() => this.set_state("menu"));
    } else if (this.hit()) {
      if (this.lsel < this.save["unlocked"]) {
        this.sfx.play("ok");
        let i = this.lsel;
        this.go(() => this.start_level(i));
      } else {
        this.sfx.play("hurt");
      }
    }
  }
  open_settings(back) {
    this.set_back = back;
    this.state = "settings";
    this.stab = 0;
    this.sidx = 0;
    this.sslot = 0;
    this.cap = null;
  }
  leave_settings() {
    this.sfx.play("blip");
    if (this.set_back === "pause") {
      this.state = "pause";
    } else {
      this.go(() => this.set_state("menu"));
    }
  }
  set_items() {
    if (this.stab === 0) {
      return [["fullscreen", "Tam ekran (F11)"], ["res", "Çözünürlük"], ["grain", "Film greni efekti"], ["shake", "Ekran sarsıntısı"]];
    }
    if (this.stab === 1) {
      return (([["aim", "Nişan / ateş modu"]] + Array.from(ACTIONS)) + [["reset", "Varsayılan tuşlara dön"]]);
    }
    return [["diff", "Zorluk (tüm bölümler)"], ["sound", "Ses efektleri"]];
  }
  setting_val(name) {
    let st = this.settings;
    let onoff = (v) => (v ? "AÇIK" : "KAPALI");
    if (name === "fullscreen") {
      return onoff(st["fullscreen"]);
    }
    if (name === "res") {
      if (st["fullscreen"]) {
        return "OTOMATİK";
      }
      let r = RES[clamp(st["res"], 0, (RES.length - 1))];
      return ("%d x %d" % r);
    }
    if (py_in(name, ["grain", "shake", "sound"])) {
      return onoff(st[name]);
    }
    if (name === "aim") {
      return (st["aim"] === "mouse" ? "FARE (imleç)" : "KLAVYE");
    }
    if (name === "diff") {
      let d = st["diff"];
      return (all(d.map(x => x === d[0])) ? DIFF[d[0]]["name"] : "ÖZEL (bölüme göre)");
    }
    if (name === "reset") {
      return "Enter ile sıfırla";
    }
    return "";
  }
  setting_act(name, d, enter) {
    let st = this.settings;
    if (name === "fullscreen") {
      st["fullscreen"] = (!st["fullscreen"]);
      this.apply_display();
    } else if (name === "res") {
      if (st["fullscreen"]) {
        this.flash("Tam ekranda çözünürlük otomatik ayarlanır");
        return;
      }
      st["res"] = ((st["res"] + d) % RES.length);
      this.apply_display();
    } else if (py_in(name, ["grain", "shake", "sound"])) {
      st[name] = (!st[name]);
      if (name === "sound") {
        this.sfx.on = bool(st["sound"]);
      }
    } else if (name === "aim") {
      st["aim"] = (st["aim"] === "keyboard" ? "mouse" : "keyboard");
    } else if (name === "diff") {
      let dd = st["diff"];
      let nv = (all(dd.map(x => x === dd[0])) ? ((dd[0] + d) % 3) : 1);
      st["diff"] = ([nv] * LEVELS.length);
    } else if (name === "reset") {
      if ((!enter)) {
        return;
      }
      for (let [a, v] of DEFAULT_BINDS.items()) {
        this.binds[a] = Array.from(v);
      }
      this.flash("Tuşlar varsayılana döndü");
    } else if (py_in(name, KEYACTS)) {
      if (enter) {
        this.cap = [name, this.sslot];
        return;
      }
      this.sslot = (d > 0 ? 1 : 0);
      this.sfx.play("blip");
      return;
    }
    this.sfx.play("blip");
    this.persist();
  }
  upd_settings() {
    if (this.cap !== null) {
      return;
    }
    if (this.hit("escape")) {
      this.leave_settings();
      return;
    }
    if (this.hit("q")) {
      this.stab = ((this.stab - 1) % 3);
      this.sidx = 0;
      this.sfx.play("blip");
    }
    if (this.hit("e", "tab")) {
      this.stab = ((this.stab + 1) % 3);
      this.sidx = 0;
      this.sfx.play("blip");
    }
    let items = this.set_items();
    this.sidx = clamp(this.sidx, 0, (items.length - 1));
    if (this.hit()) {
      this.sidx = ((this.sidx - 1) % items.length);
      this.sfx.play("blip");
    }
    if (this.hit()) {
      this.sidx = ((this.sidx + 1) % items.length);
      this.sfx.play("blip");
    }
    let d = 0;
    if (this.hit()) {
      let d = (-1);
    }
    if (this.hit()) {
      let d = 1;
    }
    let ok = this.hit();
    if ((d) || (ok)) {
      this.setting_act(items[this.sidx][0], (d ? d : 1), bool((ok) && ((!d))));
    }
  }
  upd_pause() {
    if (this.hit("up", "w", "down", "s")) {
      this.psel = ((this.psel + (this.hit("down", "s") ? 1 : (-1))) % 4);
      this.sfx.play("blip");
    }
    if (this.hit("escape", "p")) {
      this.state = "fight";
    } else if (this.hit()) {
      if (this.psel === 0) {
        this.state = "fight";
      } else if (this.psel === 1) {
        this.go(() => this.start_level(this.lv));
      } else if (this.psel === 2) {
        this.open_settings("pause");
      } else {
        this.go(this.to_menu);
      }
    }
  }
  upd_parts() {
    for (let q of this.parts) {
      q[0] += q[2];
      q[1] += q[3];
      if (py_in(q[8], [0, 1, 3])) {
        q[3] += 0.22;
      } else {
        q[2] *= 0.92;
        q[3] *= 0.92;
      }
      q[4] -= 1;
    }
    this.parts = this.parts.filter(q => q[4] > 0).map(q => q);
    for (let q of this.pops) {
      q[1] -= 0.8;
      q[3] -= 1;
    }
    this.pops = this.pops.filter(q => q[3] > 0).map(q => q);
  }
  fall_respawn() {
    let p = this.p;
    p.hp -= 1;
    this.shake = 12;
    this.sfx.play("hurt");
    if (p.hp <= 0) {
      this.dying = 1;
      p.x = clamp(p.x, (this.camx + 40), ((this.camx + W) - 40));
      p.y = (H - 100.0);
      p.vx = p.vy = 0.0;
      this.pop(p.x, (p.y - 80), "ÖLDÜN!", RED);
    } else {
      p.x = Math.max((this.safe[0] - 10), (this.camx + 40));
      p.y = this.safe[1];
      p.vx = p.vy = 0.0;
      p.on = true;
      p.inv = 120;
      this.burst(p.x, (p.y - 30), "#ffffff", 14, 5);
    }
  }
  upd_rg() {
    if (this.hit("escape", "p")) {
      this.state = "pause";
      this.psel = 0;
      return;
    }
    if (this.hitstop > 0) {
      this.hitstop -= 1;
      return;
    }
    if (this.shake > 0) {
      this.shake -= 1;
    }
    let p = this.p;
    let w = this.rg;
    if (this.intro > 0) {
      this.intro -= 1;
    }
    let active = this.intro <= 30;
    this.plats = Array.from(w["plats"]);
    for (let m of w["movers"]) {
      let ox = m["x1"];
      m["x1"] = ((m["bx"] + (Math.sin(((this.t * m["spd"]) + m["ph"])) * m["amp"])) - (m["w"] / 2));
      m["dx"] = (ox ? (m["x1"] - ox) : 0.0);
      this.plats.append([m["x1"], (m["x1"] + m["w"]), m["y"]]);
    }
    p.update(this);
    for (let m of w["movers"]) {
      if ((p.on) && (Math.abs((p.y - m["y"])) < 1.5) && ((m["x1"] - 8) <= p.x && p.x <= ((m["x1"] + m["w"]) + 8))) {
        p.x += m["dx"];
      }
    }
    let tgt = clamp((p.x - 380), 0, (w["len"] - W));
    if (tgt > this.camx) {
      this.camx = tgt;
    }
    if ((p.on) && (p.hp > 0) && (p.dash === 0) && (this.solid(p))) {
      this.safe = [p.x, p.y];
    }
    if ((p.y > (H + 70)) && (p.hp > 0) && (this.fin === 0)) {
      this.fall_respawn();
    }
    let pb = p.box();
    if ((active) && (this.fin === 0)) {
      for (let e of w["ens"]) {
        if ((e.dead) || (e.x < (this.camx - 200)) || (e.x > ((this.camx + W) + 160))) {
          continue;
        }
        e.update(this);
        if (e.dead) {
          continue;
        }
        let b = e.box();
        if ((pb[0] < b[2]) && (pb[2] > b[0]) && (pb[1] < b[3]) && (pb[3] > b[1])) {
          this.hurt_player();
        }
      }
    }
    for (let sh of this.shots) {
      sh.update(this);
      if (((!sh.dead)) && (hits_player(sh, p))) {
        if (this.hurt_player()) {
          sh.dead = true;
        }
      }
    }
    this.shots = this.shots.filter(x => (!x.dead)).map(x => x);
    for (let cn of this.coin_list) {
      if (((!cn[2])) && (p.hp > 0) && (Math.hypot((cn[0] - p.x), (cn[1] - (p.y - 30))) < 34)) {
        cn[2] = true;
        this.got += 1;
        this.burst(cn[0], cn[1], GOLD, 10, 4);
        this.pop(cn[0], (cn[1] - 24), "ALTIN!", GOLD);
        this.sfx.play("parry");
      }
    }
    for (let bl of this.bul) {
      bl.x += bl.vx;
      bl.y += bl.vy;
      bl.age += 1;
      if ((bl.x < (this.camx - 40)) || (bl.x > ((this.camx + W) + 40)) || (bl.y < (-60)) || (bl.y > (H + 60))) {
        bl.dead = true;
        continue;
      }
      if ((!active)) {
        continue;
      }
      for (let e of w["ens"]) {
        if ((e.dead) || (py_in(id(e), bl.hits))) {
          continue;
        }
        let b = e.box();
        if (((b[0] - bl.r) <= bl.x && bl.x <= (b[2] + bl.r)) && ((b[1] - bl.r) <= bl.y && bl.y <= (b[3] + bl.r))) {
          if (bl.ex) {
            bl.hits.add(id(e));
            let dmg = 8;
          } else {
            bl.dead = true;
            let dmg = 1;
            p.card = Math.min(5.0, (p.card + 0.03));
          }
          e.hp -= dmg;
          e.flash = 3;
          this.burst(bl.x, bl.y, "#fff2b0", 3, 3);
          if (e.hp <= 0) {
            e.dead = true;
            this.burst(e.x, (e.y - 20), e.col, 16, 5);
          }
          if ((!bl.ex)) {
            break;
          }
        }
      }
    }
    this.bul = this.bul.filter(x => (!x.dead)).map(x => x);
    this.upd_parts();
    if ((p.hp > 0) && (active) && (this.fin === 0)) {
      this.ft += 1;
    }
    if ((this.fin === 0) && (p.hp > 0) && (p.x >= w["goal"])) {
      this.fin = 1;
      this.shots = [];
      this.shake = 10;
      this.sfx.play("ko");
    }
    if (this.fin > 0) {
      this.fin += 1;
      if (this.fin === 120) {
        this.go(this.show_result, [clamp((p.x - this.camx), 0, W), clamp((p.y - 30), 0, H)]);
      }
    }
    if (this.dying > 0) {
      this.dying += 1;
      if (this.dying === 110) {
        this.go(this.show_dead, [clamp((p.x - this.camx), 0, W), clamp((p.y - 30), 0, H)]);
      }
    }
  }
  upd_fight() {
    if (this.mode === "rg") {
      this.upd_rg();
      return;
    }
    if (this.hit("escape", "p")) {
      this.state = "pause";
      this.psel = 0;
      return;
    }
    if (this.hitstop > 0) {
      this.hitstop -= 1;
      return;
    }
    if ((0 < this.ko && this.ko < 70) && ((this.t % 2) === 0)) {
      return;
    }
    if (this.shake > 0) {
      this.shake -= 1;
    }
    let p = this.p;
    if (this.intro > 0) {
      this.intro -= 1;
    }
    let b = this.boss;
    p.update(this);
    if ((this.intro <= 30) && ((!b.dead))) {
      let n0 = this.shots.length;
      this.bacc += this.dif["bt"];
      while ((this.bacc >= 1) && ((!b.dead))) {
        this.bacc -= 1;
        b.update();
      }
      let sm = this.dif["shot"];
      if (sm !== 1) {
        for (let sh of this.shots.slice(n0)) {
          sh.vx *= sm;
          sh.vy *= sm;
          sh.sp *= sm;
        }
      }
      if (p.hp > 0) {
        this.ft += 1;
      }
    }
    for (let sh of this.shots) {
      sh.update(this);
      if (((!sh.dead)) && (hits_player(sh, p))) {
        if ((this.hurt_player()) && (!py_in(sh.kind, ["wave", "gear", "roll"]))) {
          sh.dead = true;
        }
      }
    }
    this.shots = this.shots.filter(x => (!x.dead)).map(x => x);
    for (let bl of this.bul) {
      bl.x += bl.vx;
      bl.y += bl.vy;
      bl.age += 1;
      if ((bl.x < (-40)) || (bl.x > (W + 40)) || (bl.y < (-40)) || (bl.y > (H + 40))) {
        bl.dead = true;
        continue;
      }
      if ((this.intro > 30) || (b.dead)) {
        continue;
      }
      for (let sh of this.shots) {
        if ((sh.hp > 0) && ((!bl.dead)) && ((!sh.dead)) && (Math.hypot((sh.x - bl.x), (sh.y - bl.y)) < (sh.r + bl.r))) {
          if ((!bl.ex)) {
            bl.dead = true;
          }
          sh.hp -= (bl.ex ? 3 : 1);
          sh.flash = 3;
          this.burst(bl.x, bl.y, "#fff2b0", 3, 3);
          if (sh.hp <= 0) {
            sh.dead = true;
            this.burst(sh.x, sh.y, "#ff9a3c", 14, 5);
          }
        }
      }
      if (bl.dead) {
        continue;
      }
      for (let [x1, y1, x2, y2] of b.boxes()) {
        if (((x1 - bl.r) <= bl.x && bl.x <= (x2 + bl.r)) && ((y1 - bl.r) <= bl.y && bl.y <= (y2 + bl.r))) {
          if (bl.ex) {
            if ((!bl.hit)) {
              bl.hit = true;
              b.hurt(12);
              this.burst(bl.x, bl.y, GOLD, 16, 6);
              this.shake = 5;
            }
          } else {
            bl.dead = true;
            b.hurt(1);
            p.card = Math.min(5.0, (p.card + 0.035));
            this.burst(bl.x, bl.y, "#fff2b0", 3, 3);
          }
          break;
        }
      }
    }
    this.bul = this.bul.filter(x => (!x.dead)).map(x => x);
    for (let pu of this.pops) {
      /* pass */;
    }
    this.upd_parts();
    if ((b.hp <= 0) && (this.ko === 0) && (p.hp > 0)) {
      this.ko = 1;
      b.dead = true;
      this.shots = [];
      this.shake = 16;
      this.sfx.play("ko");
    }
    if (this.ko > 0) {
      this.ko += 1;
      if ((this.ko % 4) === 0) {
        let bx = (b.boxes() ? b.boxes()[0] : [600, 100, 800, 300]);
        this.burst((bx[0] + Math.random() * (bx[2] - bx[0])), (bx[1] + Math.random() * (bx[3] - bx[1])), py_choice([GOLD, RED, "#ffffff"]), 10, 6);
      }
      if (this.ko === 165) {
        this.go(this.show_result, [p.x, (p.y - 30)]);
      }
    }
    if (this.dying > 0) {
      this.dying += 1;
      if (this.dying === 110) {
        this.go(this.show_dead, [p.x, (p.y - 30)]);
      }
    }
  }
  show_result() {
    let p = this.p;
    let t = (this.ft / 60.0);
    let par = LEVELS[this.lv]["par"];
    let score = (((100 - (Math.max(0, (t - par)) * 0.6)) - ((1 - (p.hp / Number(p.maxhp))) * 36)) + (Math.min(p.parries, 6) * 3));
    let score = (score + this.dif.get("bonus", 0));
    if (this.mode === "rg") {
      score += ((this.got * 3) - 10);
    }
    let score = clamp(score, 0, this.dif.get("cap", 100));
    let g = (score >= 92 ? "S" : (score >= 80 ? "A" : (score >= 68 ? "B" : (score >= 52 ? "C" : "D"))));
    this.res = ({ time: t, hp: p.hp, maxhp: p.maxhp, parries: p.parries, grade: g, diff: this.dif["name"], coins: (this.mode === "rg" ? [this.got, this.ncoin] : null) });
    this.save["unlocked"] = Math.max(this.save["unlocked"], Math.min(LEVELS.length, (this.lv + 2)));
    let k = str(this.lv);
    if (GRADE_RANK[g] > GRADE_RANK.get(this.save["grades"].get(k, ""), 0)) {
      this.save["grades"][k] = g;
    }
    let bt = this.save["times"].get(k);
    if ((bt === null) || (t < bt)) {
      this.save["times"][k] = Math.round(t, 1);
    }
    if (this.mode === "rg") {
      let cd = this.save.setdefault("coins", ({  }));
      cd[k] = Math.max(cd.get(k, 0), this.got);
    }
    this.store();
    this.state = "result";
    this.rt = 0;
    this.parts = [];
  }
  show_dead() {
    this.state = "dead";
    this.rt = 0;
    this.dsel = 0;
    this.parts = [];
  }
  after_result() {
    if ((this.lv + 1) < LEVELS.length) {
      this.start_level((this.lv + 1));
    } else {
      this.mode = "boss";
      this.camx = 0.0;
      this.state = "ending";
      this.rt = 0;
      this.parts = [];
    }
  }
  ov(x, y, rx, ry, fill, w, out) {
    if (w === 0) {
      let out = "";
    }
    return this.c.create_oval((x - rx), (y - ry), (x + rx), (y + ry));
  }
  rc(x1, y1, x2, y2, fill, w, out) {
    if (w === 0) {
      let out = "";
    }
    return this.c.create_rectangle(x1, y1, x2, y2);
  }
  pl(pts, fill, w, smooth, out) {
    let flat = pts.map(q => v);
    if (w === 0) {
      let out = "";
    }
    return this.c.create_polygon(flat);
  }
  ln(pts, w, fill, smooth) {
    let flat = pts.map(q => v);
    return this.c.create_line(flat);
  }
  limb(a, b, bend) {
    let mid = [(((a[0] + b[0]) / 2) + bend), ((a[1] + b[1]) / 2)];
    this.ln([a, mid, b], 9, INK, true);
    this.ln([a, mid, b], 5, CREAM, true);
  }
  tx(x, y, t, size, fill, anchor, ow, out) {
    let f = [FONT, size, "bold"];
    if (ow) {
      let offs = [[(-ow), 0], [ow, 0], [0, (-ow)], [0, ow]];
      if (ow >= 3) {
        offs += [[(-ow), (-ow)], [ow, ow], [(-ow), ow], [ow, (-ow)]];
      }
      for (let [dx, dy] of offs) {
        this.c.create_text((x + dx), (y + dy));
      }
    }
    this.c.create_text(x, y);
  }
  panel(x1, y1, x2, y2, fill) {
    this.rc((x1 + 6), (y1 + 7), (x2 + 6), (y2 + 7), INK, 0, "");
    this.rc(x1, y1, x2, y2, fill, 4);
    this.rc((x1 + 8), (y1 + 8), (x2 - 8), (y2 - 8), "", 2);
  }
  floor_y(p) {
    let base = GROUND;
    for (let [x1, x2, y] of this.plats) {
      if (((x1 - 8) <= p.x && p.x <= (x2 + 8)) && (p.y <= (y + 2))) {
        let base = Math.min(base, y);
      }
    }
    return base;
  }
  build_bg(key, cfg) {
    if (this.bgkey === key) {
      return;
    }
    this.bgkey = key;
    this.gcol = cfg["ground"];
    let c = this.c;
    c.delete("bg");
    this.bgoff = [0, 0];
    let [top, bot] = cfg["sky"];
    let bands = 32;
    for (let i = 0; i < bands; i++) {
      c.create_rectangle((-40), ((-40) + ((i * (H + 80)) / bands)), (W + 40), (((-40) + (((i + 1) * (H + 80)) / bands)) + 2));
    }
    if (cfg.get("kind") === "rg") {
      return;
    }
    let th = cfg["theme"];
    if (th === "snow") {
      this.th_snow();
    } else if (th === "meadow") {
      this.th_meadow();
    } else if (th === "swamp") {
      this.th_swamp();
    } else if (th === "stage") {
      this.th_stage();
    } else if (th === "tower") {
      this.th_tower();
    } else {
      this.th_menu();
    }
    let gc = cfg["ground"];
    c.create_rectangle((-40), GROUND, (W + 40), (H + 40));
    for (let i = (-1); i < 14; i++) {
      if ((i % 2) === 0) {
        c.create_polygon((i * 80), GROUND, ((i * 80) + 80), GROUND, ((i * 80) + 110), (H + 40), ((i * 80) - 30), (H + 40));
      }
    }
    c.create_line((-40), GROUND, (W + 40), GROUND);
    c.create_rectangle((-40), (GROUND + 5), (W + 40), (GROUND + 14));
    for (let [x1, x2, y] of cfg["plats"]) {
      c.create_rectangle((x1 + 8), (y + 16), (x2 - 8), (y + 30));
      c.create_rectangle(x1, y, x2, (y + 18));
      c.create_line((x1 + 6), (y + 5), (x2 - 6), (y + 5));
      for (let xx = (Math.floor(x1) + 30); xx < (Math.floor(x2) - 10); xx += 40) {
        c.create_line(xx, (y + 4), xx, (y + 16));
      }
    }
  }
  th_swamp() {
    let c = this.c;
    for (let [cx, r, col] of [[140, 220, "#8dbb50"], [520, 290, "#7aa944"], [900, 240, "#8dbb50"]]) {
      c.create_oval((cx - r), (GROUND - 100), (cx + r), (GROUND + 260));
    }
    for (let [x, h] of [[60, 300], [905, 340], [430, 170]]) {
      c.create_rectangle((x - 14), (GROUND - h), (x + 14), GROUND);
      for (let [dx, dy, r] of [[(-40), 0, 62], [36, (-10), 66], [0, (-46), 72]]) {
        c.create_oval(((x + dx) - r), (((GROUND - h) + dy) - r), ((x + dx) + r), (((GROUND - h) + dy) + r));
      }
      for (let k = (-3); k < 4; k++) {
        c.create_line((x + (k * 22)), ((GROUND - h) + 40), ((x + (k * 22)) + 4), (((GROUND - h) + 90) + ((k % 2) * 25)));
      }
    }
    for (let x = 30; x < 940; x += 95) {
      let hh = (60 + ((x * 7) % 40));
      c.create_line(x, GROUND, x, (GROUND - hh));
      c.create_line(x, GROUND, x, (GROUND - hh));
      c.create_oval((x - 7), ((GROUND - hh) - 24), (x + 7), ((GROUND - hh) + 4));
    }
  }
  th_stage() {
    let c = this.c;
    for (let x0 of [250, 480, 710]) {
      c.create_polygon(x0, (-10), (x0 + 60), (-10), (x0 + 200), GROUND, (x0 - 200), GROUND);
    }
    for (let i = 0; i < 24; i++) {
      let sx = ((i * 137) % W);
      let sy = (((i * 71) % 260) + 30);
      c.create_polygon(star_pts(sx, sy, 7, 3, 4, 0.3).map(q => v));
    }
    for (let side of [0, 1]) {
      if (side === 0) {
        let pts = [(-40), (-40), 170, (-40), 120, GROUND, (-40), GROUND];
      } else {
        let pts = [(W + 40), (-40), (W - 170), (-40), (W - 120), GROUND, (W + 40), GROUND];
      }
      c.create_polygon(pts);
      for (let k = 1; k < 5; k++) {
        let xx = (side === 0 ? (k * 30) : (W - (k * 30)));
        c.create_line(xx, (-10), ((xx - 12) + (side === 0 ? 0 : 24)), GROUND);
      }
    }
    for (let i = (-1); i < 13; i++) {
      c.create_oval(((i * 90) - 10), (-30), ((i * 90) + 80), 50);
      c.create_oval(((i * 90) + 25), 28, ((i * 90) + 45), 44);
    }
  }
  th_tower() {
    let c = this.c;
    for (let [cx, cy, r, n] of [[130, 150, 150, 12], [860, 420, 190, 14], [480, 90, 100, 10]]) {
      let pts = star_pts(cx, cy, r, (r * 0.82), n, 0.2);
      c.create_polygon(pts.map(q => v));
      c.create_oval((cx - (r * 0.55)), (cy - (r * 0.55)), (cx + (r * 0.55)), (cy + (r * 0.55)));
      c.create_oval((cx - (r * 0.15)), (cy - (r * 0.15)), (cx + (r * 0.15)), (cy + (r * 0.15)));
    }
    for (let x of [60, 300, 600, 900]) {
      c.create_rectangle((x - 34), 190, (x + 34), GROUND);
      c.create_oval((x - 34), 156, (x + 34), 224);
      c.create_line(x, 160, x, GROUND);
      c.create_line((x - 34), 330, (x + 34), 330);
    }
  }
  th_snow() {
    let c = this.c;
    for (let [cx, r, col] of [[160, 240, "#cfe6f5"], [560, 300, "#bfdcee"], [920, 250, "#cfe6f5"]]) {
      c.create_oval((cx - r), (GROUND - 110), (cx + r), (GROUND + 260));
    }
    for (let [x, h] of [[70, 230], [880, 260], [470, 150]]) {
      c.create_rectangle((x - 9), ((GROUND - h) + 130), (x + 9), GROUND);
      for (let k = 0; k < 3; k++) {
        let wd = (70 - (k * 16));
        let yy = ((GROUND - h) + (k * 62));
        c.create_polygon(x, (yy - 70), (x - wd), (yy + 30), (x + wd), (yy + 30));
        c.create_polygon(x, (yy - 70), (x - (wd * 0.45)), (yy - 24), (x + (wd * 0.45)), (yy - 24));
      }
    }
  }
  th_meadow() {
    let c = this.c;
    for (let [cx, r, col] of [[120, 230, "#9fd668"], [500, 300, "#8ccb58"], [900, 240, "#9fd668"]]) {
      c.create_oval((cx - r), (GROUND - 100), (cx + r), (GROUND + 260));
    }
    for (let i = 0; i < range(40, 940, 70).length; i++) {
      let x = range(40, 940, 70)[i];
      let hh = (40 + ((x * 7) % 35));
      c.create_line(x, GROUND, x, (GROUND - hh));
      c.create_line(x, GROUND, x, (GROUND - hh));
      let col = ["#ff6fb5", "#ffffff", "#ffd23a", "#ff8a5a"][(i % 4)];
      c.create_oval((x - 12), ((GROUND - hh) - 12), (x + 12), ((GROUND - hh) + 12));
      c.create_oval((x - 4), ((GROUND - hh) - 4), (x + 4), ((GROUND - hh) + 4));
    }
    for (let [cx, cy] of [[200, 110], [620, 80], [860, 150]]) {
      for (let [dx, rr] of [[(-34), 28], [0, 38], [34, 28]]) {
        c.create_oval(((cx + dx) - rr), (cy - (rr * 0.7)), ((cx + dx) + rr), (cy + (rr * 0.7)));
      }
    }
  }
  th_menu() {
    let c = this.c;
    for (let [cx, r, col] of [[100, 260, "#e08a3a"], [520, 330, "#d27a2f"], [940, 280, "#e08a3a"]]) {
      c.create_oval((cx - r), (GROUND - 120), (cx + r), (GROUND + 300));
    }
  }
  rays(cx, cy, col, n, spd) {
    let R = 1300;
    for (let i = 0; i < n; i++) {
      let a = (((i * (Math.PI * 2)) / n) + (this.t * spd));
      let b = (a + (Math.PI / n));
      this.c.create_polygon(cx, cy, (cx + (R * Math.cos(a))), (cy + (R * Math.sin(a))), (cx + (R * Math.cos(b))), (cy + (R * Math.sin(b))));
    }
    try {
      this.c.tag_lower("rays", "hills");
    } catch (e) {
      /* pass */;
    }
  }
  draw() {
    let c = this.c;
    c.delete("d");
    let st = this.state;
    if (py_in(st, ["fight", "pause"])) {
      this.draw_fight();
    } else {
      this.build_bg("menu", MENU_CFG);
      this.camx = 0.0;
      if (this.bgoff !== [0, 0]) {
        c.move("bg", (-this.bgoff[0]), (-this.bgoff[1]));
        this.bgoff = [0, 0];
      }
      this.rays((W / 2), 300, MENU_CFG["ray"]);
      getattr(this, ("dr_" + st))();
    }
    this.film();
    this.draw_iris();
    let want = ((st === "fight") && (this.mouse_mode) ? "none" : "arrow");
    if (want !== this.cur) {
      this.cur = want;
      try {
        this.cv.config();
      } catch (e) {
        this.cv.config();
      }
    }
  }
  film() {
    let c = this.c;
    if (this.settings["grain"]) {
      for (let _ = 0; _ < 22; _++) {
        let x = Math.floor(0 + Math.random() * (W - 0 + 1));
        let y = Math.floor(0 + Math.random() * (H - 0 + 1));
        c.create_rectangle(x, y, (x + 2), (y + 2));
      }
      if (Math.random() < 0.12) {
        let x = Math.floor(20 + Math.random() * ((W - 20) - 20 + 1));
        c.create_line(x, 0, (x + Math.floor((-4) + Math.random() * (4 - (-4) + 1))), H);
      }
    }
    c.create_rectangle(0, 0, W, H);
    c.create_rectangle(10, 10, (W - 10), (H - 10));
  }
  draw_iris() {
    let it = this.iris;
    if ((!it)) {
      return;
    }
    let R = 640;
    let k = (it[1] / 22.0);
    let k = clamp(k, 0, 1);
    let r = (it[0] === 0 ? (R * ((1 - k) ** 1.5)) : (R * (k ** 1.5)));
    let [cx, cy] = this.iris_c;
    let c = this.c;
    if (r < 2) {
      c.create_rectangle(0, 0, W, H);
      return;
    }
    let wd = ((r * 0.5) + 8);
    c.create_oval(((cx - r) - (wd / 2)), ((cy - r) - (wd / 2)), ((cx + r) + (wd / 2)), ((cy + r) + (wd / 2)));
    c.create_rectangle((-10), (-10), (W + 10), (cy - r));
    c.create_rectangle((-10), (cy + r), (W + 10), (H + 10));
    c.create_rectangle((-10), (cy - r), (cx - r), (cy + r));
    c.create_rectangle((cx + r), (cy - r), (W + 10), (cy + r));
  }
  draw_shot(sh) {
    let k = sh.kind;
    let [x, y, r] = [(sh.x - this.camx), sh.y, sh.r];
    let pk = sh.pink;
    let col = (pk ? PINK : ({ ["snow"]: "#eaf6ff", ["honey"]: "#ffbe2e" }).get(sh.skin, "#ff5a2c"));
    let core = (pk ? "#ffffff" : "#ffe9a8");
    if (sh.flash > 0) {
      let col = "#ffffff";
    }
    if (k === "ball") {
      let pu = (pk ? (1 + (0.12 * Math.sin((this.t * 0.4)))) : 1);
      this.ov(x, y, (r * pu), (r * pu), col);
      this.ov(x, y, (r * 0.5), (r * 0.5), core, 0);
    } else if (k === "fly") {
      let wg = ((Math.abs(Math.sin((this.t * 0.5))) * 8) + 4);
      let wc = (pk ? PINK : "#ffffff");
      this.ov((x - 9), (y - 7), 8, wg, wc, 2);
      this.ov((x + 9), (y - 7), 8, wg, wc, 2);
      this.ov(x, y, 8, 11, INK);
      this.ov((x - 3), (y - 3), 2, 2, RED, 0);
      this.ov((x + 3), (y - 3), 2, 2, RED, 0);
    } else if (k === "card") {
      let a = sh.spin;
      let pts = [];
      for (let [dx, dy] of [[(-9), (-13)], [9, (-13)], [9, 13], [(-9), 13]]) {
        pts.append([((x + (dx * Math.cos(a))) - (dy * Math.sin(a))), ((y + (dx * Math.sin(a))) + (dy * Math.cos(a)))]);
      }
      this.pl(pts, (pk ? PINK : WHITE));
      this.ov(x, y, 4, 4, (pk ? "#ffffff" : RED), 0);
    } else if (k === "carrot") {
      let a = sh.ang;
      let [nx, ny] = [(-Math.sin(a)), Math.cos(a)];
      let tip = [(x + (Math.cos(a) * 22)), (y + (Math.sin(a) * 22))];
      let bk = [(x - (Math.cos(a) * 14)), (y - (Math.sin(a) * 14))];
      for (let sgn of [(-1), 1]) {
        this.ln([bk, [((bk[0] - (Math.cos(a) * 14)) + ((nx * sgn) * 8)), ((bk[1] - (Math.sin(a) * 14)) + ((ny * sgn) * 8))]], 5, "#4fa83a");
      }
      let c1 = (pk ? PINK : "#ff8c1a");
      if (sh.flash > 0) {
        let c1 = "#ffffff";
      }
      this.pl([tip, [(bk[0] + (nx * 10)), (bk[1] + (ny * 10))], [(bk[0] - (nx * 10)), (bk[1] - (ny * 10))]], c1);
    } else if (k === "star") {
      this.pl(star_pts(x, y, r, (r * 0.45), 5, sh.spin), (pk ? PINK : GOLD));
    } else if (k === "wave") {
      let hh = sh.hh;
      this.ov(x, (GROUND - (hh * 0.5)), sh.r, (hh * 0.5), "#fff3b0");
      this.ov(x, (GROUND - (hh * 0.4)), (sh.r * 0.5), (hh * 0.28), "#ffffff", 0);
    } else if (k === "gear") {
      this.pl(star_pts(x, y, r, (r * 0.78), 8, sh.spin), (pk ? PINK : "#d8a02a"));
      this.ov(x, y, (r * 0.55), (r * 0.55), (pk ? "#fff0c0" : "#f2c85c"), 3);
      this.ov(x, y, (r * 0.2), (r * 0.2), INK, 0);
    } else if (k === "bomb") {
      this.ov(x, y, r, r, "#2b2b33");
      this.ov((x - 5), (y - 5), 4, 4, "#8a8a99", 0);
      this.ln([[(x + 4), ((y - r) + 2)], [(x + 10), ((y - r) - 8)]], 3, "#a06a2a");
      this.ov((x + 11), ((y - r) - 10), 4, 4, "#ffd23a", 0);
    } else if (k === "roll") {
      this.ov(x, y, r, r, "#f4fbff");
      for (let i = 0; i < 3; i++) {
        let a = (sh.spin + (i * 2.1));
        this.ov((x + ((Math.cos(a) * r) * 0.5)), (y + ((Math.sin(a) * r) * 0.5)), 5, 5, "#cfe6f0", 2);
      }
    } else if (k === "ice") {
      this.pl([[(x - 8), (y - 18)], [(x + 8), (y - 18)], [x, (y + 20)]], "#bfeaff", 3);
      this.ln([[(x - 2), (y - 12)], [x, (y + 6)]], 2, "#ffffff");
    } else if (k === "bee") {
      let wg = ((Math.abs(Math.sin((this.t * 0.6))) * 6) + 3);
      this.ov((x + 2), (y - 9), 6, wg, (pk ? PINK : "#ffffff"), 2);
      this.ov(x, y, 10, 8, GOLD);
      this.ln([[(x - 3), (y - 7)], [(x - 3), (y + 7)]], 3, INK);
      this.ln([[(x + 3), (y - 7)], [(x + 3), (y + 7)]], 3, INK);
      this.pl([[(x + 9), (y - 2)], [(x + 16), y], [(x + 9), (y + 2)]], INK, 2);
    }
  }
  draw_parts() {
    for (let q of this.parts) {
      let [x, y, vx, vy, l, ml, col, sz, k] = q;
      x -= this.camx;
      let r = Math.max(0.6, ((sz * l) / ml));
      if (k === 0) {
        this.ov(x, y, r, r, col, 2);
      } else if (k === 1) {
        this.pl(star_pts(x, y, (r * 1.8), (r * 0.7), 4, (l * 0.2)), col, 2);
      } else if (k === 2) {
        this.ov(x, y, (r * 1.5), (r * 1.1), col, 0);
      } else {
        this.rc((x - r), (y - (r * 0.6)), (x + r), (y + (r * 0.6)), col, 1);
      }
    }
    for (let [x, y, t, l, col] of this.pops) {
      this.tx((x - this.camx), y, t, 20, col);
    }
  }
  draw_player(p, ox, ghost) {
    let f = p.face;
    let x = (p.x + ox);
    let y = p.y;
    if (ghost) {
      let gy = (y - (this.dying * 1.4));
      this.ov(x, (gy - 78), 17, 6, GOLD, 3);
      this.pl([[(x - 13), (gy - 60)], [(x + 13), (gy - 60)], [(x + 15), (gy - 51)], [(x + 12), (gy - 39)], [(x + 7), (gy - 31)], [(x - 7), (gy - 31)], [(x - 12), (gy - 39)], [(x - 15), (gy - 51)]], "#e6f6fa", 3, true);
      this.ov((x - 5), (gy - 50), 3, 5, INK, 0);
      this.ov((x + 5), (gy - 50), 3, 5, INK, 0);
      for (let d of [(-1), 1]) {
        this.ov((x + (d * 24)), (gy - 42), 10, 16, WHITE, 3);
      }
      return;
    }
    if ((p.inv > 0) && ((Math.floor(this.t / 3) % 2))) {
      return;
    }
    let base = this.floor_y(p);
    if ((base < GROUND) || (this.ground_at(p.x))) {
      this.ov(x, (base + 3), 18, 5, mix(this.gcol, INK, 0.5), 0);
    }
    if (p.dash > 0) {
      for (let i = 0; i < 3; i++) {
        this.ov((x - (f * (14 + (i * 18)))), (y - 30), (18 - (i * 4)), (10 - (i * 2)), mix(WHITE, this.gcol, (i * 0.25)), 2);
      }
      this.ov(x, (y - 30), 24, 15, "#f4fbff");
      this.ov((x + (f * 6)), (y - 32), 5, 7, INK, 0);
      this.ov((x + (f * 8)), (y - 31), 7, 5, RED, 0);
      return;
    }
    let run = (p.on) && (Math.abs(p.vx) > 1.2);
    let ph = (this.t * 0.38);
    if (run) {
      let bob = (Math.abs(Math.sin(ph)) * 3);
    } else if (p.on) {
      let bob = (Math.sin((this.t * 0.1)) * 1.5);
    } else {
      let bob = 0;
    }
    let hipy = ((y - 24) - bob);
    if (run) {
      let f1 = [(x + (Math.sin(ph) * 13)), ((y - 3) - (Math.max(0, Math.cos(ph)) * 7))];
      let f2 = [(x - (Math.sin(ph) * 13)), ((y - 3) - (Math.max(0, (-Math.cos(ph))) * 7))];
    } else if ((!p.on)) {
      let f1 = [(x + (7 * f)), (y - 10)];
      let f2 = [(x - (6 * f)), (y - (p.vy > 0 ? 4 : 15))];
    } else {
      let f1 = [(x - 8), (y - 3)];
      let f2 = [(x + 8), (y - 3)];
    }
    for (let ft of [f1, f2]) {
      this.limb([x, hipy], ft, (4 * f));
      this.ov((ft[0] + (f * 4)), (ft[1] - 1), 9, 5, "#7a3a18");
    }
    this.ov(x, (hipy - 2), 11, 9, RED);
    this.ov(x, (hipy - 14), 8, 10, CREAM);
    let sh_y = (hipy - 18);
    let [ax, ay] = (this.state === "fight" ? p.aimvec(this) : [f, 0]);
    let shooting = (this.state === "fight") && (this.shooting()) && (this.intro <= 60);
    if ((shooting) || (p.mz > 0)) {
      let hand = [(x + (ax * 22)), ((sh_y + 4) + (ay * 20))];
    } else {
      let hand = [(x + (f * 12)), ((sh_y + 12) + (Math.sin((this.t * 0.2)) * 2))];
    }
    this.limb([x, sh_y], hand, 3);
    this.ov(hand[0], hand[1], 6, 6, WHITE);
    let h2 = [((x - (f * 12)) + (run ? (Math.sin(ph) * 8) : 0)), (sh_y + 14)];
    this.limb([x, sh_y], h2, (-3));
    this.ov(h2[0], h2[1], 6, 6, WHITE);
    let [hx_, hy_] = [(x + (f * 2)), (hipy - 38)];
    if ((!p.on)) {
      hy_ -= 2;
    }
    this.ln([[(hx_ - 4), (hy_ + 2)], [(hx_ - 10), (hy_ - 22)]], 7, INK);
    this.ln([[(hx_ - 4), (hy_ + 2)], [(hx_ - 10), (hy_ - 22)]], 3, RED);
    let glass = [[(hx_ - 13), (hy_ - 15)], [(hx_ + 13), (hy_ - 15)], [(hx_ + 15), (hy_ - 6)], [(hx_ + 12), (hy_ + 6)], [(hx_ + 7), (hy_ + 14)], [(hx_ - 7), (hy_ + 14)], [(hx_ - 12), (hy_ + 6)], [(hx_ - 15), (hy_ - 6)]];
    this.pl(glass, "#e6f6fa", 0, true, "");
    this.pl([[(hx_ - 14), (hy_ - 4)], [(hx_ + 14), (hy_ - 4)], [(hx_ + 12), (hy_ + 6)], [(hx_ + 7), (hy_ + 14)], [(hx_ - 7), (hy_ + 14)], [(hx_ - 12), (hy_ + 6)]], "#c4501a", 0, true, "");
    this.pl(glass, "", 3, true);
    this.ln([[(hx_ - 11), (hy_ - 12)], [(hx_ + 11), (hy_ - 12)]], 2, "#ffffff");
    for (let d of [(-4), 6]) {
      this.ov(((hx_ + d) + (f * 2)), (hy_ - 1), 3, 5, INK, 0);
      this.ov((((hx_ + d) + (f * 2)) + 1), (hy_ - 3), 1, 1, "#ffffff", 0);
    }
    if ((p.mz > 0) || (p.hurt > 0)) {
      this.ov((hx_ + (f * 5)), (hy_ + 7), 3, 3, INK, 0);
    } else {
      this.ln([[((hx_ + (f * 2)) - 2), (hy_ + 7)], [((hx_ + (f * 2)) + 3), (hy_ + 7)]], 2, INK);
    }
    if (p.mz > 0) {
      let mx = (hand[0] + (ax * 14));
      let my = (hand[1] + (ay * 14));
      this.pl(star_pts(mx, my, 10, 4, 4, this.t), GOLD, 2);
    }
  }
  draw_boss_scene() {
    let b = this.boss;
    let ox = 0;
    if (this.intro > 40) {
      let ox = ((this.intro - 40) * 9);
    }
    let bshake = ((this.ko > 0) && (this.ko < 150) ? Math.floor((-4) + Math.random() * (4 - (-4) + 1)) : 0);
    b.draw(this, (ox + bshake));
    for (let sh of this.shots) {
      this.draw_shot(sh);
    }
    this.draw_player(this.p, 0);
  }
  draw_bullets() {
    let cx = this.camx;
    for (let bl of this.bul) {
      let x = (bl.x - cx);
      if (bl.ex) {
        this.ov(x, bl.y, 20, 16, GOLD, 3);
        this.ov(x, bl.y, 10, 8, "#ffffff", 0);
        this.pl(star_pts(x, bl.y, 26, 12, 6, (this.t * 0.3)), "", 2, false, GOLD);
      } else {
        this.ov(x, bl.y, 7, 5, WHITE, 2);
      }
    }
  }
  draw_plat(x1, x2, top, col, bolts) {
    this.rc((x1 + 8), (top + 16), (x2 - 8), (top + 30), mix(INK, col, 0.5), 3);
    this.rc(x1, top, x2, (top + 18), col, 4);
    this.ln([[(x1 + 6), (top + 5)], [(x2 - 6), (top + 5)]], 3, mix(col, "#ffffff", 0.45));
    for (let xx = (Math.floor(x1) + 30); xx < (Math.floor(x2) - 10); xx += 40) {
      this.ln([[xx, (top + 4)], [xx, (top + 16)]], 2, INK);
    }
    if (bolts) {
      this.ov((x1 + 8), (top + 9), 3, 3, INK, 0);
      this.ov((x2 - 8), (top + 9), 3, 3, INK, 0);
    }
  }
  rg_prop(th, x, y, i, col) {
    if (th === "swamp") {
      this.rc((x - 10), (y - 150), (x + 10), y, "#6b4a2a", 3);
      this.ov(x, (y - 170), 52, 46, col, 3);
      this.ov((x - 30), (y - 140), 34, 28, col, 3);
    } else if (py_in(th, ["forest", "snow"])) {
      this.rc((x - 8), (y - 40), (x + 8), y, "#6b4a2a", 3);
      for (let k = 0; k < 3; k++) {
        let wd = (62 - (k * 14));
        let yy = ((y - 40) - (k * 52));
        this.pl([[x, (yy - 80)], [(x - wd), yy], [(x + wd), yy]], col, 3);
        if (th === "snow") {
          this.pl([[x, (yy - 80)], [(x - (wd * 0.42)), (yy - 34)], [(x + (wd * 0.42)), (yy - 34)]], "#f4fbff", 0, false, "");
        }
      }
    } else if (th === "circus") {
      this.pl([[(x - 80), y], [(x + 80), y], [x, (y - 140)]], col, 4);
      this.pl([[(x - 26), y], [(x + 26), y], [x, (y - 140)]], "#fff3d0", 0, false, "");
      this.ln([[x, (y - 140)], [x, (y - 175)]], 4, INK);
      this.pl([[x, (y - 175)], [(x + 28), (y - 166)], [x, (y - 156)]], RED, 3);
    } else if (th === "lava") {
      this.pl([[(x - 120), y], [(x + 120), y], [(x + 34), (y - 180)], [(x - 34), (y - 180)]], col, 4);
      this.ov(x, (y - 180), 34, 10, "#ff9a2a", 3);
      this.ln([[(x - 8), (y - 176)], [(x - 30), (y - 90)], [(x - 18), (y - 10)]], 4, "#ff7a2a");
    } else if (th === "tower") {
      this.rc((x - 24), (y - 190), (x + 24), y, col, 3);
      this.ov(x, (y - 190), 24, 16, col, 3);
      let rot = ((this.t * 0.01) * ((i % 2) ? 1 : (-1)));
      this.pl(star_pts(x, (y - 110), 44, 36, 8, rot), mix(col, "#ffffff", 0.15), 3);
      this.ov(x, (y - 110), 12, 12, INK, 0, "");
    } else if (th === "sky") {
      let yy = ((y - 230) - ((i % 3) * 45));
      for (let [dx, rr] of [[(-34), 30], [0, 40], [34, 30]]) {
        this.ov((x + dx), yy, rr, (rr * 0.7), col, 3);
      }
    }
  }
  rg_parallax(cfg, cam) {
    let [far, near, th] = [cfg["far"], cfg["near"], cfg["theme"]];
    let sp = 300.0;
    let off = (cam * 0.2);
    let i0 = Math.floor(Math.floor(off / sp));
    for (let i = (i0 - 1); i < (i0 + 5); i++) {
      let cx = (((i * sp) - off) + 150);
      let h = (90 + ((i * 37) % 70));
      this.ov(cx, (GROUND + 40), 190, (h + 40), far, 3);
    }
    let sp2 = 330.0;
    let off2 = (cam * 0.5);
    let i0 = Math.floor(Math.floor(off2 / sp2));
    for (let i = (i0 - 1); i < (i0 + 5); i++) {
      let bx = ((((i * sp2) - off2) + 80) + ((i * 53) % 120));
      this.rg_prop(th, bx, GROUND, i, near);
    }
    if (th === "snow") {
      for (let k = 0; k < 30; k++) {
        let fx = ((((k * 131) - (this.t * (0.6 + ((k % 3) * 0.4)))) - (cam * 0.5)) % W);
        let fy = (((k * 57) + (this.t * (1.2 + ((k % 4) * 0.3)))) % H);
        this.ov(fx, fy, 2.5, 2.5, WHITE, 0);
      }
    } else if (th === "lava") {
      for (let k = 0; k < 24; k++) {
        let fx = ((((k * 97) - (cam * 0.4)) + (Math.sin(((this.t * 0.05) + k)) * 20)) % W);
        let fy = (H - (((k * 61) + (this.t * (1 + (k % 3)))) % H));
        this.ov(fx, fy, 2.5, 2.5, "#ffb347", 0);
      }
    }
  }
  rg_ground(cfg, cam) {
    let gc = cfg["ground"];
    let pit = cfg["pit"];
    this.rc((-10), (GROUND + 30), (W + 10), (H + 10), pit, 0, "");
    let off = (((-cam) * 0.6) % 40);
    for (let i = (-1); i < (Math.floor(W / 40) + 2); i++) {
      this.ov(((i * 40) + off), (GROUND + 30), 24, 8, mix(pit, "#ffffff", 0.25), 2);
    }
    for (let [a, b] of this.rg["segs"]) {
      if ((b < (cam - 10)) || (a > ((cam + W) + 10))) {
        continue;
      }
      let x1 = Math.max((a - cam), (-20));
      let x2 = Math.min((b - cam), (W + 20));
      this.pl([[x1, GROUND], [x2, GROUND], [x2, (H + 20)], [x1, (H + 20)]], gc, 4);
      this.rc(x1, (GROUND + 4), x2, (GROUND + 14), mix(gc, "#ffffff", 0.3), 0, "");
      for (let k = Math.floor(Math.floor(Math.max(a, cam) / 80)); k < (Math.floor(Math.floor(Math.min(b, (cam + W)) / 80)) + 1); k++) {
        let xx = ((k * 80) - cam);
        if ((x1 + 4) < xx && xx < (x2 - 4)) {
          this.ln([[xx, (GROUND + 14)], [(xx - 18), H]], 2, mix(gc, INK, 0.25));
        }
      }
    }
  }
  draw_goal(x) {
    if ((x < (-150)) || (x > (W + 150))) {
      return;
    }
    this.ln([[x, GROUND], [x, (GROUND - 210)]], 10, INK);
    this.ln([[x, GROUND], [x, (GROUND - 210)]], 5, CREAM);
    this.pl([[x, (GROUND - 210)], [(x + 100), (GROUND - 184)], [x, (GROUND - 158)]], RED, 4);
    this.ov(x, (GROUND - 214), 8, 8, GOLD, 3);
    this.tx((x + 36), (GROUND - 184), "BİTİŞ", 12, CREAM);
  }
  draw_enemy(e) {
    let x = (e.x - this.camx);
    let y = e.y;
    let col = (e.flash > 0 ? "#ffffff" : e.col);
    let dk = mix(col, INK, 0.35);
    let k = e.kind;
    let f = e.face;
    if (k === "walker") {
      let ph = (e.t * 0.3);
      for (let d of [(-1), 1]) {
        this.ov(((x + (d * 8)) + (Math.sin((ph * d)) * 6)), (y - 4), 10, 5, "#3a2a1a");
      }
      this.ov(x, (y - 24), 18, 22, col);
      this.ov(x, (y - 14), 12, 12, mix(col, "#ffffff", 0.35), 0, "");
      this.ov((x + (f * 6)), (y - 30), 7, 8, WHITE, 2);
      this.ov((x + (f * 8)), (y - 30), 3, 4, INK, 0);
      this.ln([[(x - (f * 2)), (y - 40)], [(x + (f * 15)), (y - 34)]], 4, INK);
      this.pl([[(x - 10), (y - 42)], [x, (y - 58)], [(x + 10), (y - 42)]], dk, 3);
    } else if (k === "hopper") {
      let air = e.y < (e.y0 - 1);
      let sq = (air ? 1.18 : (e.cd < 12 ? 0.84 : 1.0));
      this.ov(x, (y - (22 * sq)), (22 * (2 - sq)), (22 * sq), col);
      this.ov((x + (f * 7)), (y - (28 * sq)), 7, 8, WHITE, 2);
      this.ov((x + (f * 9)), (y - (28 * sq)), 3, 4, INK, 0);
      this.ov((x - (f * 5)), (y - (28 * sq)), 5, 6, WHITE, 2);
      this.ln([[(x - 12), (y - (42 * sq))], [(x + 14), (y - (36 * sq))]], 4, INK);
      for (let d of [(-1), 1]) {
        this.ov((x + (d * 12)), (y - 3), 9, 4, dk);
      }
    } else if (k === "bat") {
      let wing = (Math.sin((e.t * 0.4)) * 16);
      for (let d of [(-1), 1]) {
        this.pl([[(x + (d * 6)), (y - 4)], [(x + (d * 38)), ((y - 14) + wing)], [(x + (d * 30)), (y + 8)], [(x + (d * 14)), (y + 4)]], dk, 3);
      }
      this.ov(x, y, 15, 13, col);
      this.pl([[(x - 11), (y - 8)], [(x - 8), (y - 22)], [(x - 2), (y - 11)]], col, 3);
      this.pl([[(x + 11), (y - 8)], [(x + 8), (y - 22)], [(x + 2), (y - 11)]], col, 3);
      for (let d of [(-1), 1]) {
        this.ov((x + (d * 5)), (y - 2), 4, 5, WHITE, 2);
      }
      this.ln([[(x - 10), (y - 8)], [(x - 2), (y - 4)]], 3, INK);
      this.ln([[(x + 10), (y - 8)], [(x + 2), (y - 4)]], 3, INK);
    } else if (k === "turret") {
      this.rc((x - 26), (y - 20), (x + 26), y, "#6a6a78", 4);
      this.ov(x, (y - 22), 19, 16, col);
      let a = Math.atan2(((this.p.y - 30) - (y - 30)), (this.p.x - e.x));
      let [tx_, ty_] = [(x + (Math.cos(a) * 30)), ((y - 30) + (Math.sin(a) * 30))];
      this.ln([[x, (y - 30)], [tx_, ty_]], 13, INK);
      this.ln([[x, (y - 30)], [tx_, ty_]], 8, "#8a8a98");
      this.ov(x, (y - 30), 10, 10, dk, 3);
    }
  }
  draw_rg_scene() {
    let cfg = this.cfg;
    let cam = this.camx;
    let w = this.rg;
    this.rg_parallax(cfg, cam);
    this.rg_ground(cfg, cam);
    for (let [x1, x2, top] of w["plats"]) {
      if ((x2 < (cam - 20)) || (x1 > ((cam + W) + 20))) {
        continue;
      }
      this.draw_plat((x1 - cam), (x2 - cam), top, "#c98a45");
    }
    for (let m of w["movers"]) {
      if (((m["x1"] + m["w"]) < (cam - 20)) || (m["x1"] > ((cam + W) + 20))) {
        continue;
      }
      this.draw_plat((m["x1"] - cam), ((m["x1"] + m["w"]) - cam), m["y"], "#9aa6b8", true);
    }
    this.draw_goal((w["goal"] - cam));
    for (let cn of this.coin_list) {
      if (((!cn[2])) && ((-30) < (cn[0] - cam) && (cn[0] - cam) < (W + 30))) {
        let yy = (cn[1] + (Math.sin(((this.t * 0.1) + cn[0])) * 3));
        this.ov((cn[0] - cam), yy, 12, 12, GOLD, 3);
        this.ov((cn[0] - cam), yy, 6, 6, "#ffe9a0", 2);
      }
    }
    for (let o of this.orbs) {
      if (((!o[2])) && ((-30) < (o[0] - cam) && (o[0] - cam) < (W + 30))) {
        let pu = (1 + (0.12 * Math.sin((this.t * 0.2))));
        this.ov((o[0] - cam), o[1], (16 * pu), (16 * pu), PINK, 3);
        this.ov((o[0] - cam), o[1], 7, 7, "#ffffff", 0, "");
      }
    }
    for (let e of w["ens"]) {
      if (((!e.dead)) && ((cam - 100) < e.x && e.x < ((cam + W) + 100))) {
        this.draw_enemy(e);
      }
    }
    for (let sh of this.shots) {
      this.draw_shot(sh);
    }
    this.draw_player(this.p, (-cam));
  }
  draw_fight() {
    let c = this.c;
    let cfg = this.cfg;
    this.build_bg(["lv", this.lv], cfg);
    this.rays((W * 0.75), 200, cfg["ray"], 16, 0.003);
    if (this.mode === "rg") {
      this.draw_rg_scene();
    } else {
      this.draw_boss_scene();
    }
    this.draw_bullets();
    this.draw_parts();
    this.draw_hud();
    this.draw_banners();
    let sx = sy = 0;
    if ((this.shake > 0) && (this.settings["shake"])) {
      let sx = Math.floor(Math.floor((-this.shake) + Math.random() * (this.shake - (-this.shake) + 1)) / 2);
      let sy = Math.floor(Math.floor((-this.shake) + Math.random() * (this.shake - (-this.shake) + 1)) / 2);
    }
    c.move("d", sx, sy);
    c.move("bg", (sx - this.bgoff[0]), (sy - this.bgoff[1]));
    this.bgoff = [sx, sy];
    if ((this.state === "fight") && (this.mouse_mode)) {
      let [mx, my] = [this.mx, this.my];
      this.ov(mx, my, 14, 14, "", 5, INK);
      this.ov(mx, my, 14, 14, "", 2, CREAM);
      for (let [ddx, ddy] of [[(-1), 0], [1, 0], [0, (-1)], [0, 1]]) {
        this.ln([[(mx + (ddx * 7)), (my + (ddy * 7))], [(mx + (ddx * 22)), (my + (ddy * 22))]], 5, INK);
        this.ln([[(mx + (ddx * 8)), (my + (ddy * 8))], [(mx + (ddx * 21)), (my + (ddy * 21))]], 2, CREAM);
      }
    }
    if (this.state === "pause") {
      this.panel(300, 120, 660, 420);
      this.tx(480, 165, "DURAKLATILDI", 26, INK);
      for (let i = 0; i < ["DEVAM", "YENİDEN BAŞLA", "AYARLAR", "ANA MENÜ"].length; i++) {
        let lab = ["DEVAM", "YENİDEN BAŞLA", "AYARLAR", "ANA MENÜ"][i];
        let y = (225 + (i * 52));
        if (i === this.psel) {
          this.rc(330, (y - 20), 630, (y + 20), GOLD, 3);
        }
        this.tx(480, y, lab, 20, INK);
      }
    }
  }
  draw_hud() {
    let p = this.p;
    let b = this.boss;
    this.panel(14, (H - 58), 96, (H - 16));
    let col = ((p.hp <= 1) && ((Math.floor(this.t / 10) % 2) === 0) ? RED : INK);
    this.tx(55, (H - 37), ("HP %d" % Math.max(0, p.hp)), 20, col);
    for (let i = 0; i < 5; i++) {
      let x = (112 + (i * 27));
      let fr = clamp((p.card - i), 0, 1);
      this.rc(x, (H - 58), (x + 21), (H - 16), WHITE, 3);
      if (fr > 0) {
        this.rc((x + 2), (((H - 16) - 2) - (fr * 38)), (x + 19), (H - 18), (fr < 1 ? GOLD : "#ffd95a"), 0, "");
        if (fr >= 1) {
          this.pl(star_pts((x + 10.5), (H - 37), 7, 3, 4, (this.t * 0.05)), INK, 1);
        }
      }
      this.rc(x, (H - 58), (x + 21), (H - 16), "", 3);
    }
    let bw = 440;
    let x0 = ((W / 2) - (bw / 2));
    this.rc((x0 - 3), 20, ((x0 + bw) + 3), 40, INK, 0, "");
    if (this.mode === "rg") {
      let frac = clamp((p.x / Number((this.rg["len"] - 200))), 0, 1);
      this.rc(x0, 23, (x0 + bw), 37, "#1a3a5a", 0, "");
      if (frac > 0) {
        this.rc(x0, 23, (x0 + (bw * frac)), 37, "#4fa8e8", 0, "");
      }
      this.rc((x0 - 3), 20, ((x0 + bw) + 3), 40, "", 3, CREAM);
      this.ov((x0 + (bw * frac)), 30, 9, 9, GOLD, 3);
      this.tx((W / 2), 55, this.cfg["name"], 14, CREAM);
      this.tx((W - 22), 32, ("ALTIN %d/%d" % [this.got, this.ncoin]), 15, GOLD, "e", 2);
    } else {
      let frac = clamp((b.hp / b.maxhp), 0, 1);
      this.rc(x0, 23, (x0 + bw), 37, "#5a2a1a", 0, "");
      if (frac > 0) {
        this.rc(x0, 23, (x0 + (bw * frac)), 37, (b.ph === 1 ? RED : "#ff7a2c"), 0, "");
      }
      this.rc((x0 - 3), 20, ((x0 + bw) + 3), 40, "", 3, CREAM);
      this.tx((W / 2), 55, b.name, 14, CREAM);
    }
  }
  draw_banners() {
    if ((this.fin > 0) && (this.fin < 120)) {
      let k = Math.min(1.0, (this.fin / 14.0));
      this.tx((W / 2), ((H / 2) - 40), "BİTTİ!", Math.floor((40 + (80 * k))), GOLD);
    } else if ((this.ko > 0) && (this.ko < 150)) {
      let k = Math.min(1.0, (this.ko / 14.0));
      this.tx((W / 2), ((H / 2) - 40), "K.O.!", Math.floor((40 + (90 * k))), GOLD);
    } else if (this.intro > 0) {
      if (this.intro > 60) {
        let yy = (((H / 2) - 30) - (Math.max(0, (this.intro - 110)) * 8));
        this.tx((W / 2), yy, "HAZIR MISIN?", 56, CREAM);
        this.tx((W / 2), (H - 100), this.hint(), 14, CREAM);
      } else {
        this.tx((W / 2), ((H / 2) - 30), (this.mode !== "rg" ? "DÖVÜŞ!" : "KOŞ!"), (90 - Math.floor(((60 - this.intro) * 0.5))), GOLD);
      }
    }
  }
  dr_menu() {
    let t = this.t;
    this.p.face = 1;
    this.draw_player(this.p);
    let fr = (hasattr(this, "mfrog_obj") ? this.mfrog() : null);
    if ((!hasattr(this, "mfrog_obj"))) {
      this.mfrog_obj = Frog(this);
    }
    let f = this.mfrog_obj;
    let [f.x, f.y, f.face] = [790, GROUND, (-1)];
    f.sq = (1 + (0.03 * Math.sin((t * 0.12))));
    f.t = t;
    f.draw(this);
    let bob = (Math.sin((t * 0.06)) * 5);
    this.tx(((W / 2) + 5), ((98 + bob) + 5), "ÇAYCIK", 84, RED);
    this.tx((W / 2), (98 + bob), "ÇAYCIK", 84, CREAM);
    this.pl([[((W / 2) - 150), 150], [((W / 2) + 150), 150], [((W / 2) + 170), 172], [((W / 2) + 150), 194], [((W / 2) - 150), 194], [((W / 2) - 170), 172]], GOLD, 4);
    this.tx((W / 2), 172, "BOSS SAVAŞI", 22, INK);
    for (let i = 0; i < ["BAŞLA", "BÖLÜM SEÇ", "AYARLAR", "NASIL OYNANIR", "ÇIKIŞ"].length; i++) {
      let lab = ["BAŞLA", "BÖLÜM SEÇ", "AYARLAR", "NASIL OYNANIR", "ÇIKIŞ"][i];
      let y = (236 + (i * 46));
      if (i === this.sel) {
        this.rc(((W / 2) - 150), (y - 22), ((W / 2) + 150), (y + 22), GOLD, 4);
        this.pl([[((W / 2) - 135), (y - 10)], [((W / 2) - 120), y], [((W / 2) - 135), (y + 10)]], INK, 1);
        this.tx((W / 2), y, lab, 22, INK);
      } else {
        this.tx((W / 2), y, lab, 22, CREAM);
      }
    }
    this.tx((W / 2), (H - 34), "↑ ↓ seç      Enter / Space onayla      F11 tam ekran", 13, CREAM);
  }
  mfrog() {
    return null;
  }
  dr_settings() {
    let st = this.settings;
    this.panel(70, 24, 890, 514);
    this.tx((W / 2), 60, "AYARLAR", 32, INK);
    for (let i = 0; i < ["GÖRÜNTÜ", "KONTROLLER", "OYUN"].length; i++) {
      let t = ["GÖRÜNTÜ", "KONTROLLER", "OYUN"][i];
      let x1 = (120 + (i * 255));
      this.rc(x1, 88, (x1 + 235), 122, (i === this.stab ? GOLD : "#d9c79a"), 3);
      this.tx((x1 + 117), 105, t, 15, INK);
    }
    let items = this.set_items();
    this.sidx = clamp(this.sidx, 0, (items.length - 1));
    let step = (this.stab === 1 ? 33 : 46);
    for (let i = 0; i < items.length; i++) {
      let [name = items[i];
      let y = (156 + (i * step));
      let sel = i === this.sidx;
      if (sel) {
        this.rc(100, (y - 15), 860, (y + 15), "#f5d77a", 2);
      }
      this.tx(120, y, label, 15, INK, "w", 0);
      if (py_in(name, KEYACTS)) {
        for (let sl of [0, 1]) {
          let bx = (540 + (sl * 160));
          let on = (sel) && (sl === this.sslot);
          this.rc(bx, (y - 13), (bx + 145), (y + 13), (on ? GOLD : WHITE), (on ? 3 : 2));
          if (this.cap === [name, sl]) {
            let txt = "BİR TUŞA BAS...";
          } else {
            let txt = keyname(this.binds[name][sl]);
          }
          this.tx((bx + 72), y, txt, 13, (this.cap === [name, sl] ? RED : INK));
        }
      } else {
        let v = this.setting_val(name);
        if ((sel) && (name !== "reset")) {
          let v = ("◄  %s  ►" % v);
        }
        this.tx(700, y, v, 15, (sel ? RED : INK));
      }
    }
    if (this.stab === 0) {
      this.tx((W / 2), 380, "F11 ile oyunun her yerinde tam ekran açılıp kapanır.", 13, INK);
      this.tx((W / 2), 404, "Pencere modunda çözünürlük anında uygulanır, tam ekranda oyun ekrana sığdırılır.", 13, INK);
    } else if (this.stab === 1) {
      if (this.mouse_mode) {
        this.tx((W / 2), 462, "FARE: imleç yönüne nişan · SOL TIK ateş · SAĞ TIK EX", 13, RED);
      } else {
        this.tx((W / 2), 462, "KLAVYE: yukarı tuşu ile yukarı / çapraz nişan · Del: slotu temizle", 13, INK);
      }
      this.tx((W / 2), 482, "Her eylem için 2 tuş atayabilirsin (← → ile slot seç, Enter ile ata)", 12, INK);
    } else {
      for (let i = 0; i < DIFF.length; i++) {
        let dd = DIFF[i];
        this.tx(120, (290 + (i * 30)), dd["info"], 14, INK, "w", 0);
      }
      this.tx(120, 400, "Her bölümün zorluğunu BÖLÜM SEÇ ekranında ↑ ↓ ile ayrı ayrı da değiştirebilirsin.", 13, RED, "w", 0);
    }
    if (this.msgt > 0) {
      this.tx((W / 2), 445, this.msg, 14, RED);
    }
    if (this.stab !== 1) {
      this.tx((W / 2), 492, "↑ ↓ seç    ← → değiştir    Q / E sekme    Esc geri", 12, INK);
    } else {
      this.tx((W / 2), 500, "↑ ↓ seç   ← → slot / değer   Enter ata   Q / E sekme   Esc geri", 12, INK);
    }
  }
  dr_howto() {
    this.panel(110, 60, 850, 480);
    this.tx((W / 2), 100, "NASIL OYNANIR", 30, INK);
    for (let i = 0; i < HOWTO.length; i++) {
      let t = HOWTO[i];
      this.tx(135, (140 + (i * 25)), t, 14, INK, "w", 0);
    }
    this.tx((W / 2), 462, "Enter: geri", 13, RED);
  }
  node_pos(i) {
    let [row, col] = divmod(i, 4);
    if ((row % 2) === 1) {
      let col = (3 - col);
    }
    return [(150 + (col * 220)), (125 + (row * 100))];
  }
  dr_select() {
    let n = LEVELS.length;
    this.tx((W / 2), 34, "BÖLÜM SEÇ", 30, CREAM);
    this.tx((W / 2), 68, "← → bölüm      ↑ ↓ zorluk      Enter başla      Esc geri", 13, CREAM);
    let pos = range(n).map(i => this.node_pos(i));
    for (let i = 0; i < (n - 1); i++) {
      let lk = (i + 1) >= this.save["unlocked"];
      this.ln([pos[i], pos[(i + 1)]], 14, INK);
      this.ln([pos[i], pos[(i + 1)]], 8, (lk ? "#8a8372" : CREAM));
    }
    for (let i = 0; i < LEVELS.length; i++) {
      let lv = LEVELS[i];
      let [x, y] = pos[i];
      let lock = i >= this.save["unlocked"];
      let sel = i === this.lsel;
      let boss = lv.get("kind", "boss") === "boss";
      let r = (boss ? 31 : 25);
      let by = (y + (sel ? (Math.sin((this.t * 0.15)) * 4) : 0));
      if (sel) {
        this.ov(x, by, (r + 10), (r + 10), "", 5, GOLD);
      }
      this.ov(x, by, r, r, (lock ? "#8a8372" : (boss ? RED : CREAM)), 4);
      if (lock) {
        this.rc((x - 9), (by - 3), (x + 9), (by + 11), "#444444", 2);
        this.ln([[(x - 5), (by - 3)], [(x - 5), (by - 10)], [(x + 5), (by - 10)], [(x + 5), (by - 3)]], 4, INK);
      } else if (boss) {
        this.pl(star_pts(x, by, (r * 0.7), (r * 0.3), 5, ((-Math.PI) / 2)), GOLD, 2);
        this.tx(x, ((by + r) + 13), str((i + 1)), 12, CREAM);
      } else {
        this.tx(x, by, str((i + 1)), 20, INK);
      }
      let g = this.save["grades"].get(str(i));
      if ((g) && ((!lock))) {
        this.ov((x + (r * 0.85)), (by - (r * 0.85)), 11, 11, GOLD, 2);
        this.tx((x + (r * 0.85)), (by - (r * 0.85)), g, 12, INK);
      }
    }
    let i = this.lsel;
    let lv = LEVELS[i];
    let lock = i >= this.save["unlocked"];
    let boss = lv.get("kind", "boss") === "boss";
    this.panel(60, 372, 900, 512);
    if (lock) {
      this.tx((W / 2), 442, "KİLİTLİ - önce önceki bölümü bitir", 20, INK);
      return;
    }
    this.tx(90, 408, ("%d. %s" % [(i + 1), lv["name"]]), 22, INK, "w", 0);
    this.tx(90, 438, lv["sub"], 14, RED, "w", 0);
    let tag = (boss ? "BOSS SAVAŞI" : "KOŞ & ATEŞ");
    this.tx(90, 470, (((tag + "    ") + ("★" * lv["stars"])) + ("☆" * (3 - lv["stars"]))), 14, INK, "w", 0);
    let dd = DIFF[clamp(this.settings["diff"][i], 0, 2)];
    this.tx(520, 408, ("◄ %s ►" % dd["name"]), 20, dd["col"], "center", 2);
    let tm = this.save["times"].get(str(i));
    this.tx(520, 442, (tm ? ("en iyi süre: %.1f sn" % tm) : "henüz bitmedi"), 13, INK);
    if ((!boss)) {
      this.tx(520, 470, ("Altın: %d / 5" % this.save.get("coins", ({  })).get(str(i), 0)), 13, "#a8741a");
    }
    let g = this.save["grades"].get(str(i));
    if (g) {
      this.ov(800, 442, 36, 36, GOLD, 5);
      this.tx(800, 442, g, 40, INK);
    }
  }
  dr_result() {
    let r = this.res;
    this.panel(190, 50, 770, 490);
    this.tx((W / 2), 100, "SONUÇ", 38, INK);
    let lines = [["Süre", ("%d:%04.1f" % [Math.floor(Math.floor(r["time"] / 60)), (r["time"] % 60)])], ["Kalan can", ("%d / %d" % [r["hp"], r["maxhp"]])], ["Parry", str(r["parries"])], ["Zorluk", r["diff"]]];
    if (r.get("coins")) {
      lines.insert(3, ["Altın", ("%d / %d" % r["coins"])]);
    }
    let step = (lines.length > 4 ? 38 : 46);
    for (let i = 0; i < lines.length; i++) {
      let [a = lines[i];
      if (this.rt > (20 + (i * 18))) {
        let y = (165 + (i * step));
        this.tx(250, y, a, 22, INK, "w", 0);
        this.tx(710, y, b, 22, RED, "e", 0);
        this.ln([[250, (y + 20)], [710, (y + 20)]], 2, "#b9a97d");
      }
    }
    if (this.rt > 90) {
      let k = Math.min(1.0, ((this.rt - 90) / 10.0));
      this.ov((W / 2), 395, ((54 * k) + 4), ((54 * k) + 4), GOLD, 5);
      this.tx((W / 2), 395, r["grade"], (Math.floor((70 * k)) + 4), INK);
    }
    if ((this.rt > 100) && ((Math.floor(this.t / 25) % 2) === 0)) {
      let txt = ((this.lv + 1) < LEVELS.length ? "Enter: sonraki bölüm" : "Enter: devam");
      this.tx((W / 2), 470, txt, 17, RED);
    }
  }
  dr_dead() {
    this.panel(200, 80, 760, 460);
    this.tx((W / 2), 135, "ÖLDÜN!", 50, RED);
    if (this.mode === "rg") {
      let nm = this.cfg["name"];
      let frac = clamp((this.p.x / Number((this.rg["len"] - 200))), 0, 1);
      let bar = "#4fa8e8";
      let lab = ("Bölümün %%%d kadarını geçtin" % Math.floor((frac * 100)));
    } else {
      let b = this.boss;
      let nm = b.name;
      let frac = clamp((b.hp / b.maxhp), 0, 1);
      let bar = RED;
      let lab = ("Boss'un kalan canı: %%%d" % Math.floor((frac * 100)));
    }
    this.tx((W / 2), 200, nm, 20, INK);
    this.rc(260, 230, 700, 256, "#5a2a1a", 3);
    this.rc(262, 232, (262 + (436 * frac)), 254, bar, 0, "");
    this.tx((W / 2), 285, lab, 15, INK);
    for (let i = 0; i < ["TEKRAR DENE", "ANA MENÜ"].length; i++) {
      let lab = ["TEKRAR DENE", "ANA MENÜ"][i];
      let y = (345 + (i * 50));
      if (i === this.dsel) {
        this.rc(300, (y - 20), 660, (y + 20), GOLD, 3);
      }
      this.tx((W / 2), y, lab, 20, INK);
    }
  }
  dr_ending() {
    this.tx((W / 2), 150, "TEBRİKLER!", 70, CREAM);
    this.tx((W / 2), 235, "Tüm bosslar yenildi.", 24, GOLD);
    this.tx((W / 2), 285, "Bardak artık huzur içinde çayını yudumlayabilir.", 18, CREAM);
    let [this.p.x, this.p.face] = [(W / 2), 1];
    this.p.y = GROUND;
    this.p.hp = 3;
    this.p.inv = 0;
    this.draw_player(this.p);
    this.draw_parts();
    if ((this.rt > 90) && ((Math.floor(this.t / 25) % 2) === 0)) {
      this.tx((W / 2), 400, "Enter: ana menü", 18, CREAM);
    }
  }
  loop() {
    let now = time.perf_counter();
    this.acc += Math.min((now - this.last), 0.1);
    this.last = now;
    let n = 0;
    try {
      while ((this.acc >= (1 / 60.0)) && (n < 4)) {
        this.acc -= (1 / 60.0);
        this.update();
        n += 1;
        if (this.quit) {
          return;
        }
      }
      if (n) {
        this.draw();
      }
      this.root.after(6, this.loop);
    } catch (e) {
      return;
    }
  }
}
function main() {
}
if (__name__ === "__main__") {
  main();
}

// =========================================================================
// Web Bootstrap for Game
// =========================================================================

class WebAudioSfx {
  constructor() {
    this.ctx = null;
    this.on = true;
    const init = () => {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      window.removeEventListener('keydown', init);
      window.removeEventListener('touchstart', init);
      window.removeEventListener('click', init);
    };
    window.addEventListener('keydown', init);
    window.addEventListener('touchstart', init);
    window.addEventListener('click', init);
  }

  play(name) {
    if (!this.on || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (name === "blip") {
        osc.frequency.setValueAtTime(700, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
      } else if (name === "ok") {
        osc.frequency.setValueAtTime(900, t);
        osc.frequency.linearRampToValueAtTime(1300, t + 0.09);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        osc.start(t);
        osc.stop(t + 0.09);
      } else if (name === "hurt") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.linearRampToValueAtTime(60, t + 0.28);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.start(t);
        osc.stop(t + 0.28);
      } else if (name === "parry") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1100, t);
        osc.frequency.linearRampToValueAtTime(1800, t + 0.14);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        osc.start(t);
        osc.stop(t + 0.14);
      } else if (name === "dash") {
        osc.type = "square";
        osc.frequency.setValueAtTime(500, t);
        osc.frequency.linearRampToValueAtTime(250, t + 0.08);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.08);
      } else if (name === "ko") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.7);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
        osc.start(t);
        osc.stop(t + 0.7);
      } else if (name === "go") {
        osc.frequency.setValueAtTime(500, t);
        osc.frequency.linearRampToValueAtTime(1100, t + 0.25);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.25);
      }
    } catch(e) {}
  }
}

class WebRootShim {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.handlers = {};
  }
  title(t) { document.title = t; }
  resizable(a, b) {}
  configure(kw) {}
  bind(evt, handler) {
    if (evt === "<KeyPress>") {
      window.addEventListener("keydown", (e) => {
        let key = e.key.toLowerCase();
        if (e.code.startsWith("Key")) key = e.code.slice(3).toLowerCase();
        else if (e.code.startsWith("Arrow")) key = e.code.slice(5).toLowerCase();
        else if (e.code === "Space") key = "space";
        else if (e.code === "ShiftLeft") key = "shift_l";
        else if (e.code === "ShiftRight") key = "shift_r";
        else if (e.code === "Escape") key = "escape";
        else if (e.code === "Enter") key = "return";
        handler({ keysym: key });
      });
    } else if (evt === "<KeyRelease>") {
      window.addEventListener("keyup", (e) => {
        let key = e.key.toLowerCase();
        if (e.code.startsWith("Key")) key = e.code.slice(3).toLowerCase();
        else if (e.code.startsWith("Arrow")) key = e.code.slice(5).toLowerCase();
        else if (e.code === "Space") key = "space";
        else if (e.code === "ShiftLeft") key = "shift_l";
        else if (e.code === "ShiftRight") key = "shift_r";
        else if (e.code === "Escape") key = "escape";
        else if (e.code === "Enter") key = "return";
        handler({ keysym: key });
      });
    }
  }
  after(ms, fn) { return setTimeout(fn, ms); }
  after_cancel(id) { clearTimeout(id); }
  destroy() {}
  attributes(k, v) {}
  update_idletasks() {}
  winfo_screenwidth() { return window.innerWidth; }
  winfo_screenheight() { return window.innerHeight; }
}

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const root = new WebRootShim(canvas);
  const shim = new TkCanvasShim(canvas);

  // Patch localStorage into load/store
  const origGame = Game;
  Game.prototype.load = function() {
    try {
      const data = localStorage.getItem("caycik_save");
      if (data) return JSON.parse(data);
    } catch(e) {}
    return {
      unlocked: 1,
      grades: {},
      times: {},
      coins: {},
      ver: 2,
      settings: {
        fullscreen: false, res: 0, grain: true, shake: true, sound: true, aim: "keyboard",
        diff: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        binds: {
          left: ["left", "a"], right: ["right", "d"], up: ["up", "w"], jump: ["space", "z"],
          shoot: ["x", "j"], dash: ["shift_l", "c"], ex: ["q", "e"]
        }
      }
    };
  };

  Game.prototype.store = function() {
    try {
      localStorage.setItem("caycik_save", JSON.stringify(this.save));
    } catch(e) {}
  };

  const origInit = Game.prototype.constructor;
  const game = new Game(root);
  game.cv = shim;
  game.c = new Cv(shim);
  game.sfx = new WebAudioSfx();

  // Render loop using requestAnimationFrame
  function renderLoop() {
    game.update();
    game.draw();
    // Render the shim onto the real canvas
    canvas.getContext('2d').clearRect(0, 0, W, H);
    shim.render(canvas.getContext('2d'));
    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);
});
