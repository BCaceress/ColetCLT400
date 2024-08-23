import React, { useCallback, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import PagerView from 'react-native-pager-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DadosProvider, useDados } from '../../../contexts/DadosContext';

const { width } = Dimensions.get('window');

const TabContent = ({ title, items = [], itemRenderer }) => (
    <View style={styles.tabContent}>
        <Text style={styles.tabTitle}>{title}</Text>
        {items.length > 0 ? (
            items.map(itemRenderer)
        ) : (
            <Text style={styles.tabText}>Nenhum item disponível</Text>
        )}
    </View>
);

const AccessoriesTab = ({ item }) => (
    <TabContent
        title="Acessórios"
        items={item.acessorios || []}
        itemRenderer={(acessorio, index) => (
            <Text key={index} style={styles.tabText}>{acessorio.nome} (Ref: {acessorio.referencia})</Text>
        )}
    />
);

const DetailsTab = ({ item }) => (
    <TabContent
        title="Postos Possíveis"
        items={item.postos_possiveis || []}
        itemRenderer={(posto_possiveis, index) => (
            <Text key={index} style={styles.tabText}>{posto_possiveis.codigo_posto} ({posto_possiveis.descricao})</Text>
        )}
    />
);

const ComponentsTab = ({ item }) => (
    <TabContent
        title="Componentes"
        items={item.componentes || []}
        itemRenderer={(componente, index) => (
            <Text key={index} style={styles.tabText}>{componente.nome} (Ref: {componente.referencia})</Text>
        )}
    />
);

const PageIndicator = ({ index, length }) => {
    const indicators = Array.from({ length }, (_, i) => (
        <View
            key={i}
            style={[styles.dot, { backgroundColor: i === index ? colors.primary : colors.grey }]}
        />
    ));
    return <View style={styles.dotContainer}>{indicators}</View>;
};

const ExpandedContent = ({ item, currentPage, setCurrentPage }) => (
    <>
        <PagerView
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
            <View key="accessories" style={styles.pagerPage}>
                <AccessoriesTab item={item} />
            </View>
            <View key="details" style={styles.pagerPage}>
                <DetailsTab item={item} />
            </View>
            <View key="components" style={styles.pagerPage}>
                <ComponentsTab item={item} />
            </View>
        </PagerView>
        <PageIndicator index={currentPage} length={3} />
    </>
);

const ProcessosContent = ({ valueOF }) => {
    const { dados, isLoading, processosLista = [] } = useDados();
    const [expandedItemId, setExpandedItemId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    const renderItem = useCallback(({ item }) => {
        const isExpanded = item.processo === expandedItemId;

        return (
            <View style={styles.itemContainer}>
                <Pressable
                    onPress={() => setExpandedItemId(isExpanded ? null : item.processo)}
                    style={styles.itemHeader}
                >
                    <Text style={styles.itemProcess}>{item.processo}</Text>
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemAction}>{item.acao}</Text>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemText}>Prod: {item.quantidade} Queb: 0</Text>
                        </View>
                    </View>
                    <View style={styles.itemIcons}>
                        {item.acessorios && item.acessorios.length > 0 && (
                            <MaterialCommunityIcons name="hammer-screwdriver" size={24} color={colors.white} style={styles.icon} />
                        )}
                        {item.postos_possiveis && item.postos_possiveis.length > 0 && (
                            <MaterialCommunityIcons name="clipboard-text" size={24} color={colors.white} style={styles.icon} />
                        )}
                        <MaterialCommunityIcons name="flask" size={24} color={colors.white} />
                    </View>
                    <View style={styles.actionButtons}>
                        {['play', 'pause', 'stop'].map((action, index) => (
                            <Pressable key={index} style={styles.actionButton}>
                                <MaterialCommunityIcons name={action} size={32} color={colors.white} />
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
                {isExpanded && (
                    <ExpandedContent item={item} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                )}
            </View>
        );
    }, [expandedItemId, currentPage]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Processos</Text>
            </View>
            <FlatList
                data={processosLista}
                keyExtractor={(item) => item.processo.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const Processos = ({ route }) => {
    const { valueOF } = route.params;
    return (
        <SafeAreaView style={styles.safeArea}>
            <DadosProvider valueOF={valueOF}>
                <ProcessosContent valueOF={valueOF} />
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
        padding: 16,
    },
    header: {
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.dark,
    },
    itemContainer: {
        marginBottom: 12,
        backgroundColor: colors.white,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 5,
        borderBottomWidth: 1,
        borderColor: colors.grey,
    },
    itemProcess: {
        fontWeight: 'bold',
        color: colors.white,
        fontSize: 18,
        marginRight: 16,
    },
    itemDetails: {
        flex: 1,
    },
    itemAction: {
        fontWeight: 'bold',
        color: colors.white,
        fontSize: 16,
    },
    itemInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemText: {
        color: colors.white,
    },
    itemIcons: {
        flexDirection: 'row',
        marginRight: 40,
    },
    icon: {
        marginRight: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 8,
    },
    actionButton: {
        padding: 8,
    },
    pagerView: {
        height: 150,
        width: width,
    },
    pagerPage: {
        flex: 1,
    },
    tabContent: {
        padding: 16,
        backgroundColor: colors.white,
    },
    tabTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 8,
    },
    tabText: {
        color: colors.medium,
        fontSize: 16,
        marginBottom: 4,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 12,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 6,
    },
    listContainer: {
        paddingBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: colors.dark,
    },
});

export default Processos;
