import Header from "@/components/Header";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function quizSummary(){
    return(
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
                Gatos adultos costumam dormir de 10 a 15 horas por dia.
            </Text>
            <Text style={styles.summary}>
                De acordo com especialistas, os peludos dormem, em média, 60% do seu tempo. 
                Isso significa que eles passam cerca de 15h por dia de olhos fechados. Entretanto, 
                esse número pode variar a partir de fatores como clima, saíde e idade do pet. Em outros,
                os bigodudos dorem mais ou menos o mesmo tempo médio de um ser humano adulto. 
                Ficar de olho no sono do amigo é importante...
            </Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Avançar</Text>
            </TouchableOpacity>
        </View>
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
