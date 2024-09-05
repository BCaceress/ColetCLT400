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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api';

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

const useLogin = (usuario, senha, setErrorMessage) => {
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
      } else if (response.status === 401) {
        setErrorMessage('Usuário ou senha incorretos.');
      } else {
        setErrorMessage('Erro ao fazer login. Tente novamente.');
      }
    } catch (error) {
      setErrorMessage('Erro ao se conectar à API. Verifique sua conexão de rede.');
    }
  }, [usuario, senha, setErrorMessage]);

  return acessoLogin;
};

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
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Estado para armazenar mensagens de erro
  const { infoDispositivo, acessoApp, getIDeAPI } = useDeviceInfo();
  const acessoLogin = useLogin(usuario, senha, setErrorMessage);
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
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Digite o usuário"
            placeholderTextColor="#A0A0A0"
            value={usuario}
            onChangeText={setUsuario}
            editable={acessoApp}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Digite a senha"
              placeholderTextColor="#A0A0A0"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showPassword}
              editable={acessoApp}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(prev => !prev)}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.switchContainer}>
            <Switch
              trackColor={{ false: '#D3D3D3', true: '#09A08D' }}
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
          <Text style={styles.versionText}>{infoDispositivo.mensagem || 'Dispositivo sem acesso'} - Versão 1.00.0000</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 35,
  },
  logo: {
    width: '100%',
    height: undefined,
    aspectRatio: 2,
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    padding: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  titleHighlight: {
    color: '#09A08D',
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    width: '100%',
    height: 45,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    color: '#666',
    marginLeft: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#09A08D',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#B0B0B0',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#D9534F', // Cor vermelha para erros
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  footerContainer: {
    alignItems: 'center',
  },
  versionText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
  configButton: {
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3C787A',
  },
  configButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
