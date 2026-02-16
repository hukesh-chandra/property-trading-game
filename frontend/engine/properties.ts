import { Property } from "./types"

export const properties: Record<string, Property> = {
  p1: {
    id: "p1",
    name: "Alexandria",
    price: 60,
    level: 0,
    colorGroup: "Egypt",
    rentRule: { type: "normal", rents: [2, 6,10, 30, 90, 160, 250], houseCost: [50, 50, 50, 50, 75], houseSellValue: [25, 25, 25, 25, 35] },
    mortgageValue: 30,
    isMortgaged: false
  },

  p2: {
    id: "p2",
    name: "Cairo",
    price: 60,
    level: 0,
    colorGroup: "Egypt",
    rentRule: { type: "normal", rents: [4, 12, 20, 60, 180, 320, 450], houseCost: [50, 50, 50, 50, 75], houseSellValue: [25, 25, 25, 25, 35] },
    mortgageValue: 30,
    isMortgaged: false
  },

  p3: {
    id: "p3",
    name: "HJA Airport",
    price: 200,
    level: 0,
    colorGroup: "Airport",
    rentRule: { type: "groupScaling", rentPerOwned: [25, 50, 100, 200] },
    mortgageValue: 100,
    isMortgaged: false
  },

  p4: {
    id: "p4",
    name: "Sharjah",
    price: 100,
    level: 0,
    colorGroup: "UAE",
    rentRule: { type: "normal", rents: [6, 20, 30, 90, 270, 400, 550], houseCost: [50, 50, 50, 50, 75], houseSellValue: [25, 25, 25, 25, 35] },
    mortgageValue: 50,
    isMortgaged: false
  },

  p5: {
    id: "p5",
    name: "Abu Dhabi",
    price: 100,
    level: 0,
    colorGroup: "UAE",
    rentRule: { type: "normal", rents: [6, 20, 30, 90, 270, 400, 550], houseCost: [50, 50, 50, 50, 75], houseSellValue: [25, 25, 25, 25, 35] },
    mortgageValue: 50,
    isMortgaged: false
  },

  p6: {
    id: "p6",
    name: "Dubai",
    price: 120,
    level: 0,
    colorGroup: "UAE",
    rentRule: { type: "normal", rents: [8, 30,40, 60, 180, 320, 450], houseCost: [50, 50, 50, 50, 75], houseSellValue: [25, 25, 25, 25, 35] },
    mortgageValue: 60,
    isMortgaged: false
  },

  p7: {
    id: "p7",
    name: "Brisbane",
    price: 140,
    level: 0,
    colorGroup: "Australia",
    rentRule: { type: "normal", rents: [10, 33, 50, 150, 450, 625, 750], houseCost: [100, 100, 100, 100, 150], houseSellValue: [50, 50, 50, 50, 75] },
    mortgageValue: 70,
    isMortgaged: false
  },

  p8: {
    id: "p8",
    name: "Oil Company",
    price: 150,
    level: 0,
    colorGroup: "Company",
    rentRule: { type: "diceMultiplier", multiplier: [4, 10] },
    mortgageValue: 75,
    isMortgaged: false
  },

  p9: {
    id: "p9",
    name: "Melbourne",
    price: 140,
    level: 0,
    colorGroup: "Australia",
    rentRule: { type: "normal", rents: [10, 33, 50, 150, 450, 625, 750], houseCost: [100, 100, 100, 100, 150], houseSellValue: [50, 50, 50, 50, 75] },
    mortgageValue: 70,
    isMortgaged: false
  },

  p10: {
    id: "p10",
    name: "Sydney",
    price: 160,
    level: 0,
    colorGroup: "Australia",
    rentRule: { type: "normal", rents: [12, 40, 60, 180, 500, 700, 900], houseCost: [100, 100, 100, 100, 150], houseSellValue: [50, 50, 50, 50, 75] },
    mortgageValue: 80,
    isMortgaged: false
  },

  p11: {
    id: "p11",
    name: "DIA Airport",
    price: 200,
    level: 0,
    colorGroup: "Airport",
    rentRule: { type: "groupScaling", rentPerOwned: [25, 50, 100, 200] },
    mortgageValue: 100,
    isMortgaged: false
  },

  p12: {
    id: "p12",
    name: "Liverpool",
    price: 180,
    level: 0,
    colorGroup: "UK",
    rentRule: { type: "normal", rents: [14, 46, 70, 200, 550, 750, 950], houseCost: [100, 100, 100, 100, 150], houseSellValue: [50, 50, 50, 50, 75] },
    mortgageValue: 90,
    isMortgaged: false
  },

  p13: {
    id: "p13",
    name: "Manchester",
    price: 180,
    level: 0,
    colorGroup: "UK",
    rentRule: { type: "normal", rents: [14, 46, 70, 200, 550, 750, 950], houseCost: [100, 100, 100, 100, 150], houseSellValue: [50, 50, 50, 50, 75] },
    mortgageValue: 90,
    isMortgaged: false
  },

  p14: {
    id: "p14",
    name: "London",
    price: 200,
    level: 0,
    colorGroup: "UK",
    rentRule: { type: "normal", rents: [16, 60, 80, 220, 600, 800, 1000], houseCost: [100, 100, 100, 100, 150], houseSellValue: [50, 50, 50, 50, 75] },
    mortgageValue: 100,
    isMortgaged: false
  },

  p15: {
    id: "p15",
    name: "Banglore",
    price: 220,
    level: 0,
    colorGroup: "India",
    rentRule: { type: "normal", rents: [18, 70, 90, 250, 700, 875, 1050], houseCost: [150, 150, 150, 150, 200], houseSellValue: [75, 75, 75, 75, 100] },
    mortgageValue: 110,
    isMortgaged: false
  },

  p16: {
    id: "p16",
    name: "Delhi",
    price: 220,
    level: 0,
    colorGroup: "India",
    rentRule: { type: "normal", rents: [18, 70, 90, 250, 700, 875, 1050], houseCost: [150, 150, 150, 150, 200], houseSellValue: [75, 75, 75, 75, 100] },
    mortgageValue: 110,
    isMortgaged: false
  },

  p17: {
    id: "p17",
    name: "Mumbai",
    price: 240,
    level: 0,
    colorGroup: "India",
    rentRule: { type: "normal", rents: [20, 80, 100, 300, 750, 925, 1100], houseCost: [150, 150, 150, 150, 200], houseSellValue: [75, 75, 75, 75, 100] },
    mortgageValue: 120,
    isMortgaged: false
  },

  p18: {
    id: "p18",
    name: "THI Airport",
    price: 200,
    level: 0,
    colorGroup: "Airport",
    rentRule: { type: "groupScaling", rentPerOwned: [25, 50, 100, 200] },
    mortgageValue: 100,
    isMortgaged: false
  },

  p19: {
    id: "p19",
    name: "Shenzhen",
    price: 260,
    level: 0,
    colorGroup: "China",
    rentRule: { type: "normal", rents: [22, 90, 110, 330, 800, 975, 1150], houseCost: [150, 150, 150, 150, 200], houseSellValue: [75, 75, 75, 75, 100] },
    mortgageValue: 130,
    isMortgaged: false
  },

  p20: {
    id: "p20",
    name: "Beijing",
    price: 260,
    level: 0,
    colorGroup: "China",
    rentRule: { type: "normal", rents: [22, 90, 110, 330, 800, 975, 1150], houseCost: [150, 150, 150, 150, 200], houseSellValue: [75, 75, 75, 75, 100] },
    mortgageValue: 130,
    isMortgaged: false
  },

  p21: {
    id: "p21",
    name: "Nuclear Plant",
    price: 150,
    level: 0,
    colorGroup: "Company",
    rentRule: { type: "diceMultiplier", multiplier: [4, 10] },
    mortgageValue: 75,
    isMortgaged: false
  },

  p22: {
    id: "p22",
    name: "Shanghai",
    price: 280,
    level: 0,
    colorGroup: "China",
    rentRule: { type: "normal", rents: [24, 100, 120, 360, 850, 1025, 1200], houseCost: [150, 150, 150, 150, 200], houseSellValue: [75, 75, 75, 75, 100] },
    mortgageValue: 140,
    isMortgaged: false
  },

  p23: {
    id: "p23",
    name: "Novosibirsk",
    price: 300,
    level: 0,
    colorGroup: "Russia",
    rentRule: { type: "normal", rents: [26, 110, 130, 390, 900, 1100, 1275], houseCost: [200, 200, 200, 200, 300], houseSellValue: [100, 100, 100, 100, 150] },
    mortgageValue: 150,
    isMortgaged: false
  },

  p24: {
    id: "p24",
    name: "Saint Petersburg",
    price: 300,
    level: 0,
    colorGroup: "Russia",
    rentRule: { type: "normal", rents: [26, 110, 130, 390, 900, 1100, 1275], houseCost: [200, 200, 200, 200, 300], houseSellValue: [100, 100, 100, 100, 150] },
    mortgageValue: 150,
    isMortgaged: false
  },

  p25: {
    id: "p25",
    name: "Moscow",
    price: 320,
    level: 0,
    colorGroup: "Russia",
    rentRule: { type: "normal", rents: [28, 120, 150, 450, 1000, 1200, 1400], houseCost: [200, 200, 200, 200, 300], houseSellValue: [100, 100, 100, 100, 150] },
    mortgageValue: 160,
    isMortgaged: false
  },

  p26: {
    id: "p26",
    name: "TNI Airport",
    price: 200,
    level: 0,
    colorGroup: "Airport",
    rentRule: { type: "groupScaling", rentPerOwned: [25, 50, 100, 200] },
    mortgageValue: 100,
    isMortgaged: false
  },

  p27: {
    id: "p27",
    name: "San Francisco",
    price: 350,
    level: 0,
    colorGroup: "USA",
    rentRule: { type: "normal", rents: [35, 140, 175, 500, 1100, 1300, 1500], houseCost: [200, 200, 200, 200, 300], houseSellValue: [100, 100, 100, 100, 150] },
    mortgageValue: 175,
    isMortgaged: false
  },

  p28:{
    id: "p28",
    name: "New York",
    price: 400,
    level: 0,
    colorGroup: "USA",
    rentRule: { type: "normal", rents: [50, 160, 200, 600, 1400, 1700, 2000], houseCost: [200, 200, 200, 200, 300], houseSellValue: [100, 100, 100, 100, 150] },
    mortgageValue: 200,
    isMortgaged: false
  }
}
