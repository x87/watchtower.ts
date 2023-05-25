import { ImGuiCond, KeyCode } from "../.config/enums";
import { ObjectPool, PedPool, VehiclePool } from "./scm";
import { CRunningScript } from "./crunningscript";

import { Tabs, Window } from "./window";
import { CVehicle } from "./cvehicle";
import { CPool, CPoolExpanded } from "./cpool";
import { ptr } from "./common";

let p = new Player(0);
let char = p.getChar();
let windows: Window[] = [new Window()];

while (true) {
  wait(0);
  ImGui.BeginFrame("WatchTower");
  ImGui.SetCursorVisible(true);

  windows.forEach((w) => {
    ImGui.SetNextWindowSize(400, 600, ImGuiCond.FirstUseEver);
    w.visible = ImGui.Begin(w.identifier("WatchTower"), w.visible, false, false, false, false);

    let tab = ImGui.Tabs(w.identifier("Tabs"), w.tabs.join(","));
    const tabName = w.tabs[tab];

    switch (tabName) {
      case Tabs.Scripts: {
        if (w.activeScript) {
          w.renderScript(CRunningScript(w.activeScript));
        }
        break;
      }
      case Tabs.Vehicle: {
        if (char.isInAnyCar()) {
          let carHandle = +char.storeCarIsInNoSave();
          let addr = VehiclePool.getAt(carHandle);
          w.renderStruct(CVehicle(addr));
        } else {
          ImGui.TextColored("Not in any car", 255, 255, 0, 255);
        }
        break;
      }
      case Tabs.Pools: {
        let pools = [
          ["PedPool", ptr(0x00b74490), PedPool],
          ["VehiclePool", ptr(0x00b74494), VehiclePool],
          ["ObjectPool", ptr(0x00b7449c), ObjectPool],
        ];
        pools.forEach(([name, ptr, pool]) => {
          w.label(name);
          if (w.activePool === name) {
            if (w.button("Collapse", 60)) {
              w.activePool = undefined;
            }
            ImGui.SameLine();
            if (w.button(w.showEmptyPoolElems ? "Hide empty" : "Show all", 70)) {
              w.showEmptyPoolElems = !w.showEmptyPoolElems;
            }
            w.renderStruct(CPoolExpanded(ptr as int, pool, w.showEmptyPoolElems));
          } else {
            w.renderPool(CPool(ptr as int), name);
          }
          ImGui.Separator();
        });

        break;
      }
    }
  });
  ImGui.EndFrame();

  // remove invisible windows
  if (windows.some((w) => !w.visible)) {
    windows = windows.filter((w) => w.visible);
  }

  // Ctrl+C to open new window
  if (Pad.IsKeyPressed(KeyCode.Ctrl) && Pad.IsKeyDown(KeyCode.C)) {
    windows.push(new Window());
  }
}
