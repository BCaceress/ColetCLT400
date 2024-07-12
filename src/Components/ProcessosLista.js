import React, { useState } from 'react';
import {
    FlatList,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDados } from '../contexts/DadosContext';

export default function ProcessosLista() {
    const { processosLista, isLoading } = useDados();
    const [expandedItemId, setExpandedItemId] = useState(null);

    const renderItem = ({ item }) => {
        const isExpanded = item.processo === expandedItemId;

        return (
            <TouchableOpacity onPress={() => setExpandedItemId(item.processo)} style={{
                marginBottom: 2,
            }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#3a3a3a',
                        padding: 16,
                        borderBottomWidth: 1,
                        borderColor: '#E0E0E0',
                    }}>
                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 20, marginRight: 12 }}>{item.processo}</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>{item.acao}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', color: '#fff' }}>
                            <Text>Prod: {item.quantidade}   Queb: 0</Text>
                        </View>
                    </View>

                    <View style={{ alignItems: 'center', flexDirection: 'row', marginRight: 80 }}>
                        <MaterialCommunityIcons name="clipboard-text" size={20} color="#fff" style={{ marginRight: 5 }} />
                        <MaterialCommunityIcons name="hammer-screwdriver" size={20} color="#fff" style={{ marginRight: 5 }} />
                        <MaterialCommunityIcons name="flask" size={20} color="#fff" />
                    </View>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="play" size={40} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="pause" size={40} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="stop" size={40} color="#fff" />
                    </TouchableOpacity>
                </View>
                {
                    isExpanded && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', color: '#fff', backgroundColor: '#000' }}>
                            <Text>Testando aba de detalhes, acessórios e Componentes</Text>
                        </View>
                    )
                }
            </TouchableOpacity >

        );
    };

    return (
        <ShimmerPlaceHolder
            style={{ width: '100%', height: '100%' }}
            visible={isLoading}
            LinearGradient={LinearGradient}
        >
            <FlatList
                data={processosLista}
                keyExtractor={(item) => item.processo}
                renderItem={renderItem}
            />
        </ShimmerPlaceHolder>
    )
}