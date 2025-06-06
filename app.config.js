export default {
  expo: {
    name: "LudoPets",
    slug: "ludopets",
    scheme: "myapp",
    android: {
      package: "com.ages.ludopets",
      googleServicesFile: "./google-services.json",
    },
    extra: {
      androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    }
  }
};