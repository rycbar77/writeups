function func(a) {
  label: if (a == 1) {
    let a1 = 1;
    let a2 = 1;
    let a3 = 1;
    let a4 = 1;
    break label;
  }
  label2: if (a == 1) {
    let a1 = 1;
    break label2;
  }
  let a2 = 5.27353071347005312808470611646e-179;
  let a3 = 8.73802723135704617618557676906e-1;
  let a4 = 1.10715770873430208176557698607;
  let a5 = 4.17238737852872382678707803996e-150;
  let a6 = 2.63486047652296056448306022844e-284;
  return 0x78537865;
}

for (var i = 0; i < 0x100000; i++) {
  func(false);
  func(false);
  func(false);
  func(false);
}

func(true);
