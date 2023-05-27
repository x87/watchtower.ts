import { bool, byte, dword, ptr } from "./common";
import { opcode } from "./disasm";

const mainScm = 0x00a49960;
const missionBlock = 0x00a7a6a0;
const scriptsArray = 0x00a8b430;

export function findMission() {
  let script = scriptsArray;
  for (let i = 0; i < 96; i++) {
    let isMission = bool(/* CRunningScript->m_bIsMission */ script + 0xdc);
    if (isMission) {
      return script;
    }
    script += /* sizeof(CRunningScript) */ 0xe0;
  }
}

export function findOp(
  op: string,
  start: number
): [number, { ip: number; name: string; not: boolean; args: Array<string | number> }] {
  while (start < missionBlock + 69000 - 1) {
    const [nextIp, data] = opcode(start);
    if (data.name === op) {
      return [nextIp, data];
    }
    start = nextIp;
  }
  throw new Error(`can't find opcode ${op}`);
}

export function instapass(script) {
  let [, _0112] = findOp("HAS_DEATHARREST_BEEN_EXECUTED", missionBlock);
  let [, _gosub] = findOp("GOSUB", _0112.ip);
  let dest = missionBlock - (_gosub.args[0] as number);
  let [nextIp] = findOp("RETURN", dest);
  Memory.WriteU32(/* CRunningScript->m_pCurrentIP */ script + 0x14, nextIp, false);
}

export function CMissionCleanup(p: number) {
  let count = byte(p + 0x258);
  let objects = [];
  for (let i = 0; i < Math.min(count, 75); i++) {
    objects.push([
      `object[${i}]`,
      [
        ["type", missionCleanupTypeToString(byte(p + 0x0 + i * 4))],
        ["handle", dword(p + 0x4 + i * 4)],
      ],
    ]);
  }
  return [
    ["objects", objects],
    ["count", count],
  ];
}

export function getOnMissionFlag() {
  return byte(mainScm + dword(0x00a476ac));
}

function missionCleanupTypeToString(type) {
  switch (type) {
    case 0x0:
      return "UNUSED";
    case 0x1:
      return "CAR";
    case 0x2:
      return "CHAR";
    case 0x3:
      return "OBJECT";
    case 0x4:
      return "EFFECT_SYSTEM";
    case 0x5:
      return "PEDGROUP";
    case 0x6:
      return "THREAT_LIST";
    case 0x7:
      return "ATTRACTOR";
    case 0x8:
      return "SEQUENCE_TASK";
    case 0x9:
      return "DECISION_MAKER";
    case 0xa:
      return "FRIEND_LIST";
    case 0xb:
      return "SEARCHLIGHT";
    case 0xc:
      return "CHECKPOINT";
    case 0xd:
      return "TEXTURE_DICTIONARY";
    default:
      return "UNKNOWN";
  }
}
