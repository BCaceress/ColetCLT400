import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
export default function CabecalhoOF({ dados }) {

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Dados Gerais</Text>
      <View style={styles.card}>
        <Text style={styles.textCard}>Nro. OF: {dados?.ordem?.numero_ordem}</Text>
        <Text style={styles.textCard}>Produto: {dados?.ordem?.referencia} - {dados?.ordem?.produto}</Text>
        <Text style={styles.textCard}>Classificação:</Text>
        <Text style={styles.textCard}>OF Origem:</Text>
        <Text style={styles.textCard}>Qtde da OF: {dados?.ordem?.quantidade}</Text>
      </View>
    </View>

  );
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
    color: '#000'
  }
})

