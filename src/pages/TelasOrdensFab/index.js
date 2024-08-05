import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CameraBarcode from '../../components/CameraBarcode';
import api from '../../services/api';

const TelasOrdensFab = ({ navigation }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [OF, setOF] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigateToTab = (valueOF) => {
    navigation.navigate('Tab', { valueOF });
  };

  const toggleCamera = () => {
    setShowCamera(!showCamera);
  };

  const handleCameraClose = () => {
    setShowCamera(false);
  };

  const fetchData = async () => {
    setLoading(true);
    const apiInstance = await api();
    try {
      const response = await apiInstance.get('/lista_ordens?postos=INJ19,INJ01');
      setOF(response.data.ordens);
      setLoading(false);
    } catch (error) {
      setError('Erro ao obter dados da API. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aguardando':
        return '#FFB300';
      case 'Concluída':
      case 'Concluida':
        return '#09A08D';
      case 'Interrompida':
        return '#FF0000';
      case 'Produzindo':
        return '#1E90FF';
      default:
        return '#888';
    }
  };

  const renderItem = useCallback(({ item }) => (
    <View style={styles.itemWrapper}>
      {/*<View style={[styles.colorBar, { backgroundColor: getStatusColor(item.status) }]} />*/}
      <View style={[styles.colorBar, { backgroundColor: getStatusColor(item.status) }]} />
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => navigateToTab(item.numero_ordem)}>
          <View style={styles.headerContainer}>
            <Text style={styles.category}>
              <MaterialCommunityIcons name="clipboard-text-outline" color="#000" size={17} /> Nro. OF: {item.numero_ordem}
            </Text>
            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
              <MaterialCommunityIcons name="circle" color={getStatusColor(item.status)} size={12} /> {item.status}
            </Text>
          </View>
          <Text style={styles.title}>{item.referencia} - {item.produto}</Text>
          <View style={styles.footerContainer}>
            <Text style={styles.sequenciado}>Sequenciado: {item.ultima_etapa_conc}</Text>
            <Text style={styles.qtde}>
              Qtd: {item.quantidade} / Etapa: {item.quantidade_pronta} / Já produzida: {item.qtde_ultima_etapa_conc} / À produzir: {item.quantidade_pronta}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  ), []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#09A08D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showCamera ? (
        <CameraBarcode onClose={handleCameraClose} />
      ) : (
        <View style={styles.header}>
          <TextInput
            style={styles.input}
            placeholder="Pesquisar OF"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.button} onPress={toggleCamera}>
            <MaterialCommunityIcons name="barcode-scan" color={'#000'} size={30} />
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={OF}
        renderItem={renderItem}
        keyExtractor={item => item.numero_ordem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#09A08D',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  listContainer: {
    padding: 16,
  },
  itemWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  colorBar: {
    width: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    // backgroundColor: '#09A08D',
  },
  itemContainer: {
    flex: 1,
    padding: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sequenciado: {
    fontSize: 14,
    color: '#888',
  },
  qtde: {
    fontSize: 11,
    color: '#888',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#09A08D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TelasOrdensFab;
