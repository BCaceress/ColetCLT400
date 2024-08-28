import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const permissaoUsuarios = () => {
    const [permissao, setPermissao] = useState(null);

    useEffect(() => {
        const fetchPermissao = async () => {
            try {
                const perm = await AsyncStorage.getItem('@MyApp:permissao');
                setPermissao(perm);
            } catch (error) {
                console.error('Erro ao obter permissão:', error);
            }
        };

        fetchPermissao();
    }, []);

    return permissao;
};
export default permissaoUsuarios;
