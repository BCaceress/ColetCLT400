import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window')

const Opcoes = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.greenBackground} />
            <View style={[styles.card, { width: width * 0.9 }]}>
                <View style={styles.headerContainer}>
                    <MaterialCommunityIcons name="account-circle-outline" color="#000" size={35} style={styles.icon} />
                    <Text style={styles.title}>Daniel Donaduzzi</Text>
                    <Text style={styles.number}>1234</Text>
                </View>
                <Text style={styles.description}>
                    Bem-vindo a Colet Sistemas ...dsadasdygasygdsaygdsadgygdsad
                </Text>
            </View>
            <View style={styles.container2}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('TelasOrdensFab')}
                    style={[styles.button, { width: width * 0.9 }]}
                >
                    <MaterialCommunityIcons name="clipboard-list-outline" color="#fff" size={45} />
                    <Text style={styles.buttonText}>
                        Ordens de Fabricação e Apontamentos
                    </Text>
                </TouchableOpacity>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, { width: (width * 0.9) / 2 - 10 }]}
                    >
                        <MaterialCommunityIcons name="clipboard-outline" color="#fff" size={45} />
                        <Text style={styles.buttonText}>Pedidos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { width: (width * 0.9) / 2 - 10 }]}
                    >
                        <MaterialCommunityIcons name="package-variant" color="#fff" size={45} />
                        <Text style={styles.buttonText}>Produtos e Materiais</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    container2: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.9,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#09A08D',
        padding: 60,
        borderRadius: 8,
        marginVertical: 10,

    },
    buttonText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    greenBackground: {
        backgroundColor: '#09A08D',
        width: '100%',
        height: '10%', // Ajuste a altura conforme necessário
    },
    card: {
        position: 'absolute',
        top: '3%',
        backgroundColor: 'white',
        height: '13%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3, // Ajuste a opacidade da sombra
        shadowRadius: 5, // Ajuste o raio da sombra
        elevation: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    icon: {
        margin: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
    },
    number: {
        fontSize: 18,
        margin: 12,
        fontWeight: 'bold',
        color: '#000',
    },
    description: {
        marginTop: 2,
        marginLeft: 12,
        alignSelf: 'flex-start',
        fontSize: 15,
        color: '#000',
        paddingHorizontal: 20,
    },
})

export default Opcoes
