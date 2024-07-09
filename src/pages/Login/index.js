import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const Login = ({ navigation }) => {
  const [userCode, setUserCode] = useState('')
  const [password, setPassword] = useState('')
  const [isSharedUser, setIsSharedUser] = useState(false)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerLogo}>
        <Image
          source={require('../../assets/logo_verde2.png')}
          resizeMode="contain"
          style={styles.img}
        />
      </View>
      <View style={styles.containerCentro}>
        <Text style={styles.txtTitulo}>
          Boas vindas ao app
          <Text style={styles.txtTituloColet}> CLT 400</Text>
        </Text>
        <Text style={styles.txtsubTitulo}>
          Faça o login abaixo para acessar.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Código do Usuário"
          placeholderTextColor="#3A3A3A"
          keyboardType="numeric"
        />
        <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#3A3A3A" secureTextEntry />
        <View style={styles.switchContainer}>
          <Switch
            trackColor={{ false: '#767577', true: '#49BC99' }}
            thumbColor={isSharedUser ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsSharedUser}
            value={isSharedUser}
          />
          <Text style={styles.label}>Usuário Compartilhado</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => {
          navigation.navigate('Opcoes');
        }}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerInferior}>
        <Text style={styles.versao}>Versão 1.00.0000</Text>
        <TouchableOpacity
          style={styles.btnConfig}
          onPress={() => {
            navigation.navigate('Configuracao');
          }}>
          <Text style={styles.btnConfigTxt}> Configurações </Text>
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
    backgroundColor: '#F1F5F4',
  },
  containerLogo: {
    flex: 2,
    justifyContent: 'center',
    marginTop: "6%"
  },
  img: {
    width: 550,
    height: '100%',
  },
  containerCentro: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  txtTitulo: {
    color: '#000',
    fontSize: 23,
    fontWeight: 'bold',
  },
  txtTituloColet: {
    color: '#09A08D',
    fontSize: 24,
    fontWeight: 'bold',
  },
  txtsubTitulo: {
    color: '#4C5958',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#3e3e3e',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  containerInferior: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  versao: {
    color: '#4C5958',
    fontSize: 13,
    marginBottom: 6,
  },
  btnConfig: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3C787A',
    //3e3e3e
  },
  btnConfigTxt: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Login;
