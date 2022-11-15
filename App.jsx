import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createCSR, createKeypair, createKeyPairRSA, keypair, keypairWC } from './src/utils/pki';

export default function App() {
  let i = 0;

  const onPressButton = async () => {
    console.log('button pressed')

    createCSR(++i);
  }

  return (
    <View style={styles.container}>
      <Button title='New Key Generation' color="#841584" style={styles.btn}
        accessibilityLabel="Learn more about this purple button" onPress={onPressButton} />
      <Text></Text>
      <Button title='Test Alive' style={styles.btn} onPress={() => { alert("hi") }} />
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
    margin: 20,
    padding: 10
  }
});
