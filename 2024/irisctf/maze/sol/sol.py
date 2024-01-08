from z3 import *

dic = {}
direction = {37: "l", 38: "u", 39: "r", 40: "d"}
for i in [37, 38, 39, 40]:
    dic[bin(i & 3)[2:].rjust(2, "0")] = direction[i]

# print(dic)

keys = []
objs = [
    [
        [
            -0.035712653158569425,
            -0.03287257405769594,
            0.02334270751557671,
            -0.02540569009549741,
        ],
        [
            0.006411543162643718,
            0.02983176158440242,
            0.02174280291361509,
            0.0067315240830360425,
        ],
        [
            -0.010545458159016606,
            -0.00814858244477348,
            -0.042581311921773606,
            0.020546352515626396,
        ],
        [
            -0.033596009182061196,
            -0.000705547992169411,
            0.02680088640677326,
            -0.051391718257793324,
        ],
    ],
    [
        [
            0.17638922081966382,
            0.09011377379943657,
            -0.2507513705723452,
            -0.14779730737755375,
        ],
        [
            0.055901970582484195,
            0.015708171290764118,
            -0.08718795489603928,
            -0.034523214634888215,
        ],
        [
            -0.08558020292437048,
            -0.07923610054967736,
            0.17700480152953701,
            0.08977339387750669,
        ],
        [
            -0.1294747286013282,
            -0.05801667137404857,
            0.20491595512778732,
            0.13903433491935893,
        ],
    ],
    [
        [
            -1.4436222005842259,
            0.33729308666017527,
            0.5668938656280429,
            -1.2835443037974683,
        ],
        [
            5.040019474196689,
            -1.136222005842259,
            -1.895520934761441,
            4.410126582278481,
        ],
        [
            2.833203505355404,
            -0.6585199610516066,
            -1.0631937682570594,
            2.4658227848101264,
        ],
        [
            -1.0833495618305744,
            0.23018500486854918,
            0.4296007789678676,
            -0.9417721518987342,
        ],
    ],
    [
        [
            -0.30391992395012024,
            0.37225297768830734,
            0.10770005032712632,
            0.18833529049935693,
        ],
        [
            0.2496784655818375,
            -0.27545713806408323,
            -0.055359838953195774,
            -0.15288262595761337,
        ],
        [
            -0.027456243359615277,
            0.10879047139741654,
            0.055359838953195774,
            0.09732707040205782,
        ],
        [
            0.20058155790415477,
            -0.2713470894145278,
            -0.11726220432813286,
            -0.1713079460940558,
        ],
    ],
]


def cal_once(A_values):
    b = [[Real(f"b{i+1}{j+1}") for j in range(4)] for i in range(4)]
    I = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]

    constraints = [
        Sum([A_values[i][k] * b[k][j] for k in range(4)]) == I[i][j]
        for i in range(4)
        for j in range(4)
    ]

    solver = Solver()

    solver.add(constraints)

    if solver.check() == sat:
        model = solver.model()
        result = [
            [model.evaluate(b[i][j]).as_decimal(prec=10) for j in range(4)]
            for i in range(4)
        ]
        path = ""
        for i in result:
            for ii in i:
                path += bin(round(float(ii[:-1])) + 32)[2:].rjust(6, "0")
        x = -7
        y = -7
        k = 0
        real_path = ""
        for i in range(0, len(path), 2):
            cur = path[i : i + 2]
            real_path += dic[cur]
        for i in real_path:
            match i:
                case "l":
                    x -= 1
                case "r":
                    x += 1
                case "u":
                    y -= 1
                case "d":
                    y += 1
            k = (k + 211 * (x + 9) * (y + 9) * 239) & 4294967295
        return k
    else:
        print("No")


for mat in objs:
    keys.append(cal_once(mat))

print(keys)