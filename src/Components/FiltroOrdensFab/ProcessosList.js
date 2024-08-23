import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ProcessosList = ({ dataList }) => {
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
                item.PROCESSO.toLowerCase().includes(lowerCaseSearchText)
            )
        );
    };

    const handleSearchChange = (text) => {
        setSearchText(text);
    };

    const handleItemPress = (codigoProcesso) => {
        navigation.navigate('TelasOrdensFab', { selected: codigoProcesso, variavel: 'processos' });
    };

    const renderItem = ({ item }) => (
        <Pressable
            style={({ pressed }) => [
                styles.item,
                item.selected ? styles.selectedItem : {},
                pressed ? styles.pressedItem : {},
            ]}
            onPress={() => handleItemPress(item.PROCESSO)}
        >
            <Text style={styles.itemText}>
                {item.PROCESSO}
            </Text>
            {item.selected && (
                <MaterialCommunityIcons name="check" size={24} color="#09A08D" />
            )}
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#333" style={styles.icon} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Filtrar por processo"
                        value={searchText}
                        onChangeText={handleSearchChange}
                        placeholderTextColor="#999"
                    />
                </View>
            </View>
            <FlatList
                data={filteredData}
                keyExtractor={item => item.PROCESSO}
                renderItem={renderItem}
                contentContainerStyle={styles.flatList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        flexDirection: 'column',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        padding: 15,
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#BDBDBD',
        borderWidth: 1,
        borderRadius: 30,
        backgroundColor: '#ffffff',
        flex: 1,
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
        color: '#333',
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
    pressedItem: {
        backgroundColor: '#e6f7ff',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    flatList: {
        flexGrow: 1,
        marginBottom: 10,
    },
});

export default ProcessosList;
