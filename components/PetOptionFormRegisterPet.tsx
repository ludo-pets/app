import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from "react-native";
import Gato from "../assets/images/pets/gato.svg";
import Cachorro from "../assets/images/pets/cachorro.svg";

interface PetOptionFormRegisterPetProps {
  pet: string;
  onSelect: VoidFunction;
  selected: boolean;
}

export function PetOptionFormRegisterPet({
  pet,
  onSelect,
  selected,
}: PetOptionFormRegisterPetProps) {
  return (
    <Pressable
      style={[styles.petBox, selected && styles.petBoxActive]}
      onPress={onSelect}
    >
      <View style={styles.imageContainer}>
        {pet==='gato' ? <Gato /> : <Cachorro />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  petBox: {
    width: "40%",
    aspectRatio: 1,
    backgroundColor: "#B6E683",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: 5,
  },
  petBoxActive: {
    borderWidth: 5,
    borderColor: "#80BEE7",
    borderStyle: "solid",
    padding: 0,
  },
  imageContainer: {
    width: "90%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imagemBox: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    // tintColor: "#444B8E",
  },
});
