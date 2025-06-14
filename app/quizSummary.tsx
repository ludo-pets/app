import Dialog from "@/components/Dialog/Dialog";
import Header from "@/components/Header";
import { useLessonStore } from "@/stores/lessonStore";
import { router } from "expo-router";
import { push } from "expo-router/build/global-state/routing";
import { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function quizSummary(){
    const [endSummary, setEndSummary] = useState(false);
     const {
        loading,
        error,
        lesson,
        currentQuestion,
        changeToNextQuestion,
        finishLesson,
    } = useLessonStore()

    const onHandleNext = async () => {
        if(currentQuestion && lesson) {
            const hasNext = await changeToNextQuestion(currentQuestion.id, lesson.questions)
            
            if(!hasNext) {
                setEndSummary(true)
            }
        }
        
            
    }
    useEffect(()=>{
        return () => {
            finishLesson(lesson!)
        };
    }, [])
    useEffect(()=>{

    }, [currentQuestion])
    return (lesson && currentQuestion) && (
    <ScrollView 
        contentContainerStyle={{flex: 1, justifyContent: "space-between"}}
        showsVerticalScrollIndicator={false}> 
        <View>
            <Header
                    title="Quiz"
                    backgroundColor="#CFE2A8"
                    showBackButton = {true}
            ></Header>
        </View>
        <View style={styles.container}>
            <Image style={styles.image}source={{uri: "https://projeto-ludo-pets.s3.us-east-1.amazonaws.com/assets/quiz-cat.png"}}/>    
            <Text style={styles.title}>
                {currentQuestion?.description}
            </Text>
            <View style={styles.answers}>
                {<View style={styles.rightAnswer}>
                        <Text>{currentQuestion?.answers[currentQuestion.rightAnswer]}</Text>
                    </View>
                }
                {currentQuestion?.answers

                    .map((ans,index) => index != currentQuestion.rightAnswer && (
                    <View key={index} style={styles.wrongAnswer}>
                        <Text 
                            adjustsFontSizeToFit
                            numberOfLines={4}
                            minimumFontScale={0.5}
                            style={{ width: "100%", textAlign: "center" }}
                            >
                                {ans}
                        </Text>
                    </View>
                ))}
            </View>
            <Text style={styles.summary}>
                {currentQuestion?.explanation}
            </Text>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => onHandleNext()}
            >
                <Text style={styles.buttonText}>Avançar</Text>
            </TouchableOpacity>
        </View>
        {
            endSummary && (<Dialog.Container>
                <Dialog.Text content="Parabéns!!"/>
                <Dialog.Text content="Você concluiu a revisão desta lição"/>
                <Dialog.Button
                    action={() => router.push("/quiz")}
                    text="Voltar"
                >

                </Dialog.Button>
            </Dialog.Container>
        )}
    </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 20,

    },
    image: {
        height: 220,
        width: "100%",
        resizeMode: "contain",
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: '500',
        color: "#5B5B5B",
        width: "80%",
    },
    answers: {
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        flexDirection: "row",
        flexWrap: "wrap",

        gap: 15,
        width: "90%",
    },
    rightAnswer: {
        backgroundColor :"#D9E8B9",
        padding: 15,
        fontSize: 20,
        alignItems: "center",
        color: "#5B5B5B",
        borderColor: "#5B5B5B",
        borderWidth: 1,
        borderRadius: 10,
        width: "100%",
        textAlign: "center",
        minHeight: 60,
    },
    wrongAnswer: {
        backgroundColor :"#EDB0B0",
        padding: 2,
        color: "#5B5B5B",
        fontSize: 14,
        borderColor: "#5B5B5B",
        borderWidth: 1,
        borderRadius: 10,
        width: "30%",
        textAlign: "center",
        alignItems: "center",
        minHeight: 60,
        alignContent: 'center',
        justifyContent: 'center',
    },
    summary: {
        fontSize: 16,
        textAlign: "center",

        fontWeight: '500',
        color: "#5B5B5B",
        width: "80%",
    },
    button: {
        width: "80%",
        backgroundColor: "#FFAFD4",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,

        boxShadow: "rgba(0,0,0,0.15) 5px 5px 5px"
        
    },
    buttonText: {
        color: "#fff",
        fontSize: 32,
        textAlign: "center",
    }
})
