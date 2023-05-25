import { byte, dword, word } from "./common";
import sa from "../.config/sa.json";

export function opcode(ip: number) {
  let res = [];
  for (let i = 0; i < 3; i++) {
    let id = word(ip);
    let not = false;
    if (id > 0x7fff) {
      not = true;
      id -= 0x8000;
    }

    const command = findCommand(id);
    if (command) {
      const [nextIp, args] = getArgs(command, ip + 2);
      res.push([`${ip}: `, `${not ? "NOT " : ""}${command.name} ${args.join(" ")}`]);
      ip = nextIp;
    } else {
      log(`can't find command for id ${id} at ${ip}`);
    }
  }

  return res;
}

function findCommand(id: number) {
  for (const e of sa.extensions) {
    const c = e.commands.find((c) => parseInt(c.id, 16) == id);
    if (c) return c;
  }
}

function getArg(ip) {
  const dt = byte(ip);
  ip += 1;
  switch (dt) {
    case 1: {
      let arg = dword(ip);
      ip += 4;
      return [ip, arg];
    }
    case 2: {
      let arg = `$${word(ip) / 4}`;
      ip += 2;
      return [ip, arg];
    }
    case 3: {
      let arg = `${word(ip)}@`;
      ip += 2;
      return [ip, arg];
    }
    case 4: {
      let arg = byte(ip);
      ip += 1;
      return [ip, arg];
    }
    case 5: {
      let arg = word(ip);
      ip += 2;
      return [ip, arg];
    }
    default:
      throw new Error(`unknown data type ${dt}`);
  }
}

function getArgs(command, ip) {
  let nextIp = ip;
  const res = [];
  for (let i = 0; i < command.num_params; i++) {
    const arg = getArg(nextIp);
    nextIp = arg[0];
    res.push(arg[1]);
  }

  return [nextIp, res];
}
