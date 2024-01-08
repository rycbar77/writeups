import struct


class Func:
    def __init__(self, entry, name):
        self.name = name
        self.entry = entry
        self.body = ""

    def introduce(self):
        print(f"Function {self.name}: 0x{self.entry:x}")
        print(self.body)


class String:
    def __init__(self, entry, value):
        self.value = value
        self.entry = entry

    def introduce(self):
        print(f"String {self.entry:x}: {self.value}")


func_table = {}
string_table = {}
min_entry = 0xFFFFFFFF
s = open("./michaelpaint.bin", "rb").read()
length = len(s)
idx = 8
mode = 0
cur_func = 0
func_body = ""
regs = {0: "r0", 1: "r1", 2: "r2", 3: "r3", 4: "r4", 5: "r5", 6: "r6", 7: "r7", 8: "a"}

while idx < length:
    match mode:
        case 0:
            entry = struct.unpack("<I", s[idx : idx + 4])[0]
            if entry > length:
                mode = 1
                continue
            if entry < min_entry:
                min_entry = entry
                # print(hex(min_entry))
            func_name_len = struct.unpack("<H", s[idx + 4 : idx + 6])[0]
            func_name = s[idx + 6 : idx + 6 + func_name_len]
            # print(hex(entry), func_name_len, func_name)
            func_table[entry] = Func(entry, func_name)
            idx += 6 + func_name_len
        case 1:
            if idx >= min_entry - 1:
                mode = 2
                continue
            str_name_len = struct.unpack("<H", s[idx : idx + 2])[0]
            str_name = s[idx + 2 : idx + 2 + str_name_len]
            # print(hex(idx), hex(str_name_len), str_name)
            string_table[idx] = String(idx, str_name)
            idx += 2 + str_name_len
        case 2:
            if idx in func_table.keys():
                if cur_func != 0:
                    func_table[cur_func].body = func_body
                func_body = ""
                cur_func = idx
            op = s[idx]
            match op:
                case 0xD0:
                    # print string
                    string_pos = struct.unpack("<I", s[idx + 1 : idx + 5])[0]
                    func_body += f"0x{idx:x} print({string_table[string_pos].value})\n"
                    # print(func_body)
                    idx += 5
                case 0xD3:
                    offset = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    nbytes = struct.unpack("<B", s[idx + 2 : idx + 3])[0]
                    func_body += (
                        f"0x{idx:x} read(stdin,[{regs[offset]}],{regs[nbytes]})\n"
                    )
                    # print(func_body)
                    idx += 3
                case 0xD4:
                    reg = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    func_body += f"0x{idx:x} a=[{regs[reg]}]\n"
                    # print(func_body)
                    idx += 2
                case 0xD5:
                    reg = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    func_body += f"0x{idx:x} [{regs[reg]}]=a\n"
                    # print(func_body)
                    idx += 2
                case 0xC0:
                    # reg[op0]=reg[op1]
                    reg1 = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    reg2 = struct.unpack("<B", s[idx + 2 : idx + 3])[0]
                    func_body += f"0x{idx:x} {regs[reg1]}={regs[reg2]}\n"
                    # print(func_body)
                    idx += 3

                case 0xC1:
                    # reg[op0]=op1
                    reg = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    value = struct.unpack("<I", s[idx + 2 : idx + 6])[0]
                    func_body += f"0x{idx:x} {regs[reg]}=0x{value:x}\n"
                    # print(func_body)
                    idx += 6

                case 0xC2:
                    # a+=reg[op0]
                    reg = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    func_body += f"0x{idx:x} a+={regs[reg]}\n"
                    # print(func_body)
                    idx += 2

                case 0xC3:
                    # a-=reg[op0]
                    reg = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    func_body += f"0x{idx:x} a-={regs[reg]}\n"
                    # print(func_body)
                    idx += 2

                case 0xC4:
                    # a*=reg[op0]
                    reg = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    func_body += f"0x{idx:x} a*={regs[reg]}\n"
                    # print(func_body)
                    idx += 2

                case 0xC6:
                    # a&=reg[op0]
                    reg = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    func_body += f"0x{idx:x} a&={regs[reg]}\n"
                    # print(func_body)
                    idx += 2

                case 0xC7:
                    # a|=reg[op0]
                    reg = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    func_body += f"0x{idx:x} a|={regs[reg]}\n"
                    # print(func_body)
                    idx += 2

                case 0xC8:
                    # a^=reg[op0]
                    reg = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    func_body += f"0x{idx:x} a^={regs[reg]}\n"
                    # print(func_body)
                    idx += 2
                case 0xC9:
                    # a^=reg[op0]
                    reg = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    func_body += f"0x{idx:x} a<<={regs[reg]}\n"
                    # print(func_body)
                    idx += 2
                case 0xCA:
                    # a^=reg[op0]
                    reg = struct.unpack("<B", s[idx + 1 : idx + 2])[0]
                    func_body += f"0x{idx:x} a>>={regs[reg]}\n"
                    # print(func_body)
                    idx += 2
                case 0xE0:
                    offset = struct.unpack("<I", s[idx + 1 : idx + 5])[0]
                    func_body += f"0x{idx:x} goto 0x{offset:x}\n"
                    # print(func_body)
                    idx += 5
                case 0xE1:
                    offset = struct.unpack("<I", s[idx + 1 : idx + 5])[0]
                    reg = struct.unpack("<B", s[idx + 5 : idx + 6])[0]
                    func_body += f"0x{idx:x} if a!={regs[reg]}: goto 0x{offset:x}\n"
                    # print(func_body)
                    idx += 6
                case 0xE2:
                    offset = struct.unpack("<I", s[idx + 1 : idx + 5])[0]
                    reg = struct.unpack("<B", s[idx + 5 : idx + 6])[0]
                    func_body += f"0x{idx:x} if a=={regs[reg]}: goto 0x{offset:x}\n"
                    # print(func_body)
                    idx += 6
                case 0xE5:
                    offset = struct.unpack("<I", s[idx + 1 : idx + 5])[0]
                    reg = struct.unpack("<B", s[idx + 5 : idx + 6])[0]
                    func_body += f"0x{idx:x} if {regs[reg]}>=a: goto 0x{offset:x}\n"
                    # print(func_body)
                    idx += 6
                case 0xF0:
                    func_offset = struct.unpack("<I", s[idx + 1 : idx + 5])[0]
                    func_name = s[
                        func_offset
                        + 2 : func_offset
                        + 2
                        + struct.unpack("<H", s[func_offset : func_offset + 2])[0]
                    ]
                    func_body += f"0x{idx:x} {func_name.decode()}()\n"
                    # print(func_body)
                    idx += 5
                case 0xF1:
                    func_body += f"0x{idx:x} return\n"
                    # print(func_body)
                    idx += 1
                case 0xF2:
                    func_body += f"0x{idx:x} exit()\n"
                    # print(func_body)
                    idx += 1
                case _:
                    print(f"unknown key 0x{idx:x} 0x{s[idx]:x}")
                    break
            # break
if cur_func != 0:
    func_table[cur_func].body = func_body

for i in func_table.items():
    i[1].introduce()

# for i in string_table.items():
#     i[1].introduce()
