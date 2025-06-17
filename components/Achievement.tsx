import { Trophy } from 'phosphor-react-native'
import { View, StyleSheet, Text } from 'react-native'

interface AchievementProps {
    title: string
    description: string
    conquered: boolean
}

const Achievement = ({ title, description, conquered }: AchievementProps) => {
    return (
        <>
            <View style={styles.containerAchievement}>
                <View
                    style={[
                        styles.circleTrophy,
                        {
                            borderColor: conquered ? '#40ad43' : '#aaaaaa',
                            borderStyle: conquered ? 'solid' : 'dashed',
                            backgroundColor: conquered
                                ? 'transparent'
                                : '#f5f5f5',
                            boxShadow: conquered
                                ? '0 0 8px 0px #0000003d'
                                : 'none',
                        },
                    ]}
                >
                    <Trophy
                        color={conquered ? '#fcc41f' : '#aaaaaa'}
                        size={38}
                    />
                </View>

                <View>
                    <Text
                        style={[
                            styles.titleAchievement,
                            { color: conquered ? 'black' : '#aaaaaa' },
                        ]}
                    >
                        {title}
                    </Text>
                    <Text
                        style={[
                            styles.descriptionAchievement,
                            { color: conquered ? 'black' : '#aaaaaa' },
                        ]}
                    >
                        {description}
                    </Text>
                </View>
            </View>
        </>
    )
}

export default Achievement

const styles = StyleSheet.create({
    containerAchievement: {
        width: "90%",
        justifyContent: 'center',
        alignItems: 'center',
    },

    circleTrophy: {
        width: 80,
        height: 80,
        borderRadius: '50%',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },

    titleAchievement: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18,
    },

    descriptionAchievement: {
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 15,
    },
})
