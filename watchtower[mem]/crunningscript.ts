import { dword, string, ptr, array32, word, bool, byte } from "./common";

export function CRunningScript(p: number) {
    return [
      ["next", dword(p + 0x0)],
      ["prev", dword(p + 0x4)],
      ["name", string(p + 0x8)],
      ["base ip", ptr(p + 0x10)],
      ["ip", ptr(p + 0x14)],
      ["stack", array32(p + 0x18, 8)],
      ["sp", word(p + 0x38)],
      ["locals", array32(p + 0x3c, 32)],
      ["timers", array32(p + 0xbc, 2)],
      ["active", bool(p + 0xc4)],
      ["cond", bool(p + 0xc5)],
      ["mission cleanup", bool(p + 0xc6)],
      ["external", bool(p + 0xc7)],
      ["text block override", bool(p + 0xc8)],
      ["external type", byte(p + 0xc9)],
      ["wake time", dword(p + 0xcc)],
      ["logical op", byte(p + 0xd0)],
      ["not flag", bool(p + 0xd2)],
      ["wasted busted check", bool(p + 0xd3)],
      ["wasted or busted", bool(p + 0xd4)],
      ["scene skip ip", ptr(p + 0xd8)],
      ["is mission", bool(p + 0xdc)],
    ];
  }
