import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CameraBarcode from '../../components/CameraBarcode';

const TelasOrdensFab = ({ navigation }) => {

  const [barcode, setBarcode] = useState('393282.00');
  const [showCamera, setShowCamera] = useState(false);

  const toggleCamera = () => {
    setShowCamera(!showCamera);
  };

  const teste = () => {
    navigation.navigate('Tab', { barcode: barcode });
  };

  return (
    <View style={styles.container}>
      {showCamera ? (<CameraBarcode  />)
        : (
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Digite algo"
              value="393282.00"
            />
            <TouchableOpacity style={styles.button} onPress={teste}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleCamera}>
              <Text style={styles.buttonText}>Exibir/Esconder Câmera</Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#000',
  },
  button: {
    backgroundColor: '#09A08D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});

export default TelasOrdensFab;
