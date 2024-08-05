import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useEffect, useState } from 'react';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api.js';

const Configuracao = () => {
    const [connection, setConnection] = useState('');
    const [postos, setPostos] = useState(["INJ01", "INJ02", "INJ03", "INJ04", "INJ05", "INJ08", "INJ08", "INJ08"]);
    const [isLoading, setIsLoading] = useState(false);
    const [deviceDetails, setDeviceDetails] = useState('');
    const [uniqueId, setUniqueId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const savedConnection = await AsyncStorage.getItem('@MyApp:connection');
                setConnection(savedConnection || '');
                const device = await DeviceInformation.getDeviceName();
                const id = await DeviceInformation.getUniqueId();
                setDeviceDetails(device);
                setUniqueId(id);
            } catch (error) {
                console.error('Erro ao recuperar os dados:', error);
            }
        };
        fetchData();
    }, []);

    const copyToClipboard = useCallback((value) => {
        Clipboard.setString(value);
    }, []);

    const saveConfig = useCallback(async () => {
        try {
            await AsyncStorage.setItem('@MyApp:connection', connection);
            Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao salvar as configurações.');
        }
    }, [connection]);

    const testConnection = useCallback(async () => {
        try {
            setIsLoading(true);
            await AsyncStorage.setItem('@MyApp:connection', connection);
            const apiInstance = await api();
            const response = await apiInstance.get('/parametros?chave=NOME-EMP&sistema=CLT&estabelecimento=1');
            if (response.status === 200 && response.data?.valor) {
                Alert.alert('Sucesso', 'Conexão com API realizada!');
            } else {
                Alert.alert('Erro', 'Dados inválidos na resposta da API.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro na chamada da API.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [connection]);

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Informações do dispositivo</Text>
            <View style={styles.card}>
                <Text style={styles.description}>Nome do dispositivo:</Text>
                <View style={styles.contentContainer}>
                    <Text style={styles.content}>{deviceDetails}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(deviceDetails)}>
                        <MaterialCommunityIcons name="content-copy" style={styles.copyButton} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.card}>
                <Text style={styles.description}>Identificador Único:</Text>
                <View style={styles.contentContainer}>
                    <Text style={styles.content}>{uniqueId}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(uniqueId)}>
                        <MaterialCommunityIcons name="content-copy" style={styles.copyButton} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.titulo}>Postos habilitados</Text>
            <View style={styles.card}>
                <View style={styles.contentContainer}>
                    <View style={styles.badgesContainer}>
                        {postos.map((posto, index) => (
                            <View key={index} style={styles.badge}>
                                <Text style={styles.badgeText}>{posto}</Text>
                            </View>
                        ))}
                    </View>
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
                    onChangeText={setConnection}
                />
            </View>
            <View style={styles.viewButton}>
                <TouchableOpacity style={styles.buttonTestar} onPress={testConnection}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (<MaterialCommunityIcons name="access-point" color="#fff" size={27} />)}
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSalvar} onPress={saveConfig}>
                    <Text style={styles.textSalvar}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
    copyButton: {
        backgroundColor: '#09A08D',
        padding: 9,
        borderRadius: 5,
        fontSize: 17,
        color: '#fff'
    },
    badge: {
        backgroundColor: '#09A08D',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        margin: 2,
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
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
});

export default Configuracao;
