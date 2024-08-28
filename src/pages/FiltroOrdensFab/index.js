import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DeviceInformation from 'react-native-device-info';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ClientesList from '../../components/FiltroOrdensFab/ClientesList';
import GruposList from '../../components/FiltroOrdensFab/GruposList';
import PostosList from '../../components/FiltroOrdensFab/PostosList';
import ProcessosList from '../../components/FiltroOrdensFab/ProcessosList';
import TextoList from '../../components/FiltroOrdensFab/TextoList';
import permissaoUsuarios from '../../hooks/permissaoUsuarios';
import getApiInstance from '../../services/api';
const FiltroOrdensFab = () => {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('referencia');
  const [dataList, setDataList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('postos');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isApontamentosActive, setIsApontamentosActive] = useState(false);
  const permissao = permissaoUsuarios();
  const navigation = useNavigation();
  useEffect(() => {
    fetchData(selectedType);
  }, [selectedType]);

  useEffect(() => {
    // Atualize o título da tela com base no filtro selecionado
    const titles = {
      clientes: 'Filtro de Clientes',
      grupos: 'Filtro de Grupos',
      processos: 'Filtro de Processos',
      postos: 'Filtro de Postos',
      texto: 'Filtro de Texto'
    };
    navigation.setOptions({ title: titles[selectedType] || 'Filtro de Ordens' });
  }, [selectedType, navigation]);

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
        return <PostosList dataList={dataList} onItemPress={handleItemSelection} onApontamentosToggle={setIsApontamentosActive} />;
    }
  }, [selectedType, dataList, handleItemSelection, setIsApontamentosActive]);

  const renderButton = useCallback((label, iconName, type) => {
    if (isApontamentosActive && type !== 'postos') {
      return null; // Não renderiza os botões quando Apontamentos está ativo
    }
    if (permissao === 'A' && type !== 'postos') {
      return null; // Não renderiza os botões que não têm permissão
    }
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedType === type ? styles.selectedButton : styles.unselectedButton]}
          onPress={() => setSelectedType(type)}
          disabled={permissao === 'A' && type !== 'postos'}
        >
          <MaterialCommunityIcons name={iconName} size={30} color={selectedType === type ? '#fff' : '#404040'} />
        </TouchableOpacity>
        <Text style={[styles.buttonText, { color: selectedType === type ? '#fff' : '#404040' }]}>{label}</Text>
      </View>
    );
  }, [selectedType, permissao, isApontamentosActive]);

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground} />
      <View style={styles.buttonsRow}>
        {renderButton("Postos", "tools", "postos")}
        {renderButton("Clientes", "briefcase-account", "clientes")}
        {renderButton("Grupos", "tag", "grupos")}
        {renderButton("Processos", "transfer", "processos")}
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
    backgroundColor: '#F5F5F5',
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
    width: '20%',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
  unselectedButton: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  containerList: {
    flex: 1,
    width: '100%',
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
