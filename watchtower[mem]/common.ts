export function array8(p: number, n: number) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(byte(p + i));
  }
  return arr;
}

export function array16(p: number, n: number) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(word(p + i * 2));
  }
  return arr;
}

export function array32(p: number, n: number) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(dword(p + i * 4));
  }
  return arr;
}

export function dword(p: number) {
  return Memory.ReadU32(p, false);
}

export function word(p: number) {
  return Memory.ReadU16(p, false);
}

export function byte(p: number) {
  return Memory.ReadU8(p, false);
}

export function bool(p: number) {
  return byte(p) !== 0;
}

export function ptr(p: number) {
  return dword(p);
}

export function string(p: number) {
  return Memory.ReadUtf8(p);
}

export function float(p: number) {
  return Memory.ReadFloat(p, false);
}

export function field(struct, path: string) {
  const parts = path.split(".");

  let cur = parts.shift();
  let res = struct;

  while (cur) {
    for (const [n, v] of res) {
      if (n === cur) {
        res = v;
        break;
      }
    }
    cur = parts.shift();
  }

  return res;
}
