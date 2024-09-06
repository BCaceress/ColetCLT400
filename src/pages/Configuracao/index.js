import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
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
    const [postos, setPostos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deviceDetails, setDeviceDetails] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [isPostosLoading, setIsPostosLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsPostosLoading(true);
                const savedConnection = await AsyncStorage.getItem('@MyApp:connection');
                setConnection(savedConnection || '');
                const device = await DeviceInformation.getDeviceName();
                const id = await DeviceInformation.getUniqueId();
                setDeviceDetails(device);
                setUniqueId(id);

                // Fetch postos from API
                const apiInstance = await api();
                const response = await apiInstance.get(`/dispositivo?id=${id}`);
                if (response.status === 200 && response.data?.postos) {
                    const postosFromApi = response.data.postos.map(posto => posto.CODIGO_POSTO);
                    setPostos(postosFromApi);
                    setErrorMessage('');
                } else {
                    setErrorMessage('Erro ao obter dados dos postos.');
                }
            } catch (error) {
                console.error('Erro ao recuperar os dados:', error);
                setErrorMessage('Postos não localizados.');
            } finally {
                setIsPostosLoading(false);
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
                {isPostosLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#09A08D" />
                    </View>
                ) : errorMessage ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.badgesContainer}>
                            {postos.map((posto, index) => (
                                <View key={index} style={styles.badge}>
                                    <Text style={styles.badgeText}>{posto}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                )}
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
        backgroundColor: '#F5F5F5',
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
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
    },
    badgesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorMessage: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        padding: 10,
    },
});

export default Configuracao;
