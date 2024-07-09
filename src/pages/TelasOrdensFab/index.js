import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import api from '../../services/api.js';
const TelasOrdensFab = ({ navigation }) => {
    const [barcode, setBarcode] = useState('118659.00');

    const fnPesquisar = async () => {
        try {
            const apiInstance = await api();
            const response = await apiInstance.get(
                `/ordens?evento=20&numeroOF=${barcode}`,
            );
            console.log(response.data)
        } catch (error) {
            console.error('Erro ao obter dados da API:', error);
            setBarcode('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholderTextColor="#000"
                showSoftInputOnFocus={false}
                autoFocus={true}
                placeholder="Inserir etiqueta"
                value={barcode}

            />
            <TouchableOpacity style={styles.button}  onPress={() => {
            navigation.navigate('Tab');
          }}><Text style={styles.buttonText}> Pesquisar</Text></TouchableOpacity>
        </SafeAreaView>
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
        color: "#000"
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
