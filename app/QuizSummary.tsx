import Header from "@/components/Header";
import { Image, StyleSheet, Text, View } from "react-native";

export default function quizSummary(){
    return(
    <View>
        <View>
            <Header
                    title="Quiz"
                    backgroundColor="#CFE2A8"
                    showBackButton = {false}
            ></Header>
        </View>
        <View style={styles.container}>
            <Image source={require('@/assets/images/quiz/quiz-cat.png')}/>    
            
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
})
