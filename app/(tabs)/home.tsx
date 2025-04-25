import Homescreen from '@/components/Homescreen'
import MoodBar from '@/components/MoodBar'
import Pet from '@/dtos/Pet'
import { useUserPetStore } from '@/stores/userPetStore'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { differenceInSeconds } from 'date-fns'

export default function HomeScreen() {
    const user = useUserPetStore((state) => state.user)
    const loading = useUserPetStore((state) => state.loading)
    const pet = useUserPetStore((state) => state.pet)
    const mood = calcPetMood(pet);
    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#5b5b5b" />
            ) : (
                <>
                    <MoodBar animalLevel={user?.level} animalMood={mood} />
                    <Homescreen />
                </>
            )} 
        </View>
    )
}

const calcPetMood = (pet) : number => {
    /*
    const lastFed = pet.wellBeing.hunger;
    const lastDrank = pet.wellBeing.thirst;
    const lastCleaned = pet.wellBeing.clean;
    const lastPlayed = pet.wellBeing.thirst;
    const lastSlept = pet.wellBeing.sleep;
    */
    const lastFed = new Date("2025-04-25T00:00:00");
    const lastDrank = new Date("2025-04-25T00:00:00");
    const lastCleaned = new Date("2025-04-25T18:00:00");
    const lastPlayed = new Date("2025-04-25T18:00:00");
    const lastSlept = new Date("2025-04-25T18:00:00");
    let mood = 0;

    mood += calcNecessityValue(lastFed, 25, 43200);
    mood += calcNecessityValue(lastDrank, 25, 43200);
    mood += calcNecessityValue(lastCleaned, 25, 86400);
    mood += calcNecessityValue(lastSlept, 12.5, 43200);
    mood += calcNecessityValue(lastPlayed, 12.5, 172800);

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
})
