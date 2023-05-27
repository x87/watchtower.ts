import { field, ptr } from "./common";
import { opcodes } from "./disasm";
import { CMissionCleanup, findMission, getOnMissionFlag, instapass } from "./mission";

export enum Tabs {
  Scripts = "Scripts",
  Mission = "Mission",
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

  constructor(readonly tabs = Object.values(Tabs)) {}

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
    try {
      let next3ops = opcodes(field(struct, "ip"), 3);
      this.renderStruct(next3ops);
    } catch (e) {
      this.label("Failed to disassemble instructions: " + e.toString());
    }

    // if (field(struct, "is mission")) {

    // }
  }

  renderPool(struct, poolName: string) {
    if (this.button(`Expand##${poolName}`)) {
      this.activePool = poolName;
    }
    struct.forEach(([label, value], i) => {
      this.label(label);
      ImGui.SameLine();
      ImGui.Text(value.toString());
    });
  }

  renderMission() {
    this.label("Mission Cleanup List");
    this.renderStruct(CMissionCleanup(0x00a90850));
    ImGui.Separator();
    this.renderStruct([["$ONMISSION", getOnMissionFlag()]]);
    let mission = findMission();
    if (mission) {
      if (this.button("Instapass", 80)) {
        try {
          instapass(mission);
        } catch (e) {
          log("Instapass failed: ", e);
        }
      }
    }
  }
}
