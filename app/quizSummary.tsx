import Dialog from "@/components/Dialog/Dialog";
import Header from "@/components/Header";
import { useLessonStore } from "@/stores/lessonStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
                setEndSummary(true);
                finishLesson(lesson);
            }
        }
        
            
    }
    useEffect(()=>{}, [currentQuestion])
    return (lesson && currentQuestion) && (
    <View>
        <View>
            <Header
                    title="Quiz"
                    backgroundColor="#CFE2A8"
                    showBackButton = {true}
            ></Header>
        </View>
        <View style={styles.container}>
            <Image source={require('@/assets/images/quiz/quiz-cat.png')}/>    
            <Text style={styles.title}>
                {currentQuestion?.description}
            </Text>
            <Text style={styles.answers}>
                {currentQuestion?.answers.map((ans,index) => (
                    <View style={index == currentQuestion.rightAnswer ? styles.rightAnswer: styles.wrongAnswer}>
                        <Text>{ans}</Text>
                    </View>
                ))}
            </Text>
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
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: "100%",
        gap: 20,

    },
    title: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: '500',
        color: "#5B5B5B",
        width: "80%",
    },
    description: {

    },
    answers: {

    },
    rightAnswer: {
        backgroundColor :"green"
    },
    wrongAnswer: {
        backgroundColor :"red"
    },
    summary: {
        fontSize: 16,
        textAlign: "justify",
        fontWeight: '500',
        color: "#5B5B5B",
        width: "80%",
    },
    button: {
        width: "80%",
        backgroundColor: "#FFAFD4",
        padding: 10,
        flex: 1,
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
