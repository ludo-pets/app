import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
  } from 'react-native';
  import { PetOptionFormRegisterPet } from './PetOptionFormRegisterPet';
  import { useState } from 'react';
  import Gato from '../assets/images/pets/gato.svg';
  import Cachorro from '../assets/images/pets/cachorro.svg';
  import { SvgProps } from 'react-native-svg';
  import { addPet } from '@/services/postPet';
  import { useNavigation } from '@react-navigation/native';
  
  type PetOption = {
    id: number;
    icon: React.FC<SvgProps>;
    pet_type: 'cat' | 'dog';
  };
  
  type ColorOption = {
    id: number;
    color: string;
  };
  
  export function FormRegisterPet() {
    const pets: PetOption[] = [
        {
          id: 1,
          icon: Gato,
          pet_type: 'cat',
        },
        {
          id: 2,
          icon: Cachorro,
          pet_type: 'dog',
        },
      ];

      const colors: ColorOption[] = [
        { id: 1, color: '#7D5D56'},
        { id: 2, color: '#BEBEBE'},
        { id: 3, color: '#F4EDE1'},
        { id: 4, color: '#FFD997'},
      ];
      
    const navigation = useNavigation();

    const [selectedPet, setSelectedPet] = useState<PetOption>(pets[0]);
    const [selectedColorPet, setSelectedColorPet] =
      useState<ColorOption>(colors[0]);
    const [petName, setPetName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

  
    // Make the handler async to use await
    async function handlerSubmitForm() {
      if (!petName.trim()) {
        Alert.alert(
          'Oops!',
          'Parece que você esqueceu de preencher alguma informação. Confira todos os campos.',
          [{ text: 'OK' }]
        );
        return;
      }
  
      // Set loading state to true
      setIsLoading(true);
  
      const petDataToCreate = {
        name: petName.trim(), // Trim whitespace
        color: selectedColorPet.color,
        type: selectedPet.pet_type, // Changed from petType to type to match service
      };
  
  
      // Call the service function to add the pet
      const newPet = await addPet(petDataToCreate);
  
      // Set loading state back to false
      setIsLoading(false);
  
      if (newPet) {
        // Success!
        Alert.alert('Sucesso!', `Seu pet ${newPet.name} foi criado!`, [
          {
            text: 'OK',
            onPress: () => {
              // Reset form state if needed
               navigation.navigate('(tabs)' as never);
               setSelectedPet(pets[0]);
               setSelectedColorPet(colors[0]);
               setPetName('');
            },
          },
        ]);
        navigation.navigate('(tabs)' as never);
      } else {
        // Error handled in addPet function (showed an alert there)
        console.error('Failed to create pet.');
      }
    }
  
    function handlerChangePetName(newName: string) {
      const newNameFormated = newName.replace(/[^a-zA-Z\s]/g, ''); // Allow spaces too? Adjust regex if needed
      setPetName(newNameFormated);
    }
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formBox}
      >
        {/* Pet Type Selection */}
        <View style={styles.optionBox}>
          {pets.map((pet) => (
            <PetOptionFormRegisterPet
              key={pet.id}
              Icon={pet.icon}
              selected={pet.id === selectedPet?.id}
              onSelect={() => setSelectedPet(pet)}
              color={selectedColorPet?.color || '#FFD997'}
            />
          ))}
        </View>
  
        {/* Pet Name Input */}
        <TextInput
          style={[styles.inputBox, isLoading && styles.disabledInput]} // Style when disabled
          placeholder="Escolha um nome ..."
          placeholderTextColor={'#79747E'}
          onChangeText={handlerChangePetName}
          value={petName}
          editable={!isLoading} // Disable input while loading
        />
  
        {/* Color Selection */}
        <View style={styles.colorOptionBox}>
          {colors.map((color) => {
            const colorSelected = color.id === selectedColorPet?.id;
            return (
              <Pressable
                key={color.id}
                style={[
                  { backgroundColor: color.color },
                  styles.colorOption,
                  colorSelected && styles.colorOptionActive,
                  isLoading && styles.disabledInput, // Visually disable
                ]}
                onPress={() => {
                  if (!isLoading) {
                     setSelectedColorPet(color);
                  }
                }}
                disabled={isLoading} // Disable pressable while loading
              />
            );
          })}
        </View>
  
        {/* Submit Button */}
        <TouchableOpacity
          onPress={handlerSubmitForm}
          style={[styles.submitButtom, isLoading && styles.submitButtonDisabled]} // Style when disabled
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" /> // Show loader
          ) : (
            <Text style={styles.submitButtonText}>Avançar</Text> // Show text
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
  
  // --- Add styles for disabled states ---
  const styles = StyleSheet.create({
    formBox: {
      paddingHorizontal: 25,
      paddingVertical: 19,
      alignItems: 'center',
      justifyContent: 'space-between',
      // Removed fixed height to be more flexible
      // height: '60%',
      // maxHeight: 445,
      width: '100%',
      maxWidth: 400,
    },
    optionBox: {
      flexDirection: 'row',
      justifyContent: 'space-around', // Changed for better spacing
      alignItems: 'center',
      width: '100%',
      marginBottom: 20, // Added margin
    },
    inputBox: {
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 8,
      height: 40,
      borderWidth: 1,
      borderColor: '#D9D0E3',
      borderRadius: 8,
      borderStyle: 'solid',
      marginBottom: 20, // Added margin
      backgroundColor: '#FFF', // Added background
    },
    colorOptionBox: {
      flexDirection: 'row',
      flexWrap: 'wrap', // Allow wrapping if many colors
      justifyContent: 'center', // Center colors
      gap: 15, // Increased gap
      marginBottom: 30, // Increased margin
    },
    colorOption: {
      width: 32,
      height: 32,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84, // Adjusted shadow
      borderRadius: 5, // Make it circular
      elevation: 5, // Add elevation for Android
    },
    colorOptionActive: {
      borderWidth: 3,
      borderColor: '#80BEE7',
      borderStyle: 'solid',
    },
    submitButtom: {
      paddingHorizontal: 24,
      paddingVertical: 10, // Adjusted padding
      minWidth: 113, // Use minWidth
      height: 48, // Adjusted height
      backgroundColor: '#FFAFD4',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8, // Make it more rounded
      elevation: 3,
    },
    submitButtonText: {
      fontWeight: 'bold',
      lineHeight: 24,
      fontSize: 16,
      color: '#FFF',
    },
    // Styles for disabled/loading states
    disabledInput: {
        opacity: 0.6,
        backgroundColor: '#E0E0E0', // Lighter background when disabled
    },
    submitButtonDisabled: {
        backgroundColor: '#E0A0C0', // Different color when disabled
        opacity: 0.7,
    },
  });
