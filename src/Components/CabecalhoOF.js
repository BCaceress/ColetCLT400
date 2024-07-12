import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { useDados } from '../contexts/DadosContext';

export default function CabecalhoOF() {
  const { dados, isLoading } = useDados();
  return (
    <View style={styles.container}>
      <ShimmerPlaceHolder
        style={{ width: '100%', height: 130 }}
        visible={isLoading}
        LinearGradient={LinearGradient}
      >
        <View style={styles.card}>
          <Text style={styles.textCard}>Nro. OF:<Text style={styles.textNegrito}>{dados?.ordem?.numero_ordem}</Text> </Text>
          <Text style={styles.textCard}>Produto: {dados?.ordem?.referencia} - {dados?.ordem?.produto}</Text>
          <Text style={styles.textCard}>Classificação:</Text>
          <Text style={styles.textCard}>OF Origem:</Text>
          <Text style={styles.textCard}>Qtde da OF: {dados?.ordem?.quantidade}</Text>
        </View>
      </ShimmerPlaceHolder>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  card: {
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
  textCard: {
    color: '#000',
    fontSize: 15
  },
  textNegrito: {
    fontWeight: 'bold'
  }
})

