import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from 'react';
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

// Hook personalizado para obter e definir informações do dispositivo
const useDeviceInfo = () => {
  const [infoDispositivo, setInfoDispositivo] = useState({});
  const [acessoApp, setAcessoApp] = useState(false);

  const getIDeAPI = useCallback(async () => {
    try {
      const uniqueId = await DeviceInformation.getUniqueId();
      const apiInstance = await api();
      const response = await apiInstance.get(`/dispositivo?id=${uniqueId}`);
      setInfoDispositivo(response.data);
      setAcessoApp(response.data.situacao.trim() === "A");
    } catch (error) {
      console.error('Erro ao obter dados da API:', error);
      setAcessoApp(false);
    }
  }, []);

  return { infoDispositivo, acessoApp, getIDeAPI };
};

// Hook personalizado para login
const useLogin = (usuario, senha) => {
  const acessoLogin = useCallback(async (navigation) => {
    const data = {
      usuario,
      senha_cripto: encode(senha),
    };
    try {
      const apiInstance = await api();
      const response = await apiInstance.post(`/login`, data);
      if (response.status === 200) {
        await AsyncStorage.setItem('@MyApp:permissao', response.data.permissao);
        navigation.navigate('Dashboard', { usuario: response.data.usuario });
      } else {
        alert('Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      alert('Erro ao se conectar à API. Verifique sua conexão de rede.');
    }
  }, [usuario, senha]);

  return acessoLogin;
};

// Função para criptografar a senha
const encode = (str) => {
  const chave = Math.floor(Math.random() * 255);
  const hexa = [];
  let resultado = '';

  hexa.push((chave >> 4).toString(16).toUpperCase());
  hexa.push((chave & 0xF).toString(16).toUpperCase());
  resultado += hexa.join('');

  for (let i = 0; i < str.length; i++) {
    const convertido = str.charCodeAt(i) ^ chave;
    hexa[0] = (convertido >> 4).toString(16).toUpperCase();
    hexa[1] = (convertido & 0xF).toString(16).toUpperCase();
    resultado += hexa.join('');
  }
  return resultado;
};

const Login = ({ navigation }) => {
  const [isSharedUser, setIsSharedUser] = useState(false);
  const [usuario, setUsuario] = useState('duploz');
  const [senha, setSenha] = useState('yp0p0th@m');
  const { infoDispositivo, acessoApp, getIDeAPI } = useDeviceInfo();
  const acessoLogin = useLogin(usuario, senha);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getIDeAPI();
    }
  }, [isFocused]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo_verde2.png')}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            Boas vindas ao app
            <Text style={styles.titleHighlight}> CLT 400</Text>
          </Text>
          <Text style={styles.subtitle}>Faça o login abaixo para acessar.</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o usuário"
            placeholderTextColor="#3A3A3A"
            value={usuario}
            onChangeText={setUsuario}
            editable={acessoApp}
          />
          <TextInput
            style={styles.input}
            placeholder="Digite a senha"
            placeholderTextColor="#3A3A3A"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={acessoApp}
          />
          <View style={styles.switchContainer}>
            <Switch
              trackColor={{ false: '#767577', true: '#49BC99' }}
              thumbColor={isSharedUser ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setIsSharedUser}
              value={isSharedUser}
            />
            <Text style={styles.switchLabel}>Usuário Compartilhado</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, !acessoApp && styles.disabledButton]}
            onPress={() => acessoLogin(navigation)}
            disabled={!acessoApp}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerContainer}>
          <Text style={styles.versionText}>{infoDispositivo.mensagem} - Versão 1.00.0000</Text>
          <TouchableOpacity
            style={styles.configButton}
            onPress={() => navigation.navigate('Configuracao')}
          >
            <Text style={styles.configButtonText}>Configurações</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

// Estilos atualizados e otimizados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F4',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginTop: 80
  },
  logo: {
    width: '110%', // Ajuste o valor conforme necessário
    height: undefined,
    aspectRatio: 2, // Ajuste a proporção conforme necessário
  },
  formContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginTop: 100
  },
  title: {
    color: '#000',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleHighlight: {
    color: '#09A08D',
  },
  subtitle: {
    color: '#4C5958',
    fontSize: 13,
    marginVertical: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    color: '#3e3e3e',
    marginLeft: 8,
  },
  button: {
    width: '100%',
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
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',

  },
  versionText: {
    color: '#4C5958',
    fontSize: 13,
    marginBottom: 6,
  },
  configButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3C787A',
  },
  configButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Login;
