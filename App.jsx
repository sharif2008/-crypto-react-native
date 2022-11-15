import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Alert, Button } from 'react-native';
import { createKeypair } from './src/utils/pki';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';

export default function App() {

  const privateKey = "privKey";

  const onPressButton = async () => {
    console.log('Key button pressed')
    const keyVal = createKeypair();
    save(privateKey, keyVal);
    alert('Key is generated');
  }
  async function save(key, value) {
    try {
      await SecureStore.setItemAsync(key, value, { requireAuthentication: true, authenticationPrompt: "Please enter fingerprint", keychainAccessible: SecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY });
      //getValueFor(key)
    } catch (error) {
      alert(error.message)
    }

  }

  async function getValueFor(key) {
    try {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        alert(result);
      } else {
        alert('No values stored under that key.');
      }
    } catch (error) {
      alert(error.message)
    }

  }
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Button title='New Key Generation' color='red' style={styles.btn} onPress={onPressButton} />
      </View>
      <View style={styles.inputRow}>
        <Button style={styles.btn}
          title="View Private Key"
          onPress={() => {
            getValueFor(privateKey);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    fontSize: 30,
    alignContent: "stretch",
    backgroundColor: "red",

  },
  inputRow: {
    margin: 20,
    flexDirection: "row",
  },
  paragraph: {},
  textInput: {}
});
