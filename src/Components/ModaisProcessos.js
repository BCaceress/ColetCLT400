import { Picker } from '@react-native-picker/picker';
import debounce from 'lodash.debounce';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDados } from '../contexts/DadosContext';
import api from '../services/api';

export const ModalNaoIniciado = ({ visible, onClose, postos, acao, numeroOrdem, lote, processo }) => {
    const [selectedPosto, setSelectedPosto] = useState('');
    const [operadorCodigo, setOperadorCodigo] = useState('');
    const [operadorStatus, setOperadorStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [operadores, setOperadores] = useState([]);
    const { atualizarDados } = useDados();

    useEffect(() => {
        if (postos && postos.length > 0) {
            setSelectedPosto(postos[0].codigo_posto);
        }
    }, [postos]);

    const checkOperadorStatus = async (codOperador) => {
        if (!codOperador) {
            setOperadorStatus('');
            setErrorMessage('');
            return;
        }

        try {
            const apiInstance = await api();
            const response = await apiInstance.get(`/operadores?evento=20&codOperador=${codOperador}`);
            const data = await response.data;

            setOperadorStatus('');
            setErrorMessage('');

            if (Array.isArray(data) && data.length > 0) {
                const operadorData = data[0];

                if (operadorData.erro) {
                    setErrorMessage(operadorData.erro);
                } else if (operadorData.status === "Operador Inativo!") {
                    setErrorMessage(operadorData.status);
                } else if (operadorData.status === "") {
                    setOperadorStatus(operadorData.nome_operador);
                } else {
                    setOperadorStatus('Status não reconhecido');
                }
            } else {
                setErrorMessage('Resposta inválida do servidor.');
            }
        } catch (error) {
            setOperadorStatus('');
            setErrorMessage(error.message || 'Erro ao verificar o operador.');
        }
    };

    const debouncedCheckOperadorStatus = debounce(checkOperadorStatus, 300);

    useEffect(() => {
        debouncedCheckOperadorStatus(operadorCodigo);
        return () => {
            debouncedCheckOperadorStatus.cancel();
        };
    }, [operadorCodigo]);

    const isButtonDisabled = operadores.length === 0 || operadores === '' || errorMessage !== '';

    const handleAddOperador = () => {
        if (operadorCodigo && operadorStatus && !operadores.some(op => op.codigo === operadorCodigo)) {
            setOperadores([...operadores, { codigo: operadorCodigo, nome: operadorStatus }]);
            setOperadorCodigo('');
            setOperadorStatus('');
            setErrorMessage('');
        }
    };

    const handleConfirm = async () => {
        const payload = {
            evento: {
                evento: "20",
                numeroOrdem: numeroOrdem,
                processo: processo,
                acao: acao,
                lote: lote,
                posto: selectedPosto,
            },
            operadores: operadores.map(operador => ({ operador: operador.codigo })),
        };

        try {
            const apiInstance = await api();
            const response = await apiInstance.post('/confirmacao?evento=20', payload);
            console.log(payload);
            if (response.status === 200) {
                alert('Início de produção realizado com sucesso!');
                await atualizarDados();
                onClose();
            } else {
                alert(`Erro: ${response.data.message || 'Erro ao realizar a confirmação.'}`);
            }
        } catch (error) {
            if (error.response) {
                alert(`Erro: ${error.response.data.message || 'Erro inesperado do servidor.'}`);
            } else if (error.request) {
                alert('Erro: Nenhuma resposta recebida do servidor.');
            } else {
                alert(`Erro: ${error.message || 'Erro ao realizar a confirmação.'}`);
            }
        }
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Início de Produção</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialCommunityIcons name="close-thick" size={30} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.modalText}>Ação: {acao}</Text>

                    <Text style={styles.label}>Posto</Text>
                    <TouchableOpacity style={styles.pickerWithIcon}>
                        <Picker
                            selectedValue={selectedPosto}
                            onValueChange={(itemValue) => setSelectedPosto(itemValue)}
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            dropdownIconColor="transparent"
                        >
                            {postos && postos.length > 0 ? (
                                postos.map(posto => (
                                    <Picker.Item
                                        key={posto.codigo_posto}
                                        label={posto.descricao}
                                        value={posto.codigo_posto}
                                    />
                                ))
                            ) : (
                                <Picker.Item label="Nenhum posto disponível" value="" />
                            )}
                        </Picker>
                    </TouchableOpacity>

                    <Text style={styles.label}>Código do Operador</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Código do Operador"
                            value={operadorCodigo}
                            onChangeText={(text) => {
                                const numericText = text.replace(/[^0-9]/g, '');
                                setOperadorCodigo(numericText);
                            }}
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                        />
                        <TouchableOpacity onPress={handleAddOperador} style={styles.addButton}>
                            <MaterialCommunityIcons name="account-plus" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : (
                        <Text style={styles.successText}>{operadorStatus}</Text>
                    )}

                    <View style={styles.operadoresList}>
                        {operadores.map((operador, index) => (
                            <Text key={index} style={styles.operadorItem}>
                                {operador.codigo} - {operador.nome}
                            </Text>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.confirmButton, isButtonDisabled && styles.confirmButtonDisabled]}
                        onPress={handleConfirm}
                        disabled={isButtonDisabled}
                    >
                        <Text style={styles.buttonText}>Confirmar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        maxWidth: 500,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 10,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    modalText: {
        color: '#666',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    pickerWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        marginBottom: 16,
    },
    picker: {
        flex: 1,
        height: 50,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        padding: 12,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 10,
        color: '#333',
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#09A08D',
        padding: 12,
        borderRadius: 8,
        marginLeft: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    operadoresList: {
        marginBottom: 18,
    },
    operadorItem: {
        color: '#333',
        marginBottom: 5,
    },
    confirmButton: {
        backgroundColor: '#09A08D',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: '#B0B0B0',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 18,
    },
    successText: {
        color: 'green',
        marginBottom: 18,
    },
});
