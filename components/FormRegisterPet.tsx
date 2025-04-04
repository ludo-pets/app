import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  StyleSheet
} from "react-native";
import { PetOptionFormRegisterPet } from "./PetOptionFormRegisterPet";
import { useState } from "react";


export function FormRegisterPet() {
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [selectedColorPet, setSelectedColorPet] = useState<number | null>(null);
  const [petName, setPetName] = useState<string>("");

  const pets = [
    {
      id: 1,
      pet_type: "gato",
    },
    {
      id: 2,
      pet_type: "cachorro",
    },
  ];

  const colors = [
    {
      id: 1,
      color: "#7D5D56",
    },
    {
      id: 2,
      color: "#BEBEBE",
    },
    {
      id: 3,
      color: "#F4EDE1",
    },
    {
      id: 4,
      color: "#FFD997",
    },
  ];

  function handlerSubmitForm() {
    if (!selectedPet || !selectedColorPet || !petName) {
      Alert.alert("Campos maus Preenchidos", "Preencha todos os campos!", [
        {
          text: "OK",
        },
      ]);
      return;
    }

    const payload = {
      name: petName,
      color: selectedColorPet,
      petType: selectedPet,
    };

    console.log("🚀 ~ handlerSubmitForm ~ payload:", payload);
  }
  return (
    
      <View style={styles.formBox}>
        <View style={styles.optionBox}>
          {pets.map((pet) => (
            <PetOptionFormRegisterPet
              key={pet.id}
              pet={pet.pet_type}
              selected={pet.id === selectedPet}
              onSelect={() => setSelectedPet(pet.id)}
            />
          ))}
        </View>
        <TextInput
        style={styles.inputBox}
          
          placeholder="Escolha um nome ..."
          placeholderTextColor={"#79747E"}
          onChangeText={(newName) => setPetName(newName)}
          value={petName}
        />

        <View style={styles.colorOptionBox} >
          {colors.map((color) => {
            const colorSelected = color.id == selectedColorPet;
            return (
              <Pressable 
                key={color.id}

                style={[{ backgroundColor: color.color },styles.colorOption, colorSelected && styles.colorOptionActive]}
                onPress={() => {
                  setSelectedColorPet(color.id);
                }}
              />
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handlerSubmitForm}
          style={styles.submitButtom}
        >
          <Text className="font-interBold color-white">Avançar</Text>
        </TouchableOpacity>
      </View>
 
  );
}

const styles = StyleSheet.create({
  formBox : {
    paddingHorizontal: 25,
    paddingVertical: 19,
    alignItems : "center",
    justifyContent:"space-between",
    // gap : 56,
    height: "60%",
    maxHeight: 445,
    width: "100%",
    maxWidth: 400,
  },

  optionBox : {
    flexDirection : "row",
    // gap : 32
    justifyContent : "space-between",
    alignItems: "center",
    width : "100%",
  },

  inputBox : {
    width : "100%",
    paddingHorizontal : 16,
    paddingVertical : 8,
    height : 40,
    borderWidth : 1,
    borderColor : "#D9D0E3",
    borderRadius : 8,
    borderStyle: 'solid'
  },

  colorOptionBox : {
    flexDirection : "row",
    gap : 10
  },

  colorOption : {
    width : 32,
    height : 32,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25,
    shadowRadius: 6.8,
    borderRadius: 6

  },

  colorOptionActive:{
    borderWidth: 3,
    borderColor: "#80BEE7",
    borderStyle: "solid",
  },

  submitButtom : {
    paddingHorizontal : 24,
    paddingVertical : 16,
    width : 113,
    height : 56,
    backgroundColor : "#FFAFD4",
    alignItems : "center",
    justifyContent : "center",
    fontWeight : 'bold',
    lineHeight : 24,
    fontSize: 16,
    borderRadius: 8,
  }


});
