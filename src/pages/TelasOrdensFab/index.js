import React, { useState } from 'react';
import {
    StyleSheet
} from 'react-native';
import { RNCamera } from 'react-native-camera';
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
    const handleBarcodeDetected = ({ barcodes }) => {
        if (barcodes.length > 0) {
            const scannedData = barcodes[0].data;
            console.log('Scanned data:', scannedData);
            // Aqui você pode fazer o que quiser com os dados lidos
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <RNCamera
                style={{ flex: 1 }}
                onBarCodeRead={handleBarcodeDetected}
            />
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
