import { Wellbeing } from '@/dtos/Pet'

export const calcPetMood = (wellBeing: Wellbeing): number => {
    const lastFed = new Date(wellBeing.hunger)
    const lastDrank = new Date(wellBeing.thirst)
    const lastCleaned = new Date(wellBeing.clean)
    const lastPlayed = new Date(wellBeing.fun)
    const lastSlept = new Date(wellBeing.sleep)

    let mood = 0
    mood += calcNecessityValue(lastFed, 25, 216000)
    mood += calcNecessityValue(lastDrank, 25, 216000)
    mood += calcNecessityValue(lastSlept, 25, 216000)
    mood += calcNecessityValue(lastCleaned, 12.5, 432000)
    mood += calcNecessityValue(lastPlayed, 12.5, 43200)

    return mood
}

const calcNecessityValue = (
    last: Date,
    percentage: number,
    decrement: number
) => {
    let currentDate = new Date()
    currentDate = new Date(currentDate.toISOString())

    const timeSince = (currentDate.valueOf() - last.valueOf()) / 1000
    const decreaseOvertime = percentage / decrement

    let currentValue = percentage - timeSince * decreaseOvertime
    currentValue = Math.max(0, currentValue)

    return currentValue
}
