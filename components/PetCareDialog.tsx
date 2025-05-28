import React from 'react'
import {
    Modal,
    View,
    Text,
    Image,
    StyleSheet,
    Pressable,
    ScrollView,
    Platform,
} from 'react-native'

type Props = { visible: boolean; onStart: () => void; onDismiss?: () => void }

export default function PetCareModal({ visible, onStart, onDismiss }: Props) {
    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onDismiss}
        >
            <Pressable style={styles.backdrop} onPress={onDismiss}>
                <Pressable style={styles.dialog}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>
                            Guia Pet
                        </Text>
                        <Text style={styles.subtitle}>
                            Toque nos objetos sempre que seu amiguinho precisar!
                            {'\n'}
                            Cada interação deixa seu pet mais feliz e saudável.
                        </Text>

                        <Text>
                            🧸 Brinquedo: Toque para brincar e encher o coração
                            do seu pet de alegria!
                        </Text>
                        <Text>
                            🍖 Ração: Toque para encher a barriguinha dele e
                            acabar com a fome!
                        </Text>
                        <Text>
                            💧 Água: Toque para manter seu pet sempre hidratado
                            e cheio de energia!
                        </Text>
                        <Text>
                            🛏️ Travesseiro: Toque para colocar o seu pet para
                            dormir e recuperar todas as forças!
                        </Text>
                        <Text>
                            🧼 Higiene: Toque para garantir a higiene e deixar
                            seu pet limpinho e confortável!
                        </Text>
                    </ScrollView>

                    <Pressable style={styles.cta} onPress={onStart}>
                        <Text style={styles.ctaText}>Começar a diversão</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    dialog: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        maxWidth: 440,
        width: '100%',
        maxHeight: '90%',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 16,
        color: '#333',
    },
    tip: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    tipText: { flex: 1, fontSize: 15, lineHeight: 20 },
    cta: {
        marginTop: 16,
        backgroundColor: Platform.OS === 'ios' ? '#007AFF' : '#2196F3',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    ctaText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
