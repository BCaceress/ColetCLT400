import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeviceInformation from 'react-native-device-info';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ClientesList from '../../components/FiltroOrdensFab/ClientesList';
import GruposList from '../../components/FiltroOrdensFab/GruposList';
import PostosList from '../../components/FiltroOrdensFab/PostosList';
import ProcessosList from '../../components/FiltroOrdensFab/ProcessosList';
import TextoList from '../../components/FiltroOrdensFab/TextoList'; // Importe o novo componente
import getApiInstance from '../../services/api';

const FiltroOrdensFab = () => {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('referencia');
  const [dataList, setDataList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('postos');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchData(selectedType);
  }, [selectedType]);

  const fetchData = useCallback(async (type) => {
    let apiEndpoint = '';
    switch (type) {
      case 'clientes':
        apiEndpoint = '/clientes_ordens';
        break;
      case 'grupos':
        apiEndpoint = '/grupos_ordens';
        break;
      case 'processos':
        apiEndpoint = '/processos_ordens';
        break;
      case 'postos':
      default:
        const id = await DeviceInformation.getUniqueId();
        apiEndpoint = `/dispositivo?id=${id}`;
        break;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const apiInstance = await getApiInstance();
      const response = await apiInstance.get(apiEndpoint);

      const data = Array.isArray(response.data) ? response.data :
        Array.isArray(response.data.postos) ? response.data.postos :
          [];

      if (data.length === 0) {
        setErrorMessage('Nenhum dado encontrado.');
      }

      setDataList(data.map(item => ({ ...item, selected: false })));
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setErrorMessage('Erro ao buscar dados. Por favor, tente novamente.');
      setDataList([]);
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
  };

  const handleItemSelection = (itemId) => {
    const updatedList = dataList.map(item => {
      const isSelected = item[selectedType === 'clientes' ? 'CODIGO_EMPRESA' : selectedType === 'grupos' ? 'CLASSIFICACAO' : selectedType === 'processos' ? 'PROCESSO' : 'CODIGO_POSTO'] === itemId;
      if (isSelected) {
        return { ...item, selected: !item.selected };
      } else if (selectedType !== 'postos') {
        return { ...item, selected: false };
      }
      return item;
    });

    if (!_.isEqual(dataList, updatedList)) {
      setDataList(updatedList);
    }

    setSelectedItem(itemId);
  };

  const ListComponent = useMemo(() => {
    switch (selectedType) {
      case 'clientes':
        return <ClientesList dataList={dataList} onItemPress={handleItemSelection} />;
      case 'grupos':
        return <GruposList dataList={dataList} onItemPress={handleItemSelection} />;
      case 'processos':
        return <ProcessosList dataList={dataList} onItemPress={handleItemSelection} />;
      case 'texto':
        return <TextoList onItemPress={handleItemSelection} />;
      case 'postos':
      default:
        return <PostosList dataList={dataList} onItemPress={handleItemSelection} />;
    }
  }, [selectedType, dataList, handleItemSelection]);

  const renderButton = useCallback((label, iconName, type) => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, selectedType === type && styles.selectedButton]}
        onPress={() => setSelectedType(type)}
      >
        <MaterialCommunityIcons name={iconName} size={33} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.buttonText}>{label}</Text>
    </View>
  ), [selectedType]);

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground} />
      <View style={styles.buttonsRow}>
        {renderButton("Postos", "map-marker-radius", "postos")}
        {renderButton("Clientes", "account-multiple-check", "clientes")}
        {renderButton("Grupos", "account-group", "grupos")}
        {renderButton("Processos", "sort-variant", "processos")}
        {renderButton("Texto", "form-textbox", "texto")}
      </View>
      <View style={styles.containerList}>
        {loading ? (
          <ActivityIndicator size="large" color="#09A08D" style={styles.loader} />
        ) : errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : (
          ListComponent
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  headerBackground: {
    backgroundColor: '#09A08D',
    width: '100%',
    height: '13%',
    position: 'absolute',
    top: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  buttonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 10,
    width: '20%',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#404040',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
  },
  selectedButton: {
    backgroundColor: '#00796B',
  },
  buttonText: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
  },
  containerList: {
    flex: 1,
    width: '95%',
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FiltroOrdensFab;
