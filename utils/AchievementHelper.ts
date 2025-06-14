import { useAllAchievementsStore } from "@/stores/allAchievementsStore";
import { useUserPetStore } from "@/stores/userPetStore";

const getAchievementByName = (name: string) => {
    const achievements = useAllAchievementsStore.getState().achievements;
    return achievements?.find(achievement => achievement.name === name);
}


const CheckAchievementLevel = async (oldLevel : number, newLevel : undefined | number) => {
    if (newLevel === undefined) {
        return;
    }

    //Nivel 2
    if (oldLevel < 2 && newLevel >= 2) {
        const achievement = getAchievementByName("Level 2");
        if (achievement) {
           await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);     
        }
    }

    //Nivel 10
    if (oldLevel < 10 && newLevel >= 10) {
        const achievement = getAchievementByName("Level 10");
        if (achievement) {
           await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);     
        }
    }

    //Nivel 20
    if (oldLevel < 20 && newLevel >= 20) {
        const achievement = getAchievementByName("Level 20");
        if (achievement) {
           await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);     
        }
    }

    //Nivel 50
    if (oldLevel < 50 && newLevel >= 50) {
        const achievement = getAchievementByName("Level 50");
        if (achievement) {
           await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);     
        }
    }
}

export {getAchievementByName, CheckAchievementLevel};



