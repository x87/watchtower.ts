import { byte, float, int32, int16, int8, word } from "./common";
import sa from "../.config/sa.json";

interface Command {
  id: string;
  name: string;
  input: Array<{ type: string }>;
  output: Array<{ type: string }>;
}

export function opcodes(ip: number, n = 3): Array<[string, string]> {
  let res = [];
  for (let i = 0; i < n; i++) {
    let [nextIp, { not, name, args }] = opcode(ip);
    res.push([`${ip}: `, `${not ? "NOT " : ""}${[name, ...args].join(" ")}`]);
    ip = nextIp;
  }
  return res;
}

export function opcode(ip: number): [number, { ip: number; name: string; not: boolean; args: Array<string | number> }] {
  let id = word(ip);
  let not = false;
  if (id > 0x7fff) {
    not = true;
    id -= 0x8000;
  }
  const command = findCommand(id);
  if (command) {
    const [nextIp, args] = getArgs(command, ip + 2);
    return [
      nextIp,
      {
        ip,
        name: command.name,
        not,
        args,
      },
    ];
  }
  throw new Error(`unknown opcode 0x${id.toString(16)} at ${ip}`);
}

function findCommand(id: number): Command {
  for (const e of sa.extensions) {
    const c = (e.commands as Command[]).find((c) => parseInt(c.id, 16) == id);
    if (c) return c;
  }
}

function getArg(ip: number): [number, string | number] {
  const dt = byte(ip);
  ip += 1;
  switch (dt) {
    case 0x00: {
      return [ip, undefined];
    }
    case 0x01: {
      let arg = int32(ip);
      ip += 4;
      return [ip, arg];
    }
    case 0x02:
    case 0x0a:
    case 0x10: {
      let arg = `$${word(ip) / 4}`;
      ip += 2;
      return [ip, arg];
    }
    case 0x03:
    case 0x0b:
    case 0x11: {
      let arg = `${word(ip)}@`;
      ip += 2;
      return [ip, arg];
    }
    case 0x04: {
      let arg = int8(ip);
      ip += 1;
      return [ip, arg];
    }
    case 0x05: {
      let arg = int16(ip);
      ip += 2;
      return [ip, arg];
    }
    case 0x06: {
      let arg = float(ip);
      ip += 4;
      return [ip, arg];
    }
    case 0x07:
    case 0x08:
    case 0x0c:
    case 0x0d:
    case 0x12:
    case 0x13: {
      let arg = `<array>`;
      ip += 6;
      return [ip, arg];
    }
    case 0x9: {
      let arg = `<string>`;
      ip += 8;
      return [ip, arg];
    }
    case 0x0e: {
      let len = byte(ip);
      ip += 1;
      let arg = `<string>`;
      ip += len;
      return [ip, arg];
    }
    case 0x0f: {
      let arg = `<string>`;
      ip += 16;
      return [ip, arg];
    }
    default:
      throw new Error(`unknown data type ${dt}`);
  }
}

function getArgs(command: Command, ip: number): [number, Array<string | number>] {
  let nextIp = ip;
  const res = [];
  for (let param of [...(command.input ?? []), ...(command.output ?? [])]) {
    if (param.type === "arguments") {
      while (true) {
        const arg = getArg(nextIp);
        nextIp = arg[0];
        if (!arg[1]) {
          break;
        }
        res.push(arg[1]);
      }
    } else {
      const arg = getArg(nextIp);
      nextIp = arg[0];
      res.push(arg[1]);
    }
  }

  return [nextIp, res];
}
