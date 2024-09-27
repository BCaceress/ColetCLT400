import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CameraBarcode from '../CameraBarcode';

const sampleData = [
    { campoSelecionado: 'Referência', value: 'produto', icon: 'identifier' },
    { campoSelecionado: 'Descrição', value: 'descricao', icon: 'format-text' },
    { campoSelecionado: 'Número da Ordem', value: 'numeroOF', icon: 'file-chart' },
    { campoSelecionado: 'Número do Pedido', value: 'pedido', icon: 'file-document' },
];

const TextoList = () => {
    const [palavraChave, setPalavraChave] = useState('');
    const [showCamera, setShowCamera] = useState(false);
    const navigation = useNavigation();

    const handleItemPress = (valorTexto) => {
        if (palavraChave.length >= 3) {
            navigation.navigate('TelasOrdensFab', { selected: palavraChave, variavel: valorTexto });
        } else {
            Alert.alert('Aviso', 'Digite pelo menos 3 caracteres para prosseguir.');
        }
    };

    const handleScanComplete = (scannedCode) => {
        setPalavraChave(scannedCode);
    };

    const clearSearch = () => {
        setPalavraChave('');
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleItemPress(item.value)}
        >
            <MaterialCommunityIcons name={item.icon} size={40} color="#333" style={styles.icon} />
            <Text style={styles.itemText}>{item.campoSelecionado}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {showCamera ? (
                <CameraBarcode onClose={() => setShowCamera(false)} onScanComplete={handleScanComplete} />
            ) : (
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
                        <TouchableOpacity onPress={clearSearch}>
                            <MaterialCommunityIcons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.scanButton}
                        onPress={() => setShowCamera(true)}
                    >
                        <MaterialCommunityIcons name="barcode-scan" size={30} color="#333" />
                    </TouchableOpacity>
                </View>
            )}
            <FlatList
                data={sampleData}
                renderItem={renderItem}
                keyExtractor={(item) => item.value}
                contentContainerStyle={styles.listContainer}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
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
    scanButton: {
        marginLeft: 12,
        padding: 10,
        borderRadius: 30,
        backgroundColor: '#ffffff',
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
        padding: 8,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    itemContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 12,
        margin: 6,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { height: 4, width: 0 },
        elevation: 4,
    },
    itemText: {
        fontSize: 14,
        color: '#333',
        marginTop: 6,
        textAlign: 'center',
    },
});

export default TextoList;
