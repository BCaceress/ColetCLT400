import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import DeviceInformation from 'react-native-device-info';
import api from '../../services/api';

const Login = ({ navigation }) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isSharedUser, setIsSharedUser] = useState(false)
  const [acessoApp, setAcessoApp] = useState(false)
  const [infoDispositivo, setInfoDispositivo] = useState([])
  const [usuario, setUsuario] = useState('duploz')
  const [senha, setSenha] = useState('yp0p0th@m')

  const data = {
    usuario: usuario,
    senha_cripto: encode(senha),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ID ÚNICO
        const uniqueId = await DeviceInformation.getUniqueId();
        // Conexão API
        const apiInstance = await api();
        const response = await apiInstance.get(`/dispositivo?id=${uniqueId}`);
        setInfoDispositivo(response.data);
        if (response.data.situacao.trim() === "A") {
          setAcessoApp(true);
        } else {
          setAcessoApp(false);
        }
      } catch (error) {
        console.error('Erro ao obter dados da API:', error);
        setAcessoApp(false)
      }
    };
    fetchData();
  }, []);

  const acessoLogin = async () => {
    try {
      const apiInstance = await api();
      const response = await apiInstance.post(
        `/login`, data,
      );
      if (response.status === 200) {
        console.log('Login bem-sucedido! Token:', response.data.token);
        navigation.navigate('Opcoes');
      } else {
        alert('Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      alert('Erro ao se conectar à API. Verifique sua conexão de rede.');
    }
  };

  function encode(str) {
    let chave, convertido;
    let resultado = '';
    const hexa = [];
    let numero = 0;

    while (numero < 1) {
      numero = Math.floor(Math.random() * 255);
    }
    chave = numero;
    hexa.push((chave >> 4).toString(16).toUpperCase());
    hexa.push((chave & 0xF).toString(16).toUpperCase());
    resultado += hexa.join('');

    for (let i = 0; i < str.length; i++) {
      convertido = str.charCodeAt(i) ^ chave;
      hexa[0] = (convertido >> 4).toString(16).toUpperCase();
      hexa[1] = (convertido & 0xF).toString(16).toUpperCase();
      resultado += hexa.join('');
    }
    return resultado;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
            placeholder="Digite o usuário"
            placeholderTextColor="#3A3A3A"
            value={usuario}
            editable={acessoApp}
          />
          <TextInput style={styles.input} placeholder="Digite a senha" placeholderTextColor="#3A3A3A" value={senha} editable={acessoApp} secureTextEntry />
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
          <TouchableOpacity
            style={[styles.button, !acessoApp && styles.disabledButton]}
            onPress={acessoLogin}
            disabled={!acessoApp}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerInferior}>
          <Text style={styles.versao}>{infoDispositivo.mensagem + ' -'} Versão 1.00.0000</Text>
          <TouchableOpacity
            style={styles.btnConfig}
            onPress={() => {
              navigation.navigate('Configuracao');
            }}>
            <Text style={styles.btnConfigTxt}> Configurações </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

    </TouchableWithoutFeedback>
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
    marginTop: "6%",

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
    color: '#000'
  },
  button: {
    width: '85%',
    backgroundColor: '#09A08D',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: 'gray',
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
