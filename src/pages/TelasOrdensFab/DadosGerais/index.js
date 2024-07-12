
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import CabecalhoOF from '../../../Components/CabecalhoOF';
import api from '../../../services/api';

const DadosGerais = () => {
    const [dados, setDados] = useState([]);
    const [barcode, setBarcode] = useState('118659.00');
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            console.log('aqu', isLoading); // Verifique o valor atual do isLoading
            try {
                const apiInstance = await api();
                const response = await apiInstance.get(
                    `/ordens?evento=20&numeroOF=${barcode}`
                );
                setDados(response.data);
                setIsLoading = false;
                console.log('aqu2222', isLoading); // Verifique o valor atual do isLoading
            } catch (error) {
                console.error('Erro ao obter dados da API:', error);
                setIsLoading = false;
                console.log('aqu2222234442', isLoading);
            }
        };
        fetchData();
    }, [barcode]);


    return (
        <SafeAreaView style={styles.container}>
            <ShimmerPlaceHolder

                style={{ height: 100, width: '100%' }}
                visible={!isLoading}
                shimmerColors={['#EDEDED', '#D3D3D3', '#EDEDED']}
            >
                <CabecalhoOF dados={dados} />
            </ShimmerPlaceHolder>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
})

export default DadosGerais
