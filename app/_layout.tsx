import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

const bg = require('../assets/images/bg.png');

export default function RootLayout() {
  return (
    <ImageBackground source={bg} style={styles.background} resizeMode="cover">
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="tv" />
      </Stack>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
