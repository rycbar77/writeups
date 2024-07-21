# V8 SBX

The patch shows two powerful primitives to us: Modify trusted pointer table and leak high 32bit of binary base address. Thus we can forge bytecode array or some wasm code object with raw pointers to control the execution flow. I decided to use the bytecode array since google ctf had something similar.

The idea works as follows:

- create a function and execute it with Ignition to generate bytecode.
- modify the TPT to make the pointer point to our fake bytecode array.
- forge bytecode to store the address of an in-sandbox object to rbp, and return. This will cause stack pivoting to the memory in our control.
- satisfy some constraints during return process and prepare ROP gadgets to get shell.
