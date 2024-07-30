import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Configuracao from './pages/Configuracao';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import TelasOrdensFab from './pages/TelasOrdensFab';
import Componentes from './pages/TelasOrdensFab/Componentes';
import DadosGerais from './pages/TelasOrdensFab/DadosGerais';
import OFVirtual from './pages/TelasOrdensFab/OFVirtual';
import Processos from './pages/TelasOrdensFab/Processos';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function TabRoutes() {
  return (
    <Tab.Navigator
      initialRouteName="DadosGerais"
      activeColor="#0D0D0D"
      inactiveColor="#fff"
      barStyle={{ backgroundColor: '#09A08D' }}
    >
      <Tab.Screen name="Dados Gerais" component={DadosGerais} options={{
        tabBarLabel: 'Dados Gerais',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="file-table" color={color} size={27} />
        ),
      }}
      />
      <Tab.Screen name="Processos" component={Processos} options={{
        tabBarLabel: 'Processos',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="table-cog" color={color} size={27} />
        ),
      }}
      />
      <Tab.Screen name="OF Virtual" component={OFVirtual} options={{
        tabBarLabel: 'OF Virtual',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="file-document" color={color} size={27} />
        ),
      }}
      />
      <Tab.Screen name="Componentes" component={Componentes} options={{
        tabBarLabel: 'Componentes',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="hammer-screwdriver" color={color} size={27} />
        ),
      }}
      />
    </Tab.Navigator>
  )
}
export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#09A08D',
          },
          headerTintColor: '#fff',
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Configuracao"
          component={Configuracao}
          options={{
            headerTitle: 'Configurações',
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerTitle: 'Dashboard',
          }}
        />
        <Stack.Screen
          name="TelasOrdensFab"
          component={TelasOrdensFab}
          options={{
            headerTitle: 'Ordens de Fabricação e Apontamentos',
          }}
        />
        <Stack.Screen name="Tab" component={TabRoutes}
          options={({ route }) => ({
            headerTitle: 'Ordem de Fabricação: ' + route.params?.barcode || 'OF não encontrada',
          })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
