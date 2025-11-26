import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getApiUrl } from '../config/api';

export default function HomeScreen() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    console.log('fetching', getApiUrl('/test'));
    fetch(getApiUrl('/test'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setMessage(data.message))
      .catch(err => {
        console.log(err);
        setMessage('Error: ' + err.message);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
});
