import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from "react-native";

interface PetOptionFormRegisterPetProps {
  image: ImageSourcePropType;
  onSelect: VoidFunction;
  selected: boolean;
}

export function PetOptionFormRegisterPet({
  image,
  onSelect,
  selected,
}: PetOptionFormRegisterPetProps) {
  return (
    <Pressable
      style={[styles.petBox, selected && styles.petBoxActive]}
      onPress={onSelect}
    >
      <View style={styles.imageContainer}>
        <Image style={styles.imagemBox} source={image} />
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
  },
  petBoxActive: {
    borderWidth: 5,
    borderColor: "#80BEE7",
    borderStyle: "solid",
  },
  imageContainer: {
    width: "70%",
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
