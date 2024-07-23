
import React from 'react';
import {
    SafeAreaView,
    StyleSheet, Text
} from 'react-native';
import CabecalhoOF from '../../../components/CabecalhoOF';
import { DadosProvider } from '../../../contexts/DadosContext';
const DadosGerais = () => {
  
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titulo}>Dados Gerais</Text>
            <DadosProvider>
                <CabecalhoOF />
            </DadosProvider>
        </SafeAreaView>
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
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12
    },
})

export default DadosGerais
