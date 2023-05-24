import { ImGuiCond } from "../.config/enums";
import { VehiclePool } from "./scm";

let p = new Player(0);
let char = p.getChar();
let menuShow = true;
let activeScript = ptr(0x00a8b42c); // activeScripts
while (true) {
  wait(0);
  ImGui.BeginFrame("WatchTower");
  ImGui.SetCursorVisible(true);
  ImGui.SetNextWindowSize(400, 600, ImGuiCond.FirstUseEver);
  menuShow = ImGui.Begin("WatchTower", menuShow, false, false, false, false);

  let tab = ImGui.Tabs("Tabs", "Scripts, Vehicle");

  if (activeScript && tab === 0) {
    renderScript(CRunningScript(activeScript));
  }

  if (tab === 1) {
    if (char.isInAnyCar()) {
      let carHandle = +char.storeCarIsInNoSave();
      let addr = VehiclePool.getAt(carHandle);
      renderStruct(CVehicle(addr));
    } else {
      ImGui.TextColored("Vehicle", 255, 255, 0, 255);
      ImGui.SameLine();
      ImGui.Text("Not in any car");
    }
  }
  ImGui.EndFrame();
}

function renderStruct(struct, level = 0) {
  struct.forEach(([label, value]) => {
    ImGui.TextColored(("".padStart(level * 4) + label) as string, 255, 255, 0, 255);
    if (Array.isArray(value) && Array.isArray(value[0])) {
      renderStruct(value, level + 1);
    } else {
      ImGui.SameLine();
      ImGui.Text(value.toString());
    }
  });
}

function renderScript(struct) {
  struct.forEach(([label, value], i) => {
    ImGui.TextColored(label as string, 255, 255, 0, 255);
    ImGui.SameLine();
    ImGui.Text(value.toString());

    // next
    if (i === 0 && value !== 0) {
      ImGui.SameLine();
      if (ImGui.Button(">>>", 45, 20)) {
        activeScript = value;
      }
    }
    // prev
    if (i === 1 && value !== 0) {
      ImGui.SameLine();
      if (ImGui.Button("<<<", 45, 20)) {
        activeScript = value;
      }
    }
  });

  ImGui.Separator();
  ImGui.Spacing();
}

function array32(p: number, n: number) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(dword(p + i * 4));
  }
  return arr;
}

function array8(p: number, n: number) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(byte(p + i));
  }
  return arr;
}

function array16(p: number, n: number) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(word(p + i * 2));
  }
  return arr;
}

function dword(p: number) {
  return Memory.ReadU32(p, false);
}

function word(p: number) {
  return Memory.ReadU16(p, false);
}

function byte(p: number) {
  return Memory.ReadU8(p, false);
}

function bool(p: number) {
  return byte(p) !== 0;
}

function ptr(p: number) {
  return dword(p);
}

function string(p: number) {
  return Memory.ReadUtf8(p);
}

function float(p: number) {
  return Memory.ReadFloat(p, false);
}

function CRunningScript(p: number) {
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

function CVehicle(p: number) {
  return [
    ["entity", CEntity(p)],
    ["m_vehicleAudio", dword(p + 0x138)],
    ["m_pHandlingData", dword(p + 0x384)],
    ["m_pFlyingHandlingData", dword(p + 0x388)],
    ["m_nHandlingFlags", dword(p + 0x38c)],
    ["m_autoPilot", dword(p + 0x390)],

    ["m_nFlags", array8(p + 0x428, 8)],
    ["m_nCreationTime", dword(p + 0x430)],
    ["m_nPrimaryColor", byte(p + 0x434)],
    ["m_nSecondaryColor", byte(p + 0x435)],
    ["m_nTertiaryColor", byte(p + 0x436)],
    ["m_nQuaternaryColor", byte(p + 0x437)],
    ["m_anExtras", array8(p + 0x438, 2)],
    ["m_anUpgrades", array16(p + 0x43a, 15)],
    ["m_fWheelScale", float(p + 0x458)],
    ["m_nAlarmState", word(p + 0x45c)],
    ["m_nForcedRandomRouteSeed", word(p + 0x45e)],
    ["m_pDriver", ptr(p + 0x460)],
    ["m_apPassengers", array8(p + 0x464, 8)],
    ["m_nNumPassengers", byte(p + 0x484)],
    ["m_nNumGettingIn", byte(p + 0x485)],
    ["m_nGettingInFlags", byte(p + 0x486)],
    ["m_nGettingOutFlags", byte(p + 0x487)],
    ["m_nMaxPassengers", byte(p + 0x488)],
    ["m_nWindowsOpenFlags", byte(p + 0x489)],
    ["m_nNitroBoosts", byte(p + 0x48a)],
    ["m_nSpecialColModel", byte(p + 0x48b)],
    ["m_pEntityWeAreOn", ptr(p + 0x48c)],
    ["m_pFire", ptr(p + 0x490)],
    ["m_fSteerAngle", float(p + 0x494)],
    ["m_f2ndSteerAngle", float(p + 0x498)],
    ["m_fGasPedal", float(p + 0x49c)],
    ["m_fBreakPedal", float(p + 0x4a0)],
    ["m_nCreatedBy", byte(p + 0x4a4)],
    ["m_nExtendedRemovalRange", word(p + 0x4a6)],
    ["m_nBombLightsWinchFlags", byte(p + 0x4a8)],
  ];
}

function CPlaceable(p: number) {
  return [
    ["vtable", dword(p + 0x0)],
    ["placement", dword(p + 0x4)],
    ["matrix", dword(p + 0x18)],
  ];
}

function CVector(p: number) {
  return [
    ["x", float(p + 0x0)],
    ["y", float(p + 0x4)],
    ["z", float(p + 0x8)],
  ];
}

function CQuaternion(p: number) {
  return [
    ["x", float(p + 0x0)],
    ["y", float(p + 0x4)],
    ["z", float(p + 0x8)],
    ["w", float(p + 0xc)],
  ];
}

function CEntity(p: number) {
  return [
    ["placeable", CPlaceable(p)],
    ["object", dword(p + 0x18)],
    ["m_nFlags", dword(p + 0x1c)],
    ["m_nRandomSeed", word(p + 0x20)],
    ["m_nModelIndex", word(p + 0x22)],
    ["m_pReferences", dword(p + 0x24)],
    ["m_pStreamingLink", dword(p + 0x28)],
    ["m_nLastScanCode", word(p + 0x2c)],
    ["m_iplIndex", byte(p + 0x2e)],
    ["m_nbInterior", byte(p + 0x2f)],
    ["m_pLod", dword(p + 0x30)],
    ["m_bNumLodChildren", byte(p + 0x34)],
    ["m_bNumLodChildrenRendered", byte(p + 0x35)],
    ["m_nTypeStatus", byte(p + 0x36)],
    ["field_34", dword(p + 0x38)],
    ["m_dwLastCollisionTime", dword(p + 0x3c)],
    ["m_dwFlags", dword(p + 0x40)],
    ["m_vecMoveSpeed", CVector(p + 0x44)],
    ["m_vecTurnSpeed", CVector(p + 0x50)],
    ["m_vecFrictionMoveSpeed", CVector(p + 0x5c)],
    ["m_vecFrictionTurnSpeed", CVector(p + 0x68)],
    ["m_vecForce", CVector(p + 0x74)],
    ["m_vecTorque", CVector(p + 0x80)],
    ["m_fMass", float(p + 0x8c)],
    ["m_fTurnMass", float(p + 0x90)],
    ["m_fVelocityFrequency", float(p + 0x94)],
    ["m_fAirResistance", float(p + 0x98)],
    ["m_fElasticity", float(p + 0x9c)],
    ["m_fBuoyancyConstant", float(p + 0xa0)],
    ["m_vecCentreOfMass", CVector(p + 0xa4)],
    ["m_pCollisionList", dword(p + 0xb0)],
    ["m_pMovingList", dword(p + 0xb4)],
    ["m_bFakePhysics", bool(p + 0xb8)],
    ["m_nNumEntitiesCollided", byte(p + 0xb9)],
    ["m_nContactSurface", byte(p + 0xba)],
    ["field_BB", byte(p + 0xbb)],
    ["m_apCollidedEntities", dword(p + 0xbc)],
    ["m_fMovingSpeed", float(p + 0xd4)],
    ["m_fDamageIntensity", float(p + 0xd8)],
    ["m_pDamageEntity", dword(p + 0xdc)],
    ["m_vLastCollisionDirection", CVector(p + 0xe0)],
    ["m_vecLastCollisionPosn", CVector(p + 0xec)],
    ["m_nDamagedPart", word(p + 0xf8)],
    ["field_FA", word(p + 0xfa)],
    ["m_pAttachedTo", dword(p + 0xfc)],
    ["m_vAttachOffset", CVector(p + 0x100)],
    ["m_vAttachRotation", CVector(p + 0x10c)],
    ["m_qAttachRotation", CQuaternion(p + 0x118)],
    ["EntityIgnoredCollision", dword(p + 0x128)],
    ["m_fContactSurfaceBrightness", float(p + 0x12c)],
    ["m_fDynamicLighting", float(p + 0x130)],
    ["m_pShadowData", dword(p + 0x134)],
  ];
}
