import { dword, array8, byte, array16, float, word, ptr, bool } from "./common";

export function CVehicle(p: number) {
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
