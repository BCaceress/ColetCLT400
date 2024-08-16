import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const sampleData = [
    { campoSelecionado: 'Referência', value: 'produto', icon: 'file-table-box' },
    { campoSelecionado: 'Descrição', value: 'descricao', icon: 'format-text-variant' },
    { campoSelecionado: 'Número da Ordem', value: 'numeroOF', icon: 'file-chart' },
    { campoSelecionado: 'Número do Pedido', value: 'pedido', icon: 'file-document' },
];

const TextoList = () => {
    const [palavraChave, setPalavraChave] = useState('');
    const navigation = useNavigation();
    
    const handleItemPress = (valorTexto) => {
        navigation.navigate('TelasOrdensFab', { selected: palavraChave, variavel: valorTexto });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleItemPress([item.value])}
        >
            <MaterialCommunityIcons name={item.icon} size={40} color="#333" style={styles.icon} />
            <Text style={styles.itemText}>{item.campoSelecionado}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#333" style={styles.icon} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Digite palavras-chave…"
                        placeholderTextColor="#999"
                        value={palavraChave}
                        onChangeText={(text) => setPalavraChave(text)}
                    />
                </View>
                <TouchableOpacity style={styles.scanButton}>
                    <MaterialCommunityIcons name="barcode-scan" size={30} color="#333" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={sampleData}
                renderItem={renderItem}
                keyExtractor={(item) => item.value}
                contentContainerStyle={styles.listContainer}
                numColumns={2}
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
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: '#eee',
        elevation: 2,
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25,
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    scanButton: {
        marginLeft: 10,
        padding: 10,
        borderRadius: 25,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    listContainer: {
        padding: 10,
    },
    itemContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { height: 3, width: 0 },
        elevation: 5,
    },
    itemText: {
        fontSize: 14,
        color: '#333',
        marginTop: 8,
        textAlign: 'center',
    },
});

export default TextoList;