import * as React from 'react';
import {View, Text} from 'react-native';

export default function MiniGamesScreen({navigation}){
    return(
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text onPress={() => alert('This is the "MiniGames" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold'}}>MiniGames Screen</Text>
        </View>
    )
}
