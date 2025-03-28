import { useEffect, useRef, useState } from "react";
import { useGameConfig } from "./food_game/GameConfig";
import useFoods, { FoodItem, NewFood } from "./food_game/objects/Foods";
import { PanResponder, View, Text, TouchableWithoutFeedback, StatusBar, Animated, Image, ViewStyle, StyleSheet } from "react-native";

const gatoAberto = require("../../assets/images/food-game/gato_boca_aberta.png")

export default function App() {
  const { config, updateConfig } = useGameConfig();
  const { foods, FOOD_TYPES, createFood, setFoods } = useFoods({ config });
  const [characterPosition, setCharacterPosition] = useState(config.SCREEN_WIDTH / 2 - config.CHARACTER_WIDTH / 2);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false)
  const [fallSpeed, setFallSpeed] = useState(config.INITIAL_FALL_SPEED);
  const [gameStarted, setGameStarted] = useState(false)
  const scoreThresholds = useRef([10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70])

  const foodIdCounter = useRef(0)
  const gameTimer = useRef<NodeJS.Timeout | null>(null)
  const difficultyTimer = useRef<NodeJS.Timeout | null>(null)
  const [difficulty, setDifficulty] = useState(1) // Nível de dificuldade (1-10)
  const [spawnRate, setSpawnRate] = useState(1000) // Tempo entre spawns em ms

  useEffect(() => {
    // Agora chamamos a função corretamente
    const checkCollisions = () => {
      const characterTop = config.SCREEN_HEIGHT - config.CHARACTER_HEIGHT - 20
      const characterBottom = config.SCREEN_HEIGHT - 20
      const characterLeft = characterPosition
      const characterRight = characterPosition + config.CHARACTER_WIDTH

      foods.forEach((food: FoodItem) => {
        const foodTop = food.yPos
        const foodBottom = foodTop + config.FOOD_SIZE
        const foodLeft = food.x
        const foodRight = food.x + config.FOOD_SIZE

        const horizontalOverlap =
          (foodLeft <= characterRight && foodLeft >= characterLeft) ||
          (foodRight >= characterLeft && foodRight <= characterRight) ||
          (foodLeft <= characterLeft && foodRight >= characterRight);

        const verticalOverlap =
          (foodTop <= characterBottom && foodTop >= characterTop) ||
          (foodBottom >= characterTop && foodBottom <= characterBottom) ||
          (foodTop <= characterTop && foodBottom >= characterBottom);

        if (horizontalOverlap && verticalOverlap) {
          setFoods((prevFoods) => prevFoods.filter((f) => f.id !== food.id))
           // Atualiza pontuação e verifica se deve aumentar a dificuldade
          setScore((prevScore) => {
            const newScore = prevScore + food.points

            // Verifica se atingimos um novo limite de pontuação para aumentar a dificuldade
            const nextThresholdIndex = scoreThresholds.current.findIndex(
              (threshold) => newScore >= threshold && prevScore < threshold,
            )

            if (nextThresholdIndex !== -1) {
              increaseDifficulty()
              console.log(`Dificuldade aumentada! Pontuação: ${newScore}, Nível: ${difficulty + 1}`)
            }

            return newScore
          })
          }
      })
    }
    checkCollisions();
  }, [foods, characterPosition])

  //PanResponder para movimentação do player
  const panResponder = useRef(
    PanResponder.create({
      //Assim que houve o clique no componente, o PanResponder pega o controle
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      //Quando PanResponder tem o controle, atualiza a posição do personnagem
      onPanResponderGrant: (event) => {
        if (gameOver) return;

        const touchX = event.nativeEvent.locationX;
        let newPosition = touchX - config.CHARACTER_WIDTH / 2;
        if (newPosition < 0)
          newPosition = 0;

        if (newPosition > (config.SCREEN_WIDTH - config.CHARACTER_WIDTH))
          newPosition = config.SCREEN_WIDTH - config.CHARACTER_WIDTH;

        setCharacterPosition(newPosition);
      },
      onPanResponderMove: (event, gestureState) => {
        if (gameOver) return;

        let newPosition = gestureState.moveX - config.CHARACTER_WIDTH / 2;

        if (newPosition < 0)
          newPosition = 0;

        if (newPosition > (config.SCREEN_WIDTH - config.CHARACTER_WIDTH))
          newPosition = config.SCREEN_WIDTH - config.CHARACTER_WIDTH;

        setCharacterPosition(newPosition);
      },
      onPanResponderRelease: () => {
      },
    })
  ).current;

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setFallSpeed(config.INITIAL_FALL_SPEED)
    setDifficulty(1)
    setSpawnRate(1000)
    setFoods([])

    // Inicia o timer para criar comidas com base na taxa de spawn atual
    gameTimer.current = setInterval(spawnFood, spawnRate)

    // Timer para aumentar a dificuldade com base no tempo (a cada 30 segundos)
    difficultyTimer.current = setInterval(() => {
      if (!gameOver) {
        increaseDifficulty()
        console.log(`Dificuldade aumentada por tempo! Nível: ${difficulty + 1}`)
      }
    }, 30000)
  }


  // Função para criar uma nova comida
  const spawnFood = () => {
    const cretateItemParam: NewFood = {
      foodIDCounter: foodIdCounter,
      fallSpeed: fallSpeed,
    }
    createFood(cretateItemParam)

    // Em níveis mais altos de dificuldade, chance de spawnar comida extra
    if (difficulty > 3) {
      const extraFoodChance = (difficulty - 3) * 10 
      if (Math.random() * 100 < extraFoodChance) {
        setTimeout(() => {
          if (gameStarted && !gameOver) {
            createFood(cretateItemParam)
          }
        }, 300) // Pequeno atraso para não spawnar exatamente junto
      }
    }
  }

  // Função para aumentar a dificuldade
  const increaseDifficulty = () => {
    setDifficulty((prev) => {
      const newDifficulty = Math.min(prev + 1, 10)

      // Mantéma avelocidade pelo menos por enquanto (tava ficando muito rápido)
      // Ajusta a velocidade de queda com base na dificuldade (mais rápido)
      // const newFallSpeed = Math.max(config.INITIAL_FALL_SPEED - newDifficulty * 200, config.MIN_FALL_SPEED)
      // setFallSpeed(newFallSpeed)

      // Ajusta a taxa de spawn com base na dificuldade (mais frequente)
      const newSpawnRate = Math.max(1000 - newDifficulty * 75, 300)
      setSpawnRate(newSpawnRate)

      // Reinicia o timer de spawn com a nova taxa
      if (gameTimer.current) {
        clearInterval(gameTimer.current)
        gameTimer.current = setInterval(spawnFood, newSpawnRate)
      }

      return newDifficulty
    })
  }



  const endGame = () => {
    setGameOver(true)
    if (gameTimer.current) clearInterval(gameTimer.current)
    if (difficultyTimer.current) clearInterval(difficultyTimer.current)
  }

  const characterStyle: ViewStyle = {
    position: "absolute",
    bottom: 20,
    width: config.CHARACTER_WIDTH,
    height: config.CHARACTER_HEIGHT,
  };

  const foodStyle: ViewStyle = {
    position: "absolute",
    width: config.FOOD_SIZE,
    height: config.FOOD_SIZE,
  };


  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {!gameStarted ? (
        <View style={styles.startScreen}>
          <Text style={styles.title}>Food Game</Text>
          <TouchableWithoutFeedback onPress={startGame}>
            <View style={styles.startButton}>
              <Text style={styles.startButtonText}>Start Game</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      ) : (
        <View style={styles.gameContainer} {...panResponder.panHandlers}>
          {/* Score and health display */}
          <View style={styles.statsContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>

          {/* Falling food items */}
          {foods.map((food) => (
            <Animated.View
              key={food.id}
              style={[
                foodStyle,
                {
                  left: food.x,
                  transform: [{ translateY: food.y }],
                },
              ]}
            >
              <Image source={food.image} style={styles.foodImage} resizeMode="contain" />
            </Animated.View>
          ))}

          {/* Character */}
          <View style={[characterStyle, { left: characterPosition }]}>
            <Image
              source={gatoAberto}
              style={styles.characterImage}
              resizeMode="contain"
            />
          </View>

          {/* Game over overlay */}
          {gameOver && (
            <View style={styles.gameOverContainer}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <Text style={styles.finalScoreText}>Final Score: {score}</Text>
              <TouchableWithoutFeedback onPress={startGame}>
                <View style={styles.restartButton}>
                  <Text style={styles.restartButtonText}>Play Again</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      )}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
  },
  gameContainer: {
    flex: 1,
  },
  characterImage: {
    width: "100%",
    height: "100%",
  },
  foodImage: {
    width: "100%",
    height: "100%",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  healthBarContainer: {
    width: 100,
    height: 15,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  healthBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  gameOverContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  finalScoreText: {
    fontSize: 24,
    color: "white",
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  startScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#87CEEB",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 50,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 10,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
})

