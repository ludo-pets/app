import { Wellbeing } from '@/dtos/Pet'

export type Mood = {
    hunger: number
    thirst: number
    sleep: number
    clean: number
    play: number
    mood: number
  }

export const calcPetMood = (wellBeing: Wellbeing): Mood => {
    const lastFed = new Date(wellBeing.hunger)
    const lastDrank = new Date(wellBeing.thirst)
    const lastCleaned = new Date(wellBeing.clean)
    const lastPlayed = new Date(wellBeing.fun)
    const lastSlept = new Date(wellBeing.sleep)

    const hunger = calcNecessityValue(lastFed, 25, 216000)
    const thirst = calcNecessityValue(lastDrank, 25, 216000)
    const sleep = calcNecessityValue(lastSlept, 25, 216000)
    const clean = calcNecessityValue(lastCleaned, 12.5, 432000)
    const play = calcNecessityValue(lastPlayed, 12.5, 43200)

    const mood = hunger + thirst + sleep + clean + play

    return {
        hunger,
        thirst,
        sleep,
        clean,
        play,
        mood,
    }
}

export const calcNecessityValue = (last: Date, percentage: number, decrement: number) => {
    let currentDate = new Date();
    currentDate = new Date(currentDate.toISOString());

    const timeSince = (currentDate.valueOf() - last.valueOf()) / 1000
    const decreaseOvertime = percentage / decrement

    let currentValue = percentage - timeSince * decreaseOvertime
    currentValue = Math.max(0, currentValue)

    return currentValue
}
