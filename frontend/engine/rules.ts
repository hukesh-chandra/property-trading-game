import { GameRules } from "./types"
import { GameSettings } from "./types"

export const classicRules: GameRules = {

  fullSetMultiplier: 2,

  startingMoney: 1500,

  startPassBonus: 200,
  startLandBonus: 400,

  incomeTaxPercent: 0.1,
  cashTaxPercent: 0.1,

  jailTurns: 2,
  jailFine: 100,

  vacationBonus: 150
}


export const publicRoom: GameSettings = {
  numberOfPlayers: 4,
  roomType: "public",
  onlyLoggedInCanJoin: false
}

export const privateRoom: GameSettings = {
  numberOfPlayers: 2,
  roomType: "private",
  onlyLoggedInCanJoin: false
}
