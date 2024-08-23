import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

    const handleSelectAll = () => {
        const allItems = filteredData.map(item => item.CODIGO_POSTO);
        setSelectedItems(allItems);
    };

    const handleDeselectAll = () => {
        setSelectedItems([]);
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
            <Text style={[
                styles.itemText,
                selectedItems.includes(item.CODIGO_POSTO) ? styles.selectedItemText : {}
            ]}>
                {item.DESCRICAO} ({item.CODIGO_POSTO})
            </Text>
            {selectedItems.includes(item.CODIGO_POSTO) && (
                <MaterialCommunityIcons name="check" size={23} color="#00C853" />
            )}
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Filtrar por descrição ou código"
                        value={searchText}
                        onChangeText={handleSearchChange}
                        placeholderTextColor="#999"
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={handleSelectAll}
                    >
                        <MaterialCommunityIcons name="checkbox-marked-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={handleDeselectAll}
                    >
                        <MaterialCommunityIcons name="checkbox-blank-off-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={item => item.CODIGO_POSTO}
                renderItem={renderItem}
                contentContainerStyle={styles.flatList}
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
        backgroundColor: '#F5F5F5',
        flexDirection: 'column',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginStart: 14,
        marginEnd: 14
    },
    selectedItem: {
        backgroundColor: '#E8F5E9',
    },
    pressedItem: {
        backgroundColor: '#B3E5FC',
    },
    selectedItemText: {
        color: '#1B5E20',
    },
    itemText: {
        fontSize: 16,
        color: '#333333',
    },
    flatList: {
        flexGrow: 1,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#00796B',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginStart: 14,
        marginEnd: 14,
        borderRadius: 15
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#aaa',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        padding: 15,

    },
    searchContainer: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#BDBDBD',
        borderWidth: 1,
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    icon: {
        marginRight: 10,
    },
    textInput: {
        height: 40,
        flex: 1,
        fontSize: 16,
        color: '#333333',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    iconButton: {
        marginLeft: 12,
        padding: 10,
        borderRadius: 30,
        backgroundColor: '#ffffff',
        borderColor: '#ddd',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PostosList;
