import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';

const ASTON_MARTIN_GREEN = '#418b61';

export default function HomeScreen() {
  const [message, setMessage] = useState('Loading...');
  const { signOut } = useAuth();

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
      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 24,
  },
  text: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 32,
  },
  signOutButton: {
    backgroundColor: ASTON_MARTIN_GREEN,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '600',
  },
});
