import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CameraBarcode from '../../components/CameraBarcode';
import api from '../../services/api';

const TelasOrdensFab = ({ route, navigation }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [OF, setOF] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState('Todos');
  const { selected } = route.params || {};
  const { variavel } = route.params || {};

  useEffect(() => {
    fetchData();
  }, [selected, variavel]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const apiInstance = await api();
      const response = await apiInstance.get(`/lista_ordens?${variavel}=${selected}`);

      if (response.data.erro) {

        setError(response.data.erro);
        setOF([]);
      } else {
        setOF(response.data.ordens);
      }
    } catch (error) {
      setError('Erro ao obter dados da API. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (selectedPost === 'Todos') {
      return OF;
    }
    return OF.filter(item =>
      item.etapas_em_andamento.some(etapa => etapa.posto === selectedPost) ||
      item.sequenciamento.some(seq => seq.posto === selectedPost)
    );
  }, [OF, selectedPost]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'Aguardando': return '#FFB300';
      case 'Concluída':
      case 'Concluida': return '#09A08D';
      case 'Interrompida': return '#FF0000';
      case 'Produzindo': return '#1E90FF';
      default: return '#888';
    }
  }, []);

  const renderItem = useCallback(({ item }) => (
    <View style={styles.itemWrapper}>
      <View style={[styles.colorBar, { backgroundColor: getStatusColor(item.status) }]} />
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Tab', { valueOF: item.numero_ordem })}>
          <View style={styles.headerContainer}>
            <Text style={styles.category}>
              <MaterialCommunityIcons name="clipboard-text-outline" color="#000" size={17} />
              OF: <Text style={styles.boldText}>{item.numero_ordem}</Text> Total: {item.quantidade} PC | Pronta: {item.quantidade_pronta} PC
            </Text>
            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
              <MaterialCommunityIcons name="circle" color={getStatusColor(item.status)} size={12} />
              {item.status}
            </Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {item.referencia} - {item.produto}
            </Text>
            {item.status === 'Interrompida' && item.sequenciamento && item.sequenciamento.length > 0 && (
              <Text style={styles.sequenciadoLabel}>Sequenciada</Text>
            )}
          </View>
          {item.status !== "Aguardando" && item.status !== "Interrompida" && (
            <View style={styles.footerContainer}>
              <Text style={styles.sequenciado}>{item.status}: {item.etapas_em_andamento[0]?.processo} | {item.etapas_em_andamento[0]?.posto} | {item.etapas_em_andamento[0]?.operador}</Text>
              {(item.status === 'Produzindo' && item.etapas_em_andamento.length > 1) && (
                <Text style={styles.qtde}>
                  <MaterialCommunityIcons name="plus-circle" color="#000" size={19} />
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  ), [getStatusColor, navigation]);

  const postos = useMemo(() => {
    const allPostos = OF.flatMap(item =>
      item.etapas_em_andamento.map(etapa => etapa.posto)
        .concat(item.sequenciamento.map(seq => seq.posto))
    );
    return Array.from(new Set(allPostos)).concat('Todos');
  }, [OF]);

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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showCamera ? (
        <CameraBarcode onClose={() => setShowCamera(false)} />
      ) : (
        <View style={styles.postoContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.postoList}>
            {postos.map((posto) => (
              <TouchableOpacity
                key={posto}
                style={[
                  styles.postoButton,
                  selectedPost === posto && styles.selectedPost
                ]}
                onPress={() => setSelectedPost(posto)}
              >
                <Text style={[
                  styles.postoText,
                  selectedPost === posto && styles.selectedPostText
                ]}>
                  {posto}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.numero_ordem.toString()}
        contentContainerStyle={styles.listContainer}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  postoContainer: {
    paddingHorizontal: 10,
  },
  postoList: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
  },
  postoButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPost: {
    backgroundColor: '#09A08D',
  },
  postoText: {
    color: '#000',
    fontSize: 14,
  },
  selectedPostText: {
    color: '#FFF',
  },
  listContainer: {
    padding: 16,
  },
  flatList: {
    flex: 1,
  },
  itemWrapper: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  colorBar: {
    width: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
  itemContainer: {
    flex: 1,
    padding: 12,
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
    fontSize: 16,
    color: '#000',
  },
  status: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  sequenciadoLabel: {
    color: '#FF5722',
    fontSize: 12,
    backgroundColor: '#ccc',
    paddingRight: 7,
    paddingLeft: 7,
    borderRadius: 5,
    marginLeft: 10,
  },
  sequenciado: {
    fontSize: 14,
    color: '#555',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtde: {
    fontSize: 15,
    color: '#000',
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
    padding: 20,
  },
  errorText: {
    color: '#FF0000',
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
  },

});

export default TelasOrdensFab;
