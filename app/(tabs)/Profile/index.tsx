import { View, Text , Image, TouchableOpacity, ViewStyle } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import '../../../global.css'
import { useState } from "react";

// Edit Icon
const editIcon = require('../../../assets/images/profile/edit_icon.png');
const coinIcon = require('../../../assets/images/profile/pet_coin.png');

const Profile = () => {
    const pet = require('../../../assets/images/profile/cat_default.png');
    const [isChecked, setIsChecked] = useState(false);

    const buttonShadowStyle : ViewStyle  = {
        shadowColor: 'blue', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.25, 
        shadowRadius: 3.5, 
        elevation: 5, 
    };

    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
    };

    return (
        <>
            {/* HEADER AQUI - Substituir depois */}
            <View className="w-full justify-center items-center p-6 border-b-2 border-[##5B5B5B]">
                <Text className="font-semibold text-[#5B5B5B] text-4xl ">Perfil</Text>
            </View>
            
            <View className="w-4/5 flex-1 mx-auto my-0 py-5 justify-between">
                {/*Pet Container */}
                <View className="w-full flex justify-center items-center gap-6">
                    <Image source={pet} />
                
                    {/* Pet Name */}
                    <View className="flex-row justify-center items-center gap-3">
                        {/* Nome do pet CENTRALIZADO */}
                        <Text className="font-semibold text-3xl text-[#5B5B5B]">
                            Simba
                        </Text>

                        <Image 
                            source={editIcon} 
                            style={{ width: 24, height: 24 }} 
                        />
                    </View>

                    {/* Pet color */}
                    <View className="w-full flex justify-center items-center gap-6 flex-row h-83 pt-4">
                        <View className="w-10 h-10 bg-pet-primary-light-brown rounded-md shadow"></View>
                        <View className="w-10 h-10 bg-pet-primary-medium-gray rounded-md shadow"></View>
                        <View className="w-10 h-10 bg-pet-primary-beige rounded-md shadow"></View>
                        <View className="w-10 h-10 bg-pet-primary-light-yellow rounded-md shadow"></View>  
                    </View>

                    <View className="w-full justify-start pt-8 gap-4">
                        {/* Coins */}
                        <View className="flex flex-row gap-8">
                            <Image source={coinIcon}></Image>
                            <Text className="font-semibold text-2xl text-[#5B5B5B]">100</Text>
                        </View>

                        <View className="w-full flex-row gap-8 items-center">
                            <TouchableOpacity className="w-[35px] h-[35px] border-[3px] rounded-md border-[#5B5B5B] justify-center items-center bg-transparent" onPress={toggleCheckbox}>
                                {/* Marcação de check */}
                                {isChecked && (
                                    <Image
                                        source={require("../../../assets/images/profile/check.png")}
                                        className="w-[26px] h-[26px] relative left-1 -top-0.5"	/>
                                )}
                            </TouchableOpacity>
                            <Text className="font-semibold text-2xl text-[#5B5B5B]">Notificações</Text>
                        </View>
                    </View>
                </View>

                <View className="w-full items-center gap-3 pt-5">
                    <TouchableOpacity style={buttonShadowStyle} className="shadow w-full justify-center items-center p-4 bg-[#B6E683] rounded-3xl">                        
                        <Text className="text-white text-2xl text-center font-semibold">Salvar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={buttonShadowStyle} className="flex-row gap-3 border-1 w-full items-center shadow justify-center p-4 bg-transparent rounded-3xl">                        
                        <Text className="text-[#5B5B5B] text-2xl text-center text-bold font-semibold">Sair</Text>
                        <MaterialIcons className="mt-1 font-semibold" name="exit-to-app" size={24} color="#5B5B5B" />
                    </TouchableOpacity>                 
                </View>
            </View> 
        </>    
    )
}


export default Profile