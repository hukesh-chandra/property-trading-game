export type Player = {
  id: string
  name: string
  balance: number
  position: number
  properties: Set<string>
  status: "normal" | "jail" | "vacation" | "bankrupt"
  color: string
}


export type RentRule =
  | { type: "normal"; rents: number[]; houseCost: number[]; houseSellValue: number[] }
  | { type: "diceMultiplier"; multiplier: number[] }
  | { type: "groupScaling"; rentPerOwned: number[] }

export type Property = {
  id: string
  name: string
  price: number
  ownerId?: string
  level: number
  colorGroup: string
  rentRule: RentRule
  isMortgaged: boolean
  mortgageValue: number
}


export type Tile =
  | { type: "start" }
  | { type: "property"; propertyId: string }
  | { type: "incomeTax" }
  | { type: "cashTax" }
  | { type: "vacation" }
  | { type: "jail" }
  | { type: "chance" }
  | { type: "treasure" }
  | { type: "goToJail" }

