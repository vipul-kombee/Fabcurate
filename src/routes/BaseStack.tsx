import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import { STRINGS } from '../res/Strings';

const Stack = createStackNavigator();

const BaseStack: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={STRINGS.mainTabs} component={TabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default BaseStack;
