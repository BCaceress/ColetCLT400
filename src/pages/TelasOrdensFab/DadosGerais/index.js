import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDados } from '../../../contexts/DadosContext';
import { colors, globalStyles } from "../../../styles/globalStyles";

const getStatusColor = (status) => {
    switch (status) {
        case 'Aguardando':
            return '#FFB300';
        case 'Concluída':
        case 'Concluida':
            return '#09A08D';
        case 'Interrompida':
            return '#FF0000';
        case 'Produzindo':
            return '#1E90FF';
        default:
            return '#888';
    }
};

const DadosGeraisContent = () => {
    const { dados, isLoading } = useDados();
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (dados?.error) {
            Alert.alert(
                'Erro',
                dados.error,
                [
                    { text: 'Voltar', onPress: () => navigation.goBack() },
                ]
            );
        }
    }, [dados?.error, navigation]);

    const statusColor = getStatusColor(dados?.ordem?.status);

    if (isLoading) {
        return (
            <View style={globalStyles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const renderVerticalItem = (iconName, label, date, user) => (
        <View style={styles.verticalItem}>
            <MaterialCommunityIcons name={iconName} size={28} color={colors.primary} />
            <Text style={styles.verticalLabel}>{label}</Text>
            <Text style={styles.verticalDate}>{date}</Text>
            {user && <Text style={styles.verticalUser}>{user}</Text>}
        </View>
    );

    const renderPedidoItem = ({ item }) => (
        <View style={styles.pedidoCard}>
            <View style={styles.pedidoHeader}>
                <View style={styles.pedidoInfo}>
                    <Text style={styles.pedidoTitle}>{item.referencia} - {item.nome_referencia}</Text>
                    <Text style={styles.pedidoSubtitle}>Pedido: {item.pedido}.{item.linha}  •  Cliente: {item.cliente}  •  Qtde: {item.quantidade} {item.unidade}</Text>
                    <View style={styles.pedidoBottomContainer}>
                        <View style={styles.pedidoRatingContainer}>
                            <MaterialCommunityIcons name="calendar-month" size={17} color="#aaa" />
                            <Text style={styles.pedidoRatingText}>{item.data}</Text>
                            <Text style={styles.pedidoTimeText}>•  <MaterialCommunityIcons name="truck" size={17} color="#aaa" /> {item.entrega}</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonPedidoDetailsText}>
                            <Text style={styles.pedidoDetailsText}>Ver mais</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderImageItem = ({ item }) => (
        <Pressable
            onPress={() => {
                setSelectedImage(item.url);
                setModalVisible(true);
            }}
            style={styles.imageContainer}
        >
            <Image
                source={{ uri: item.url }}
                style={styles.image}
                resizeMode="cover" // Ajuste conforme necessário
            />
        </Pressable>
    );
    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.headerTitle}>Dados Gerais</Text>
            </View>
            <View style={styles.containerHeader}>
                <View style={styles.containerHeader2}>
                    <View style={styles.balanceContainer}>
                        <Text style={styles.textOrdem}>Número Ordem</Text>
                        <Text style={styles.textNroOrdem}>{dados?.ordem?.numero_ordem}</Text>
                    </View>
                    <TouchableOpacity style={styles.buttonStatus}>
                        <Text style={styles.buttonStatusText}>
                            <MaterialCommunityIcons name="circle" color={statusColor} size={12} /> {dados?.ordem?.status}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.cardContent}>
                    Produto: <Text style={styles.textBold}>{dados?.ordem?.referencia} - {dados?.ordem?.produto}</Text>
                </Text>
                <Text style={styles.cardContent}>
                    Classificação: <Text style={styles.textBold}>{dados?.ordem?.classificacao} - {dados?.ordem?.nome_classificacao}</Text>
                </Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{dados?.ordem?.quantidade}</Text>
                        <Text style={styles.statLabel}>Qntd da OF</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{dados?.ordem?.quantidade_pronta}</Text>
                        <Text style={styles.statLabel}>Qntd Pronta</Text>
                    </View>
                    <View style={[styles.statItem, styles.statItemLast]}>
                        <Text style={styles.statValue}>{dados?.ordem?.qtde_ultima_etapa_conc}</Text>
                        <Text style={styles.statLabel}>Qntd a Produzir</Text>
                    </View>
                </View>
            </View>

            <View style={styles.verticalContainer}>
                {renderVerticalItem("calendar-edit", 'Geração', dados?.ordem?.data_geracao, dados?.ordem?.usuario_geracao)}
                {renderVerticalItem("calendar-clock", 'Programação', dados?.ordem?.data_programacao)}
                {renderVerticalItem("calendar-check", 'Conclusão', dados?.ordem?.data_conclusao, dados?.ordem?.usuario_conclusao)}
            </View>

            <View>
                <Text style={styles.pedidosTitle}>Pedidos Vinculados</Text>
                {dados?.ordem?.pedidos?.length > 0 ? (
                    <FlatList
                        data={dados.ordem.pedidos}
                        renderItem={renderPedidoItem}
                        keyExtractor={(item) => item.pedido.toString()}
                    />
                ) : (
                    <View style={styles.noPedidosTextContainer}>
                        <Text style={styles.noPedidosText}>Não há pedidos disponíveis.</Text>
                    </View>
                )}
            </View>

            <View style={styles.galleryContainer}>
                {dados?.ordem?.imagens?.length > 0 ? (
                    <>
                        <Text style={styles.galleryTitle}>Imagens</Text>
                        <FlatList
                            data={dados.ordem.imagens}
                            renderItem={renderImageItem}
                            keyExtractor={(item) => item.url}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </>
                ) : (
                    null
                )}
            </View>

            {selectedImage && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <Pressable
                        style={styles.modalBackground}
                        onPress={() => setModalVisible(false)}
                    >
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.modalImage}
                        />
                    </Pressable>
                </Modal>
            )}
        </View>
    );
};

const DadosGerais = () => {
    return (
        <View style={globalStyles.safeArea}>
            <DadosGeraisContent />
        </View>
    );
};

const styles = StyleSheet.create({
    containerHeader: {
        backgroundColor: colors.white,
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    containerHeader2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    balanceContainer: {
        flex: 1,
    },
    textOrdem: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    textNroOrdem: {
        color: '#000',
        fontSize: 22,
        fontWeight: 'bold',
    },
    buttonStatus: {
        padding: 10,
        borderRadius: 30,
        backgroundColor: '#ffffff',
        borderColor: '#ddd',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonStatusText: {
        color: "#0a0a0a",
        fontSize: 14,
        fontWeight: 'bold',
    },

    card: {
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 20,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        marginVertical: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: colors.primary,
        borderRadius: 10,
        padding: 5,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
    },
    cardContent: {
        fontSize: 15,
        color: colors.medium,
        marginBottom: 3,
    },
    textBold: {
        fontWeight: 'bold'
    },
    cardReference: {
        fontSize: 14,
        color: colors.blue,
        marginTop: 5,
    },
    loadingText: {
        fontSize: 18,
        color: colors.medium,
    },
    statsContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        padding: 7,
    },
    statItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    statItemLast: {
        borderRightWidth: 0,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.dark,
    },
    statLabel: {
        fontSize: 14,
        color: colors.medium,
    },
    verticalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    verticalItem: {
        flex: 1,
        alignItems: 'center',
        padding: 15,
        backgroundColor: colors.white,
        borderRadius: 15,
        marginHorizontal: 5,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    verticalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
        marginTop: 10,
    },
    verticalDate: {
        fontSize: 14,
        color: colors.medium,
        marginTop: 2,
    },
    verticalUser: {
        fontSize: 12,
        color: colors.light,
        marginTop: 1,
    },

    pedidosTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: 15,
    },
    pedidoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    pedidoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pedidoInfo: {
        marginLeft: 5,
        flex: 1,
    },
    pedidoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#09A08D',
    },
    pedidoSubtitle: {
        fontSize: 14,
        color: '#424242',
        marginTop: 2,
    },
    pedidoRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    pedidoRatingText: {
        fontSize: 14,
        color: '#aaa',
        marginLeft: 5,
    },
    pedidoTimeText: {
        fontSize: 14,
        color: '#aaa',
        marginLeft: 10,
    },
    pedidoBottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    buttonPedidoDetailsText: {
        backgroundColor: '#09A08D',
        borderRadius: 8,
        paddingHorizontal: 8, paddingVertical: 3
    },
    pedidoDetailsText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    noPedidosTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noPedidosText: {
        color: '#aaa',
    },
    galleryContainer: {
        marginTop: 20,
    },
    galleryTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: 15,
    },
    imageContainer: {
        marginRight: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default DadosGerais;
