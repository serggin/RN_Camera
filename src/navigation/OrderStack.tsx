import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import OrdersScreen from '../screens/Orders/OrdersScreen';
import ScanQRScreen from '../screens/Orders/ScanQRScreen';

const Stack = createStackNavigator();

const OrderStackNav = ({state}) => {
    return (
        <Stack.Navigator
            initialRouteName='Orders'
            screenOptions={({ route, navigation }) => ({
                headerShown: false,
                gestureEnabled: false,
            })}
        >
            <>
                <Stack.Screen
                    name='Orders'
                    component={OrdersScreen}
                />
                <Stack.Screen
                    name='ScanQR'
                    component={ScanQRScreen}
                />
            </>
        </Stack.Navigator>
    );
}

export default OrderStackNav;
