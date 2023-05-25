import { bool, dword, field, word } from "./common";
import { any } from "./ide";

export function CPool(p: number) {
  return [
    ["m_pObjects", dword(p + 0x0)],
    ["m_byteMap", dword(p + 0x4)],
    ["m_nSize", dword(p + 0x8)],
    ["top", dword(p + 0xc)],
    ["m_bOwnsAllocations", bool(p + 0x10)],
    ["bLocked", bool(p + 0x11)],
  ];
}

export function CPoolExpanded(p: number, pool, showEmptyPoolElems) {
  const size = dword(p + 0x8);

  const elems = [];
  const flags = [];
  for (let i = 0; i < size; i++) {
    let flag = pool.getFlag(i);
    const isFree = flag & 0x80;
    if (isFree) {
      if (!showEmptyPoolElems) {
        continue;
      }
      elems.push([`m_pObjects[${i}]`, "<empty>"]);
    }
    flags.push([`m_byteMap[${i}]`, flag]);
    const addr = pool.getEntity(i);
    const mi = word(addr + 0x22);

    elems.push([
      `m_pObjects[${i}]`,
      [
        ["entity", addr],
        ["model", `${mi} ${wrap(any(mi))}`],
      ],
    ]);
  }
  return [
    ...elems,
    ...flags,
    ["m_nSize", dword(p + 0x8)],
    ["top", dword(p + 0xc)],
    ["m_bOwnsAllocations", bool(p + 0x10)],
    ["bLocked", bool(p + 0x11)],
  ];
}

function wrap(text) {
  if (!text) return text;
  return `(${text})`;
}
