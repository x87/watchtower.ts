import { field, ptr } from "./common";
import { opcodes } from "./crunningscript";
import { opcode } from "./disasm";

export enum Tabs {
  Scripts = "Scripts",
  Vehicle = "Vehicle",
  Pools = "Pools",
}

let id = 0;
export class Window {
  activeScript = ptr(0x00a8b42c);
  activePool;
  id: number = id++;
  visible: boolean = true;
  showEmptyPoolElems = false;

  constructor(readonly tabs = [Tabs.Scripts, Tabs.Vehicle, Tabs.Pools]) {}

  identifier(name, uniqueId = this.id) {
    if (name.includes("##")) return name;
    return `${name}##${uniqueId}`;
  }

  label(text, level = 0) {
    ImGui.TextColored(("".padStart(level * 4) + text) as string, 255, 255, 0, 255);
  }

  button(text, width = 45, height = 20) {
    return ImGui.Button(this.identifier(text), width, height);
  }

  renderStruct(struct, level = 0) {
    struct.forEach(([label, value]) => {
      this.label(label, level);
      if (Array.isArray(value) && Array.isArray(value[0])) {
        this.renderStruct(value, level + 1);
      } else {
        ImGui.SameLine();
        ImGui.Text(value.toString());
      }
    });
  }

  renderScript(struct) {
    struct.forEach(([label, value], i) => {
      this.label(label);
      ImGui.SameLine();
      ImGui.Text(value.toString());

      // next button
      if (i === 0 && value !== 0) {
        ImGui.SameLine();
        if (this.button(">>>")) {
          this.activeScript = value;
        }
      }
      // prev button
      if (i === 1 && value !== 0) {
        ImGui.SameLine();
        if (this.button("<<<")) {
          this.activeScript = value;
        }
      }
    });

    ImGui.Separator();
    this.label("Next 3 instructions:");
    this.renderStruct(opcode(field(struct, "ip"))); 
  }

  renderPool(struct, poolName) {
    if (this.button(`Expand##${poolName}`)) {
      this.activePool = poolName;
    }
    struct.forEach(([label, value], i) => {
      this.label(label);
      ImGui.SameLine();
      ImGui.Text(value.toString());
    });
  }
}
