import * as React from 'react';
import {View, Text} from 'react-native';

export default function ProfileScreen({navigation}){
    return(
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text onPress={() => alert('This is the "Profile" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold'}}>Profile Screen</Text>
        </View>
    )
}
