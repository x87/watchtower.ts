import peds from "../../data/peds.ide";
import vehicles from "../../data/vehicles.ide";

export function ped(mi) {
  const line = peds.peds.find(([id]) => id == mi);
  return line?.[1] || "";
}

export function car(mi) {
  const line = vehicles.cars.find(([id]) => id == mi);
  return line?.[1] || "";
}

export function any(mi) {
  return ped(mi) || car(mi);
}
