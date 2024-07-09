import React from 'react'
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome6'

const { width } = Dimensions.get('window')

const Opcoes = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.greenBackground} />
            <View style={[styles.card, { width: width * 0.9 }]}>
                <View style={styles.headerContainer}>
                    <Icon
                        name="user-circle"
                        style={styles.icon}
                        size={35}
                        color="#000"
                    />
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
                    <Icon name="clipboard-list" size={45} color="#fff" />
                    <Text style={styles.buttonText}>
                        Ordens de Fabricação e Apontamentos
                    </Text>
                </TouchableOpacity>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, { width: (width * 0.9) / 2 - 10 }]}
                    >
                        <Icon name="clipboard" size={45} color="#fff" />
                        <Text style={styles.buttonText}>Pedidos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { width: (width * 0.9) / 2 - 10 }]}
                    >
                        <Icon name="box" style={styles.icon} size={45} color="#fff" />
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
        borderRadius: 5,
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
        top: '3%', // Ajuste para posicionar o card corretamente
        backgroundColor: 'white',
        height: '13%', // Ajuste a altura do card conforme necessário
        borderRadius: 10,
        // Sombra para o card (opcional)
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        width: '100%', // Garante que o container ocupe toda a largura do card
        justifyContent: 'space-between', // Alinha os itens nas extremidades do container
        paddingHorizontal: 20, // Adiciona espaçamento nas laterais
    },
    icon: {
        margin: 12, // Espaçamento entre o ícone e o título
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        flex: 1, // Permite que o título ocupe o espaço disponível
    },
    number: {
        fontSize: 18,
        margin: 12,
        fontWeight: 'bold',
        color: '#000',
    },
    description: {
        marginTop: 2, // Espaçamento entre o título e a descrição
        marginLeft: 12,
        alignSelf: 'flex-start',
        fontSize: 15,
        color: '#000',
        paddingHorizontal: 20, // Alinha com o título acima
    },
})

export default Opcoes
