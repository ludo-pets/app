export const theme = {
  backgroundPrimary: "#FAF8EF",
  backgroundSecondary: "#BBAC9F",
  backgroundTertiary: "#CCC1B3",
  textPrimary: "#766E65",
  fonts: {
    bold: "ClearSans-Bold",
    regular: "ClearSans-Regular",
  },
};

export const MARGIN = 5;

export const BOARD_WIDTH_MULTIPLIER = 0.85;

export const BOARD_SIZE = 4;

export const TILE_IMAGES: Record<number, any> = {
  2: require("../../assets/images/minigames/pets2048/cat_adopt.png"),
  4: require("../../assets/images/minigames/pets2048/dog_catch.png"),
  8: require("../../assets/images/minigames/pets2048/cat_angry.png"),
  16: require("../../assets/images/minigames/pets2048/dog_eat.png"),
  32: require("../../assets/images/minigames/pets2048/cat_birthday.png"),
  64: require("../../assets/images/minigames/pets2048/dog_jump.png"),
  128: require("../../assets/images/minigames/pets2048/cat_eat_fish.png"),
  256: require("../../assets/images/minigames/pets2048/dog_roar.png"),
  512: require("../../assets/images/minigames/pets2048/cat_lick.png"),
  1024: require("../../assets/images/minigames/pets2048/dog_sit.png"),
  2048: require("../../assets/images/minigames/pets2048/cat_play.png"),
};

export const CELL_COLORS: Record<number, string> = {
  2: "#FEC5BB",
  4: "#D8E2DC",
  8: "#FCD5CE",
  16: "#ECE4DB",
  32: "#FAE1DD",
  64: "#FEC89A",
  128: "#E8E8E4",
  256: "#FFE5D9",
  512: "#F8EDEB",
  1024: "#FFD7BA",
  2048: "#b5c99a",
};

export const TILE_BACKGROUND_COLOR = "#EEE4DA"; // Example background color

export const CELL_NUMBER_COLORS: Record<number, string> = {
  2: "#695c57",
  4: "#695c57",
  8: "#ffffff",
  16: "#ffffff",
  32: "#ffffff",
  64: "#ffffff",
  128: "#ffffff",
  256: "#ffffff",
  512: "#ffffff",
  1024: "#ffffff",
  2048: "#ffffff",
};

export const CELL_NUMBER_FONT_SIZE: Record<number, number> = {
  2: 50,
  4: 50,
  8: 50,
  16: 45,
  32: 45,
  64: 45,
  128: 35,
  256: 35,
  512: 35,
  1024: 25,
  2048: 25,
};

export const ANIMATION_DURATION = 100;
