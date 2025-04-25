import { Wellbeing } from "@/dtos/Pet";

export const calcPetMood = (wellBeing: Wellbeing) : number => {
    const lastFed = new Date (wellBeing.hunger);
    const lastDrank = new Date (wellBeing.thirst);
    const lastCleaned = new Date (wellBeing.clean);
    const lastPlayed = new Date (wellBeing.thirst);
    const lastSlept = new Date (wellBeing.sleep);
    console.log("[DEBUG] Wellbeing: " + wellBeing);
    /*
    const lastFed = new Date("2025-04-25T00:00:00");
    const lastDrank = new Date("2025-04-25T00:00:00");
    const lastCleaned = new Date("2025-04-25T18:00:00");
    const lastPlayed = new Date("2025-04-25T18:00:00");
    const lastSlept = new Date("2025-04-25T18:00:00");
    */
    let mood = 0;
    mood += calcNecessityValue(lastFed, 25, 43200);
    mood += calcNecessityValue(lastDrank, 25, 43200);
    mood += calcNecessityValue(lastCleaned, 25, 86400);
    mood += calcNecessityValue(lastSlept, 12.5, 43200);
    mood += calcNecessityValue(lastPlayed, 12.5, 21600);

    console.log("[DEBUG] Mood:" + mood);
    return mood;
}

const calcNecessityValue = (last: Date, percentage: number, decrement: number) => {
    let currentDate = new Date();
    currentDate = new Date(currentDate.toISOString());
    console.log("[DEBUG] current date:" + currentDate);

    const timeSince = (currentDate.valueOf() - last.valueOf()) / 1000;
    const decreaseOvertime = percentage / decrement;

    let currentValue = percentage - (timeSince * decreaseOvertime);
    currentValue = Math.max(0, currentValue);

    return currentValue;
}