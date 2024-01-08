/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
async function dec() {
  const ee = 'Dugd8DbBCXnrEF1kKd2Hg4lsRQ1eV/6gQ+NfwsVhtr4UgeXQFq1m6WctmIljEG7PZg==';
  const kk = [40645774, 130661539, 116339703, 150379278];
  const tt = kk.map((e) => e.toString(16).padStart(8, '0')).join('');
  const aa = new Uint8Array(
      atob(ee)
          .split('')
          .map((e) => e.charCodeAt(0)),
  );
  const nn = Uint8Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  const rr = new TextEncoder().encode(tt);
  const cc = await crypto.subtle.importKey(
      'raw',
      rr,
      {name: 'AES-GCM'},
      false,
      ['decrypt'],
  );
  const o = await crypto.subtle.decrypt({name: 'AES-GCM', iv: nn}, cc, aa);
  console.log(new TextDecoder().decode(o));
}

dec();
