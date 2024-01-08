from pwn import *
from base64 import b64encode
# s=open("./example.bin","rb").read()
s = open("./michaelpaint.bin", "rb").read()
r = remote("cloudvm.chal.irisc.tf", 10201)
r.recvuntil("base64 encoded:")
r.sendline(b64encode(s))
r.interactive()