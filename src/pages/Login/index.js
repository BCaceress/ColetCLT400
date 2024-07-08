import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';

const Login = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerLogo}>
        <Image
          source={require('../../assets/logo_verde.png')}
          resizeMode="contain"
          style={styles.img}
        />
      </View>
      <View style={styles.containerCentro}>
        <TextInput
          style={styles.input}
          placeholder="Código do Usuário"
          keyboardType="numeric"
        />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLogo: {
    flex: 1,
    justifyContent: 'center',
    marginTop: '16%',
    backgroundColor: '#45c',
  },
  img: {
    width: 550,
    height: '100%',
  },
  containerCentro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#23c',
  },
  input: {
    width: '85%',
    height: 45,
    borderColor: 'gray',
    borderWidth: 2,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '85%',
    backgroundColor: '#09A08D',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 19,
  },
});

export default Login;
