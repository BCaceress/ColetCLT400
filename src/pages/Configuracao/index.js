
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import DeviceInformation from 'react-native-device-info';
import { Radio } from 'react-native-feather';
import Icon from 'react-native-vector-icons/FontAwesome5';
import api from '../../services/api.js';

const Configuracao = () => {
    const [connection, setConnection] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [deviceDetails, setDeviceDetails] = React.useState('')
    const [uniqueId, setUniqueId] = React.useState('')

    useEffect(() => {
        // Recupera os valores do AsyncStorage
        const fetchData = async () => {
            try {
                const savedConnection = await AsyncStorage.getItem('@MyApp:connection');
                const leTodasEtiquetas = await AsyncStorage.getItem('@MyApp:leTodas');
                setConnection(savedConnection || '');
            } catch (error) {
                console.error('Erro ao recuperar os dados:', error);
            }
        };

        fetchData();
    }, []);

    const copyToClipboard = (value) => {
        Clipboard.setString(value)
    }

    const getDeviceInfo = async () => {
        let device = await DeviceInformation.getDeviceName()
        let uniqueId = await DeviceInformation.getUniqueId()
        setDeviceDetails(device)
        setUniqueId(uniqueId)
    }
    getDeviceInfo()

    const fnSalvar = async () => {
        try {
            // Salva os dados no AsyncStorage
            await AsyncStorage.setItem('@MyApp:connection', connection);
            Alert.alert('Sucesso', 'Configurações salvas com sucesso!', [
                { text: 'OK' },
            ]);
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao salvar as configurações.', [
                { text: 'OK' },
            ]);
        }
    };

    const testarConexao = async () => {
        try {
            setIsLoading(true);
            // Salva os valores no AsyncStorage
            await Promise.all([
                AsyncStorage.setItem('@MyApp:connection', connection),
            ]);
            // Faz a chamada à API
            const apiInstance = await api();
            const response = await apiInstance.get('/parametros?chave=NOME-EMP&sistema=CLT&estabelecimento=1');
            if (response.status === 200) {
                if (response.data && response.data.valor) {
                    Alert.alert('Sucesso', 'Conexão com API realizada!', [{ text: 'OK' }]);
                    setIsLoading(false);
                } else {
                    Alert.alert('Erro', 'Dados inválidos na resposta da API.', [{ text: 'OK' }]);
                    setIsLoading(false);
                }
            } else {
                Alert.alert('Erro', 'Favor verificar a conexão API.', [{ text: 'OK' }]);
                setIsLoading(false);
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro na chamada da API.', [{ text: 'OK' }]);
            console.error(error)
            setIsLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Informações do dispositivo</Text>
            <View style={styles.card}>
                <Text style={styles.description}>Nome do dispositivo:</Text>
                <View style={styles.contentContainer}>
                    <Text style={styles.content}>{deviceDetails}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(deviceDetails)}>
                        <Icon name="copy" style={styles.copyButton} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.card}>
                <Text style={styles.description}>Identificador Único:</Text>
                <View style={styles.contentContainer}>
                    <Text style={styles.content}>{uniqueId}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(uniqueId)}>
                        <Icon name="copy" style={styles.copyButton} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.titulo}>Configurações do sistema</Text>
            <View style={styles.card}>
                <Text style={styles.description}>Conexão API:</Text>
                <TextInput
                    style={styles.inputConexao}
                    placeholder="Digite a conexão"
                    placeholderTextColor={'#ccc'}
                    value={connection}
                    onChangeText={text => setConnection(text)}
                />
            </View>
            <View style={styles.viewButton}>
                <TouchableOpacity style={styles.buttonTestar} onPress={testarConexao}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (<Radio size={35} color="white" />)}
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSalvar} onPress={fnSalvar}>
                    <Text style={styles.textSalvar}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    titulo: {
        color: '#000',
        padding: 8,
        marginBottom: 12,
        fontSize: 22,
        fontWeight: 'bold',
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    description: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        color: '#000',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        fontSize: 16,
        marginRight: 10,
        color: '#000',
    },
    infoText: {
        fontSize: 16,
    },
    copyButton: {
        backgroundColor: '#49BC99',
        padding: 9,
        borderRadius: 5,
        fontSize: 18,
    },
    inputConexao: {
        height: 40,
        width: '65%',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#a3a3a3',
        paddingStart: 10,
        color: '#000'
    },
    viewButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonTestar: {
        backgroundColor: '#09A08D',
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 15,
        width: '25%',
    },
    buttonSalvar: {
        backgroundColor: '#09A08D',
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 15,
        width: '70%',
    },
    textSalvar: {
        color: 'white',
        fontSize: 19,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
})

export default Configuracao
