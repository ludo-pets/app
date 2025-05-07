import {View, Text, StyleSheet, useWindowDimensions, TouchableOpacity} from "react-native";
import * as PhosphorIcons from 'phosphor-react-native';

interface pathItemQuiz {
    name : string,
    icon : string,
    concluded : boolean
    index :  number
    id : string
    pendent : boolean
    onPress: (id : string) => void
}

const ItemPathQuiz = ({name, icon, concluded, index, id, onPress, pendent} : pathItemQuiz) => {
    const { width: screenWidth } = useWindowDimensions();
    
    const textLeft = index % 2 === 0
        ? (screenWidth / 2) + 60 
        : (screenWidth / 2) - 160;


    const getIconByName = (iconName: string) => {
            const Icon = PhosphorIcons[iconName as keyof typeof PhosphorIcons];
            if (typeof Icon === 'function') {
                return <Icon size={42} color="white" weight="duotone" />;
            }
            return null;
        }

    return (
        <>
            <View style={styles.containerItemPathQuiz}>
                <TouchableOpacity onPress={() => onPress(id)} id={id}  style={styles.boxItemPathQuiz}>
                    <View style={[styles.itemPathQuiz, {
                        backgroundColor: concluded === false ? (pendent ? '#e1d153cc' : '#77747B') : '#CFE2A8',
                        boxShadow: concluded === false ? (pendent ? '0px 7px 0px 0px #c4b74fcc' : '0px 7px 0px 0px #49454F') : '0px 7px 0px 0px #B9CA95'
                    }]}>
                        {getIconByName(icon)} 
                    </View>
                </TouchableOpacity>
                <Text style={[styles.textItemQuiz, { left: textLeft }]}>{name}</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
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
    boxItemPathQuiz: {
        width: 100,
        height: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: "relative",
    },
    itemPathQuiz : {
        width: 76,
        height: 70,
        borderRadius: '50%',
        boxShadow: '0px 7px 0px 0px #B9CA95',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',    
    },
    
    containerItemPathQuiz :{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        gap: 20,
    },

    textItemQuiz: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#000000',
        position: 'absolute',
        height: "auto",
        width: 100,
        textAlign: 'center',
    },
})


export default ItemPathQuiz;