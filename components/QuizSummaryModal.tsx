import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

interface Props {
  correctAnswers: number
  total: number
}

export default function QuizSummaryModal({ correctAnswers, total }: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>Parabéns!</Text>
        <Text style={styles.text}>
          Você acertou {correctAnswers} de {total} perguntas.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Fechar')}>
          <Text style={styles.buttonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#6c63ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
})
