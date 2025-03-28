import * as React from 'react';
import {View, Text} from 'react-native';

export default function QuizScreen({navigation}){
    return(
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text onPress={() => alert('This is the "Quiz" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold'}}>Quiz Screen</Text>
        </View>
    )
}
