/* eslint-disable space-before-function-paren */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
/* eslint-disable require-jsdoc */
/* eslint-disable indent */
/* eslint-disable one-var */
/* eslint-disable operator-linebreak */
/* eslint-disable object-curly-spacing */
/* eslint-disable no-var */
const e = document.getElementById("c"),
  t = e.getContext("2d"),
  a = [
    [...Array(4).keys()].map((e) =>
      [
        -17969, -16540, 11745, -12783, 3226, 15010, 10940, 3387, -5306, -4100,
        -21425, 10338, -16904, -355, 13485, -25858,
      ]
        .map((e) => e / 503155)
        .slice(4 * e, 4 * e + 4)
    ),
    [...Array(4).keys()].map((e) =>
      [
        24356, 12443, -34624, -20408, 7719, 2169, -12039, -4767, -11817, -10941,
        24441, 12396, -17878, -8011, 28295, 19198,
      ]
        .map((e) => e / 138081)
        .slice(4 * e, 4 * e + 4)
    ),
    [...Array(4).keys()].map((e) =>
      [
        -14826, 3464, 5822, -13182, 51761, -11669, -19467, 45292, 29097, -6763,
        -10919, 25324, -11126, 2364, 4412, -9672,
      ]
        .map((e) => e / 10270)
        .slice(4 * e, 4 * e + 4)
    ),
    [...Array(4).keys()].map((e) =>
      [
        -10870, 13314, 3852, 6736, 8930, -9852, -1980, -5468, -982, 3891, 1980,
        3481, 7174, -9705, -4194, -6127,
      ]
        .map((e) => e / 35766)
        .slice(4 * e, 4 * e + 4)
    ),
  ],
  n = "Dugd8DbBCXnrEF1kKd2Hg4lsRQ1eV/6gQ+NfwsVhtr4UgeXQFq1m6WctmIljEG7PZg==",
  r = [
    "toy cube",
    "laser pointer",
    "large axle",
    "gift box",
    "dust pan",
    "tea kettle",
    "v-type engine",
    "stop sign",
  ],
  i = {
    a: 0,
    b: 0,
    c: [0, 0, 0, 0],
    d: [38, 40, 37, 39],
    e: [],
    f: { x: 40, y: 40, z: [] },
    g: { x: -7, y: -7 },
    h: [],
    i: [],
    j: 1,
    k: 0,
    l: "",
  };
function c(e) {
  let t = e + 1831565813;
  return (
    (t = Math.imul(t ^ (t >>> 15), 1 | t)),
    (t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)),
    ((t ^ (t >>> 14)) >>> 0) / 4294967296
  );
}
function o(e, a, n, r, c = 1) {
  (t.fillStyle = `rgba(${[0].reduce(
    (e, t) => e.slice((c - 1) % 3).concat(e.slice(0, (c - 1) % 3)),
    [25, 255 * s(i.a, a / 500), 25]
  )}, 255)`),
    t.fillRect(e, a, n, r);
}
function y() {
  if (
    ((i.g = i.c.reduce(
      (e, t, a) =>
        1 === t
          ? {
              x:
                e.x +
                (a < 2 || 1 & i.f.z[i.g.y + 7][i.g.x + 7 + (a - 2)]
                  ? 0
                  : 2 * (a - 2) - 1),
              y:
                e.y +
                (a >= 2 || 2 & i.f.z[i.g.y + 7 + a][i.g.x + 7] ? 0 : 2 * a - 1),
            }
          : { x: e.x, y: e.y },
      { x: i.g.x, y: i.g.y }
    )),
    i.c.some((e) => 1 === e))
  ) {
    (i.j <<= 2),
      (i.j |= 3 & i.d[i.c.findIndex((e) => 1 === e)]),
      i.j >= 64 && (i.i.push((63 & i.j) - 32), (i.j = 1)),
      (i.k = (i.k + 211 * (i.g.x + 9) * (i.g.y + 9) * 239) & 4294967295),
      16 == i.i.length &&
        1 === i.j &&
        i.e.push(
          "1,6,11,16" ==
            ((e = [...Array(4).keys()].map((e) => i.i.slice(4 * e, 4 * e + 4))),
            (t = a[i.b]),
            e.map((e) =>
              t[0]
                .map((e, a) => t.map((e) => e[a]))
                .map((t) =>
                  e.map((a, n) => e[n] * t[n]).reduce((e, t) => e + t)
                )
            ))
              .flatMap((e) => e)
              .map((e) => Math.round(100 * e) / 100)
              .map((e, t) => (1 === e ? t + 1 : e))
              .filter((e) => e)
            ? i.k
            : -1
        );
    const r = i.h.findIndex((e) => e.x === i.g.x && e.y === i.g.y);
    if (-1 !== r) {
      const e = i.h[r].name;
      i.h.splice(r, 1),
        (i.l = `found ${e}!`),
        setTimeout(() => {
          i.l = "";
        }, 4e3);
    }
    i.g.x === i.f.x - 9 &&
      i.g.y === i.f.y - 9 &&
      ((i.g.x = -7),
      (i.g.y = -7),
      (i.i = []),
      (i.j = 1),
      (i.k = 0),
      f(++i.b),
      4 !== i.b ||
        4 !== i.e.length ||
        i.e.some((e) => -1 === e) ||
        (async function (e) {
          const t = i.e.map((e) => e.toString(16).padStart(8, "0")).join(""),
            a = new Uint8Array(
              atob(e)
                .split("")
                .map((e) => e.charCodeAt(0))
            ),
            n = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
            r = new TextEncoder().encode(t),
            c = await crypto.subtle.importKey(
              "raw",
              r,
              { name: "AES-GCM" },
              false,
              ["decrypt"]
            ),
            o = await crypto.subtle.decrypt({ name: "AES-GCM", iv: n }, c, a);
          return new TextDecoder().decode(o);
        })(n).then((e) => (i.l = e)));
  }
  var e, t;
  i.c = i.c.map((e) => (1 & e ? 3 : 0));
}
function l() {
  var a;
  t.clearRect(0, 0, e.width, e.height),
    o(e.width / 2 - 4, e.height / 2 - 4, 8, 8),
    i.h.forEach((t) => {
      o(
        e.width / 2 - 4 + 40 * (t.x - i.g.x),
        e.height / 2 - 4 + 40 * (t.y - i.g.y),
        8,
        8,
        2
      );
    }),
    [...Array(i.f.y).keys()].forEach((e) => {
      [...Array(i.f.x).keys()].forEach((t) => {
        0 != (2 & i.f.z[e][t]) && o(40 * (t - i.g.x), 40 * (e - i.g.y), 40, 1),
          0 != (1 & i.f.z[e][t]) &&
            o(40 * (t - i.g.x), 40 * (e - i.g.y), 1, 40);
      });
    }),
    (a = i.l),
    (t.textAlign = "center"),
    (t.font = "32px monospace"),
    (t.fillStyle = "rgba(25, 255, 25, 255)"),
    t.fillText(a, e.width / 2, e.height / 2);
}
function f(e) {
  (i.f.z = [...Array(i.f.y).keys()]
    .map((t) =>
      [...Array(i.f.x - 1).keys()].reduce(
        (a, n) =>
          t > 0 && t < i.f.x - 1 && c(23 * n + 7 * t + 3 * e) > 0.5 == 0
            ? [
                [
                  ...a[0].slice(
                    0,
                    a[1] +
                      Math.floor(c(17 * n + 9 * t + 3 * e) * (n - a[1] + 1))
                  ),
                  1 |
                    a[0][
                      a[1] +
                        Math.floor(c(17 * n + 9 * t + 3 * e) * (n - a[1] + 1))
                    ],
                  ...a[0].slice(
                    a[1] +
                      Math.floor(c(17 * n + 9 * t + 3 * e) * (n - a[1] + 1)) +
                      1
                  ),
                ],
                n + 1,
              ]
            : [[...a[0].slice(0, n), 2 | a[0][n], ...a[0].slice(n + 1)], a[1]],
        [
          t < i.f.x - 1
            ? [1, ...new Array(i.f.x - 2).fill(0), 1]
            : new Array(i.f.x).fill(0),
          0,
        ]
      )
    )
    .map((e) => e[0])),
    (i.h = [...Array(6).keys()].map((t) => ({
      x: Math.floor(30 * c(17 * t + 23 * e)),
      y: Math.floor(30 * c(23 * t + 17 * e)),
      name: r[Math.floor(8 * c(3 * t + 21 * e))],
    })));
}
function s(e, t, a = 800, n = 0.6, r = 0.03) {
  const i = (e + t) % a;
  return (
    (0.8 + Math.sin(7 * e) * r) *
    Math.min(1, n + Math.max(0, 0.009 * (i - a / 2) ** 2))
  );
}
(e.width = 600),
  (e.height = 600),
  (document.onkeydown = (e) => {
    i.c[i.d.indexOf(e.keyCode)] |= 1;
  }),
  (document.onkeyup = (e) => {
    i.c[i.d.indexOf(e.keyCode)] = 0;
  }),
  f(i.b),
  (function e() {
    y(), l(), i.a++, requestAnimationFrame(e);
  })();
