import { useNavigation } from '@react-navigation/native'; 
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const ClientesList = ({ dataList }) => {
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(dataList);
    const navigation = useNavigation();

    useEffect(() => {
        filterData();
    }, [searchText, dataList]);

    const filterData = () => {
        if (!searchText) {
            setFilteredData(dataList);
            return;
        }
        const lowerCaseSearchText = searchText.toLowerCase();
        setFilteredData(
            dataList.filter(item =>
                `${item.NOME} (${item.CODIGO_EMPRESA})`.toLowerCase().includes(lowerCaseSearchText)
            )
        );
    };

    const handleSearchChange = (text) => {
        setSearchText(text);
    };

    const handleItemPress = (codigoEmpresa) => {
        navigation.navigate('TelasOrdensFab', { selected: codigoEmpresa, variavel: 'cliente' });
    };

    const renderItem = ({ item }) => (
        <Pressable
            style={({ pressed }) => [
                styles.item,
                pressed ? styles.pressedItem : {},
            ]}
            onPress={() => handleItemPress(item.CODIGO_EMPRESA)}
        >
            <Text style={styles.itemText}>
                {`${item.NOME} (${item.CODIGO_EMPRESA})`}
            </Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Selecionar clientes</Text>
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#333" style={styles.icon} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Filtrar por nome ou código"
                        value={searchText}
                        onChangeText={handleSearchChange}
                        placeholderTextColor="#999"
                    />
                </View>
            </View>
            <FlatList
                data={filteredData}
                keyExtractor={item => item.CODIGO_EMPRESA}
                renderItem={renderItem}
                contentContainerStyle={styles.flatList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f8f8f8',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 7,
        backgroundColor: '#ccc',
        elevation: 2,
        justifyContent: 'space-between',
        borderRadius: 15
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#333",
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25,
        backgroundColor: '#fff',
        flex: 1,
        marginLeft: 10,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    textInput: {
        height: 40,
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginVertical: 5,
        elevation: 1,
    },
    pressedItem: {
        backgroundColor: '#e6f7ff',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    flatList: {
        paddingBottom: 20,
    },
});

export default ClientesList;
