import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PostosList = ({ dataList }) => {
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(dataList);
    const [selectedItems, setSelectedItems] = useState([]);
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
                `${item.DESCRICAO}`.toLowerCase().includes(lowerCaseSearchText) ||
                `${item.CODIGO_POSTO}`.toLowerCase().includes(lowerCaseSearchText)
            )
        );
    };

    const handleSearchChange = (text) => {
        setSearchText(text);
    };

    const handleItemPress = (codigoPosto) => {
        setSelectedItems(prevSelectedItems => {
            const isSelected = prevSelectedItems.includes(codigoPosto);
            if (isSelected) {
                return prevSelectedItems.filter(item => item !== codigoPosto);
            } else {
                return [...prevSelectedItems, codigoPosto];
            }
        });
    };

    const handleSubmit = () => {
        navigation.navigate('TelasOrdensFab', { selected: selectedItems, variavel: 'postos' });
    };

    const renderItem = ({ item }) => (
        <Pressable
            style={({ pressed }) => [
                styles.item,
                selectedItems.includes(item.CODIGO_POSTO) ? styles.selectedItem : {},
                pressed ? styles.pressedItem : {},
            ]}
            onPress={() => handleItemPress(item.CODIGO_POSTO)}
        >
            <Text style={styles.itemText}>
                {item.DESCRICAO} ({item.CODIGO_POSTO})
            </Text>
            {selectedItems.includes(item.CODIGO_POSTO) && (
                <MaterialCommunityIcons name="check" size={24} color="#09A08D" />
            )}
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Selecionar postos</Text>
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#333" style={styles.icon} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Filtrar por descrição ou código"
                        value={searchText}
                        onChangeText={handleSearchChange}
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={item => item.CODIGO_POSTO}
                renderItem={renderItem}
                style={styles.flatList}
            />

            <Pressable
                style={[
                    styles.submitButton,
                    selectedItems.length === 0 ? styles.disabledButton : {},
                ]}
                onPress={selectedItems.length > 0 ? handleSubmit : null}
                disabled={selectedItems.length === 0}
            >
                <Text style={styles.submitButtonText}>
                    {selectedItems.length === 0 ? 'Nenhum posto selecionado' : 'Postos Selecionados'}
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f8f8f8',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginVertical: 5,
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
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#000',
    },
    selectedItem: {
        backgroundColor: '#d3f9d8',
    },
    pressedItem: {
        backgroundColor: '#e6f7ff',
    },
    itemText: {
        fontSize: 16,
        color: '#000',
    },
    flatList: {
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#09A08D',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ddd',
    },
});

export default PostosList;
