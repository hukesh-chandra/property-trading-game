import {
  Player,
  GameRules,
  GameSettings,
  Property,
  GameSnapshot,
  TurnSummary,
  EngineEvent
} from "./types"
import { board } from "./board"
import { properties as baseProperties } from "./properties"

type Card = {
  id: string
  apply: (player: Player, append: (type: EngineEvent["type"], message: string) => void) => void
}

export class GameEngine {
  players: Player[] = []
  rules: GameRules
  settings: GameSettings
  currentPlayerIndex = 0
  turnNumber = 1

  readonly board = board
  readonly properties: Record<string, Property>

  private jailTurnsRemaining: Record<string, number> = {}
  private skipTurnsRemaining: Record<string, number> = {}
  private readonly rng: () => number
  private readonly chanceDeck: Card[]
  private readonly treasureDeck: Card[]
  private chanceIndex = 0
  private treasureIndex = 0

  constructor(
    players: Player[],
    rules: GameRules,
    settings: GameSettings,
    rng: () => number = Math.random
  ) {
    this.players = players.map((player) => ({
      ...player,
      balance: rules.startingMoney,
      position: 0,
      status: "normal",
      properties: new Set<string>()
    }))
    this.rules = rules
    this.settings = settings
    this.rng = rng
    this.properties = this.cloneProperties(baseProperties)
    this.chanceDeck = this.buildChanceDeck()
    this.treasureDeck = this.buildTreasureDeck()

    this.players.forEach((player) => {
      this.jailTurnsRemaining[player.id] = 0
      this.skipTurnsRemaining[player.id] = 0
    })
  }

  rollDice(): [number, number] {
    const die1 = this.randomInt(1, 6)
    const die2 = this.randomInt(1, 6)
    return [die1, die2]
  }

  getSnapshot(): GameSnapshot {
    // Snapshot is serialized for transport to API/UI boundaries.
    return {
      currentPlayerIndex: this.currentPlayerIndex,
      turnNumber: this.turnNumber,
      players: this.players.map((player) => ({
        ...player,
        properties: Array.from(player.properties)
      })),
      properties: this.cloneProperties(this.properties)
    }
  }

  playCurrentTurn(): TurnSummary {
    const player = this.players[this.currentPlayerIndex]
    const startedTurn = this.turnNumber
    const events: EngineEvent[] = []
    const append = this.eventAppender(events)

    if (player.status === "bankrupt") {
      append("status", `${player.name} is bankrupt and skipped.`)
      this.advanceToNextActivePlayer()
      return this.finalizeSummary(startedTurn, player, null, true, events)
    }

    const canPlay = this.resolvePlayerStatusAtTurnStart(player, append)
    if (!canPlay) {
      this.advanceToNextActivePlayer()
      return this.finalizeSummary(startedTurn, player, null, true, events)
    }

    const dice = this.rollDice()
    append("movement", `${player.name} rolled ${dice[0]} and ${dice[1]}.`)
    this.movePlayer(player.id, dice[0] + dice[1], append)
    this.handlePossibleBankruptcy(player, append)
    this.advanceToNextActivePlayer()

    return this.finalizeSummary(startedTurn, player, dice, false, events)
  }

  movePlayer(
    playerId: string,
    steps: number,
    append: (type: EngineEvent["type"], message: string) => void
  ) {
    const player = this.players.find((p) => p.id === playerId)
    if (!player) {
      append("info", `Player ${playerId} not found.`)
      return
    }

    const previousPosition = player.position
    player.position = (player.position + steps) % this.board.length
    append("movement", `${player.name} moved to tile ${player.position}.`)

    if (player.position < previousPosition) {
      player.balance += this.rules.startPassBonus
      append("money", `${player.name} passed Start and received $${this.rules.startPassBonus}.`)
    }

    this.handleTile(player, append)
  }

  private handleTile(player: Player, append: (type: EngineEvent["type"], message: string) => void) {
    const tile = this.board[player.position]

    switch (tile.type) {
      case "start":
        player.balance += this.rules.startLandBonus
        append("money", `${player.name} landed on Start and received $${this.rules.startLandBonus}.`)
        break

      case "property": {
        const property = this.properties[tile.propertyId]
        if (!property.ownerId) {
          append("property", `${player.name} can buy ${property.name} for $${property.price}.`)
          this.handleBuyOption(player, property, append)
        } else if (property.ownerId !== player.id && !property.isMortgaged) {
          const owner = this.players.find((p) => p.id === property.ownerId)
          if (owner) {
            if (this.rules.noRentInJail && owner.status === "jail") {
              append("property", `No rent collected because ${owner.name} is in jail.`)
              break
            }
            const rent = this.calculateRent(property)
            this.transferMoney(player, owner, rent, `${player.name} paid rent for ${property.name}.`, append)
          }
        }
        break
      }

      case "incomeTax": {
        const incomeTax = Math.floor(player.balance * this.rules.incomeTaxPercent)
        player.balance -= incomeTax
        append("money", `${player.name} paid income tax: $${incomeTax}.`)
        this.handlePossibleBankruptcy(player, append)
        break
      }

      case "cashTax": {
        const cashTax = Math.floor(player.balance * this.rules.cashTaxPercent)
        player.balance -= cashTax
        append("money", `${player.name} paid cash tax: $${cashTax}.`)
        this.handlePossibleBankruptcy(player, append)
        break
      }

      case "vacation":
        player.status = "vacation"
        this.skipTurnsRemaining[player.id] = 1
        append("status", `${player.name} is on vacation and will skip one turn.`)
        break

      case "jail":
        append("info", `${player.name} is just visiting jail.`)
        break

      case "chance":
        append("info", `${player.name} drew a Chance card.`)
        this.drawChanceCard(player, append)
        break

      case "treasure":
        append("info", `${player.name} drew a Treasure card.`)
        this.drawTreasureCard(player, append)
        break

      case "goToJail":
        append("status", `${player.name} was sent to jail.`)
        this.handleJail(player, append)
        break
    }
  }

  calculateRent(property: Property): number {
    if (!property.ownerId || property.isMortgaged) {
      return 0
    }

    if (property.rentRule.type === "normal") {
      const base = property.rentRule.rents[property.level] ?? 0
      if (property.level === 0 && this.hasFullSet(property.ownerId, property.colorGroup)) {
        return base * this.rules.fullSetMultiplier
      }
      return base
    }

    if (property.rentRule.type === "diceMultiplier") {
      const owner = this.players.find((p) => p.id === property.ownerId)
      if (!owner) return 0
      const ownedInGroup = Array.from(owner.properties).filter(
        (pid) => this.properties[pid].colorGroup === property.colorGroup
      ).length
      const multiplierIndex = Math.max(0, Math.min(ownedInGroup - 1, property.rentRule.multiplier.length - 1))
      const [die1, die2] = this.rollDice()
      return (die1 + die2) * property.rentRule.multiplier[multiplierIndex]
    }

    if (property.rentRule.type === "groupScaling") {
      const owner = this.players.find((p) => p.id === property.ownerId)
      if (!owner) return 0
      const ownedInGroup = Array.from(owner.properties).filter(
        (pid) => this.properties[pid].colorGroup === property.colorGroup
      ).length
      const index = Math.max(0, Math.min(ownedInGroup - 1, property.rentRule.rentPerOwned.length - 1))
      return property.rentRule.rentPerOwned[index]
    }

    return 0
  }

  handleBuyOption(
    player: Player,
    property: Property,
    append: (type: EngineEvent["type"], message: string) => void
  ) {
    if (player.balance < property.price) {
      append("property", `${player.name} cannot afford ${property.name}.`)
      return
    }

    player.balance -= property.price
    player.properties.add(property.id)
    property.ownerId = player.id
    append("property", `${player.name} bought ${property.name} for $${property.price}.`)
  }

  handleJail(player: Player, append: (type: EngineEvent["type"], message: string) => void) {
    const jailIndex = this.board.findIndex((tile) => tile.type === "jail")
    player.position = jailIndex
    player.status = "jail"
    this.jailTurnsRemaining[player.id] = this.rules.jailTurns
    append("status", `${player.name} is in jail for up to ${this.rules.jailTurns} turns.`)
  }

  private resolvePlayerStatusAtTurnStart(
    player: Player,
    append: (type: EngineEvent["type"], message: string) => void
  ): boolean {
    if (player.status === "vacation") {
      if (this.skipTurnsRemaining[player.id] > 0) {
        this.skipTurnsRemaining[player.id] -= 1
        if (this.skipTurnsRemaining[player.id] === 0) {
          player.status = "normal"
        }
        append("status", `${player.name} skipped turn due to vacation.`)
        return false
      }
      player.status = "normal"
    }

    if (player.status === "jail") {
      // Baseline strategy: auto-pay fine whenever possible to keep turns moving.
      if (player.balance >= this.rules.jailFine) {
        player.balance -= this.rules.jailFine
        player.status = "normal"
        this.jailTurnsRemaining[player.id] = 0
        append("money", `${player.name} paid jail fine $${this.rules.jailFine} and got out.`)
        return true
      }

      if (this.jailTurnsRemaining[player.id] > 0) {
        this.jailTurnsRemaining[player.id] -= 1
        append("status", `${player.name} remains in jail for ${this.jailTurnsRemaining[player.id]} more turns.`)
        if (this.jailTurnsRemaining[player.id] === 0) {
          player.status = "normal"
          append("status", `${player.name} served jail time and is now free.`)
        }
        return false
      }

      player.status = "normal"
    }

    return true
  }

  private drawChanceCard(player: Player, append: (type: EngineEvent["type"], message: string) => void) {
    const card = this.chanceDeck[this.chanceIndex]
    this.chanceIndex = (this.chanceIndex + 1) % this.chanceDeck.length
    append("info", `Chance card: ${card.id}`)
    card.apply(player, append)
    this.handlePossibleBankruptcy(player, append)
  }

  private drawTreasureCard(player: Player, append: (type: EngineEvent["type"], message: string) => void) {
    const card = this.treasureDeck[this.treasureIndex]
    this.treasureIndex = (this.treasureIndex + 1) % this.treasureDeck.length
    append("info", `Treasure card: ${card.id}`)
    card.apply(player, append)
    this.handlePossibleBankruptcy(player, append)
  }

  private handlePossibleBankruptcy(
    player: Player,
    append: (type: EngineEvent["type"], message: string) => void
  ) {
    if (player.balance >= 0 || player.status === "bankrupt") {
      return
    }

    // Bankruptcy transfers assets back to the bank and removes player from rotation.
    player.status = "bankrupt"
    player.balance = 0

    player.properties.forEach((propertyId) => {
      const property = this.properties[propertyId]
      if (property) {
        property.ownerId = undefined
        property.isMortgaged = false
        property.level = 0
      }
    })
    player.properties.clear()
    append("status", `${player.name} is bankrupt and removed from active play.`)

    const activePlayers = this.players.filter((p) => p.status !== "bankrupt")
    if (activePlayers.length <= 1) {
      const winner = activePlayers[0]
      if (winner) {
        append("gameOver", `Game over. Winner: ${winner.name}.`)
      } else {
        append("gameOver", "Game over. No active players remain.")
      }
    }
  }

  private transferMoney(
    from: Player,
    to: Player,
    amount: number,
    reason: string,
    append: (type: EngineEvent["type"], message: string) => void
  ) {
    from.balance -= amount
    to.balance += amount
    append("money", `${reason} Amount: $${amount}.`)
    this.handlePossibleBankruptcy(from, append)
  }

  private hasFullSet(ownerId: string, colorGroup: string): boolean {
    const groupProperties = Object.values(this.properties).filter((p) => p.colorGroup === colorGroup)
    return groupProperties.length > 0 && groupProperties.every((p) => p.ownerId === ownerId)
  }

  private advanceToNextActivePlayer() {
    const activeCount = this.players.filter((p) => p.status !== "bankrupt").length
    if (activeCount <= 1) {
      return
    }

    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
    } while (this.players[this.currentPlayerIndex].status === "bankrupt")

    this.turnNumber += 1
  }

  private buildChanceDeck(): Card[] {
    return this.shuffle([
      {
        id: "BANK_DIVIDEND_100",
        apply: (player, append) => {
          player.balance += 100
          append("money", `${player.name} received $100.`)
        }
      },
      {
        id: "PAY_50",
        apply: (player, append) => {
          player.balance -= 50
          append("money", `${player.name} paid $50.`)
        }
      },
      {
        id: "ADVANCE_3",
        apply: (player, append) => {
          this.movePlayer(player.id, 3, append)
        }
      },
      {
        id: "GO_TO_JAIL",
        apply: (player, append) => {
          this.handleJail(player, append)
        }
      }
    ])
  }

  private buildTreasureDeck(): Card[] {
    return this.shuffle([
      {
        id: "FOUND_200",
        apply: (player, append) => {
          player.balance += 200
          append("money", `${player.name} found $200.`)
        }
      },
      {
        id: "VACATION_BONUS",
        apply: (player, append) => {
          player.balance += this.rules.vacationBonus
          append("money", `${player.name} received vacation bonus $${this.rules.vacationBonus}.`)
        }
      },
      {
        id: "PAY_100",
        apply: (player, append) => {
          player.balance -= 100
          append("money", `${player.name} paid $100.`)
        }
      },
      {
        id: "COLLECT_20_EACH",
        apply: (player, append) => {
          this.players.forEach((other) => {
            if (other.id !== player.id && other.status !== "bankrupt" && other.balance >= 20) {
              other.balance -= 20
              player.balance += 20
            }
          })
          append("money", `${player.name} collected $20 from each non-bankrupt player.`)
        }
      }
    ])
  }

  private cloneProperties(input: Record<string, Property>): Record<string, Property> {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, { ...value, rentRule: { ...value.rentRule } as Property["rentRule"] }])
    )
  }

  private randomInt(min: number, max: number) {
    return Math.floor(this.rng() * (max - min + 1)) + min
  }

  private shuffle<T>(items: T[]): T[] {
    const copy = items.slice()
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = this.randomInt(0, i)
      const tmp = copy[i]
      copy[i] = copy[j]
      copy[j] = tmp
    }
    return copy
  }

  private eventAppender(events: EngineEvent[]) {
    return (type: EngineEvent["type"], message: string) => {
      events.push({ type, message, atTurn: this.turnNumber })
    }
  }

  private finalizeSummary(
    turnNumber: number,
    player: Player,
    dice: [number, number] | null,
    skipped: boolean,
    events: EngineEvent[]
  ): TurnSummary {
    return {
      turnNumber,
      playerId: player.id,
      playerName: player.name,
      dice,
      skipped,
      events,
      snapshot: this.getSnapshot()
    }
  }
}
