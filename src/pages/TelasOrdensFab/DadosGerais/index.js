import React from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DadosProvider, useDados } from '../../../contexts/DadosContext';

const DadosGeraisContent = ({ valueOF }) => {
    const { dados, isLoading } = useDados();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando...</Text>
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
        <View style={styles.pedidoItem}>
            <Text style={styles.pedidoQuantity}>{item.pedido}</Text>
            <Text style={styles.pedidoText}>{item.linha}</Text>
            <Text style={styles.pedidoText}>{item.cliente}</Text>
            <Text style={styles.pedidoText}>{item.quantidade} {item.unidade}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dados Gerais</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Nro OF: {dados?.ordem?.numero_ordem}</Text>
                    <MaterialCommunityIcons name="file-document" size={29} color={colors.white} />
                </View>
                <Text style={styles.cardContent}>
                    Produto: {dados?.ordem?.referencia} - {dados?.ordem?.produto}
                </Text>
                <Text style={styles.cardContent}>
                    Classificação: {dados?.ordem?.classificacao} - {dados?.ordem?.nome_classificacao}
                </Text>
                <Text style={styles.cardReference}>OF Original:</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{dados?.ordem?.quantidade}</Text>
                    <Text style={styles.statLabel}>Qntd da OF</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{dados?.ordem?.quantidade_pronta}</Text>
                    <Text style={styles.statLabel}>Qntd Pronta</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{dados?.ordem?.qtde_ultima_etapa_conc}</Text>
                    <Text style={styles.statLabel}>Qntd a Produzir</Text>
                </View>
            </View>

            <View style={styles.verticalContainer}>
                {renderVerticalItem("calendar-edit", 'Geração', dados?.ordem?.data_geracao, `por: ${dados?.ordem?.usuario_geracao}`)}
                {renderVerticalItem("calendar-clock", 'Programação', dados?.ordem?.data_programacao, `por: ${dados?.ordem?.usuario_programacao}`)}
                {renderVerticalItem("calendar-check", 'Conclusão', dados?.ordem?.data_conclusao, `por: ${dados?.ordem?.usuario_conclusao}`)}
            </View>

            <View style={styles.pedidosContainer}>
                <Text style={styles.pedidosTitle}>Pedidos Vinculados</Text>
                {dados?.ordem?.pedidos?.length > 0 ? (
                    <FlatList
                        data={dados.ordem.pedidos}
                        renderItem={renderPedidoItem}
                        keyExtractor={(item) => item.pedido.toString()}
                    />
                ) : (
                    <Text style={styles.noPedidosText}>Não há pedidos disponíveis.</Text>
                )}
            </View>
        </View>
    );
};

const DadosGerais = ({ route }) => {
    const { valueOF } = route.params;

    return (
        <SafeAreaView style={styles.safeArea}>
            <DadosProvider valueOF={valueOF}>
                <DadosGeraisContent valueOF={valueOF} />
            </DadosProvider>
        </SafeAreaView>
    );
};

const colors = {
    primary: '#09A08D',
    white: '#FFFFFF',
    grey: '#F5F5F5',
    dark: '#333',
    medium: '#666',
    light: '#888',
    blue: '#3f51b5',
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.grey,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.dark,
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
        marginBottom: 20
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
    cardReference: {
        fontSize: 14,
        color: colors.blue,
        marginTop: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: colors.light,
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
        textAlign: 'center',
    },
    verticalDate: {
        fontSize: 14,
        color: colors.light,
        marginTop: 4,
        textAlign: 'center',
    },
    verticalUser: {
        fontSize: 12,
        color: colors.medium,
        marginTop: 2,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 20,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    statItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 10,
    },
    statValue: {
        color: colors.dark,
        fontSize: 24,
        fontWeight: 'bold',
    },
    statLabel: {
        color: colors.light,
        fontSize: 16,
        marginTop: 5,
    },
    pedidosContainer: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 15,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    pedidosTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: 11,
    },
    pedidoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: colors.grey,
        borderRadius: 8,
        padding: 10,
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    pedidoText: {
        fontSize: 16,
        color: colors.dark,
    },
    pedidoQuantity: {
        fontSize: 16,
        color: colors.dark,
        fontWeight: 'bold',
    },
    noPedidosText: {
        textAlign: 'center',
        fontSize: 16,
        color: colors.medium,
    },
});

export default DadosGerais;
