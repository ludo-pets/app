import { Wellbeing } from "@/dtos/Pet";

export let feeded = 0;
export let drunk = 0;
export let slept = 0;
export let cleaned = 0;
export let played = 0;
export let mood = 0;

export const calcPetMood = (wellBeing: Wellbeing): number => {
    const lastFed = new Date(wellBeing.hunger);
    const lastDrank = new Date(wellBeing.thirst);
    const lastCleaned = new Date(wellBeing.clean);
    const lastPlayed = new Date(wellBeing.thirst);
    const lastSlept = new Date(wellBeing.sleep);
    
    let mood = 0;
    feeded = calcNecessityValue(lastFed, 25, 216000);
    drunk =  calcNecessityValue(lastDrank, 25, 216000);
    slept = mood += calcNecessityValue(lastSlept, 25, 216000);
    cleaned =  calcNecessityValue(lastCleaned, 12.5, 432000);
    played = calcNecessityValue(lastPlayed, 12.5, 43200);
    mood += (feeded + drunk + slept + cleaned + played);

    return mood;
}

export const calcNecessityValue = (last: Date, percentage: number, decrement: number) => {
    let currentDate = new Date();
    currentDate = new Date(currentDate.toISOString());

    const timeSince = (currentDate.valueOf() - last.valueOf()) / 1000;
    const decreaseOvertime = percentage / decrement;

    let currentValue = percentage - (timeSince * decreaseOvertime);
    currentValue = Math.max(0, currentValue);

    return currentValue;
}