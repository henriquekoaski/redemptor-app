import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function JourneyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Journey</Text>
      <Text style={styles.subtext}>Track your progress here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 24,
    paddingBottom: 100, // Space for floating tab bar
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtext: {
    color: '#888',
    fontSize: 16,
  },
});

