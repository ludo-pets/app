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

const CheckAchievementMoney = async (oldMoney: number, newMoney: number) => {
    if (newMoney <= oldMoney) {
        return;
    }

    // Moeda I
    if (oldMoney < 100 && newMoney >= 100) {
        const achievement = getAchievementByName("Primeira Fortuna");
        if (achievement) {
            await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);
        }
    }

    // Moeda II
    if (oldMoney < 500 && newMoney >= 500) {
        const achievement = getAchievementByName("Cofrinho Recheado");
        if (achievement) {
            await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);
        }
    }

    // Moeda III
    if (oldMoney < 1000 && newMoney >= 1000) {
        const achievement = getAchievementByName("Magnata");
        if (achievement) {
            await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);
        }
    }

    // Moeda IV
    if (oldMoney < 10000 && newMoney >= 10000) {
        const achievement = getAchievementByName("Milhonário");
        if (achievement) {
            await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);
        }
    }    
}

const checkAchievementMinigameFirstTime = async (achievementName : string) => {
    const user = useUserPetStore.getState().user;

    // Jogo Hora da Patinha
    if(achievementName === "Cortar Unhas") {
        const achievement = getAchievementByName(achievementName);
        if(achievement && !(user?.achievements.includes(achievement.id))) {
            await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);
        }
    }

    // Jogo Comilança Maluca
    if(achievementName === "Barriga Cheia") {
        const achievement = getAchievementByName(achievementName);
        if(achievement && !(user?.achievements.includes(achievement.id))) {
            await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);
        }
    }

    // Jogo Flappy Pet
    if(achievementName === "Olha o aviãozinho!") {
        const achievement = getAchievementByName(achievementName);
        if(achievement && !(user?.achievements.includes(achievement.id))) {
            await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);
        }
    }    
}

const CheckAchievementFirtsLesson = async (nLesson : number, strLastLesson: string | null | undefined) => {
    if (nLesson === 1 && (!strLastLesson || strLastLesson)) {
        const achievement = getAchievementByName("Primeira Aula");
        if (achievement) {
            await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);
        }
    }   
}

const CheckAchievementAllQuestionsCorrect = async () => {
    const user = useUserPetStore.getState().user;
    const achievement = getAchievementByName("Guru dos pets");

    console.log(achievement)

    if (achievement != null && !(user?.achievements.includes(achievement.id))) {
        await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);  
    }
}

const CheckAchievementLastLesson = async (lessonID: string) => {
    const achievements = useAllAchievementsStore.getState().achievements; 
    if (!achievements || achievements.length === 0) {
        return;
    }  
    if(lessonID == achievements[achievements.length - 1].id) {
        const achievement = achievements[achievements.length - 1];   
        if (achievement) {
            await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);
        }   
    }
}

const CheckAchievementChangeColor = async () => {
    const user = useUserPetStore.getState().user;
    const achievement = getAchievementByName("Mudando de aparência");

    if (achievement != null && !(user?.achievements.includes(achievement.id))) {
        await useUserPetStore.getState().updateAchievements(achievement.id, achievement.name, achievement.message);
    }
}

export {
    getAchievementByName, 
    CheckAchievementLevel, 
    CheckAchievementMoney, 
    checkAchievementMinigameFirstTime, 
    CheckAchievementFirtsLesson,
    CheckAchievementAllQuestionsCorrect,
    CheckAchievementLastLesson,
    CheckAchievementChangeColor
};



