import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import { IMAGES } from '../res/Images';
import CurateScreen from '../screens/CurateScreen';
import SaleScreen from '../screens/SaleScreen';
import MoreScreen from '../screens/MoreScreen';
import { STRINGS } from '../res/Strings';
import { COLORS } from '../res/Colors';
import { ScaledSheet } from 'react-native-size-matters';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconSource;
                    const tintColor = focused ? COLORS.active : COLORS.inactive;
                    if (route.name === STRINGS.home) {
                        iconSource = IMAGES.ic_home;
                    } else if (route.name === STRINGS.category) {
                        iconSource = IMAGES.ic_category;
                    } else if (route.name === STRINGS.curate) {
                        iconSource = IMAGES.ic_curate;
                    } else if (route.name === STRINGS.sale) {
                        iconSource = IMAGES.ic_sale;
                    } else if (route.name === STRINGS.more) {
                        iconSource = IMAGES.ic_more;
                    }

                    return (
                        <View style={styles.iconContainer}>
                            <Image source={iconSource} style={[styles.icon, { tintColor }]} />
                        </View>
                    );
                },
                tabBarLabel: ({ focused }) => (
                    <Text style={[styles.label, { color: focused ? COLORS.active : COLORS.inactive }]}>
                        {route.name}
                    </Text>
                ),
                tabBarStyle: styles.tabBar,
                headerShown: false,
            })}
        >
            <Tab.Screen name={STRINGS.home} component={HomeScreen} />
            <Tab.Screen name={STRINGS.category} component={CategoryScreen} />
            <Tab.Screen name={STRINGS.curate} component={CurateScreen} />
            <Tab.Screen name={STRINGS.sale} component={SaleScreen} />
            <Tab.Screen name={STRINGS.more} component={MoreScreen} />
        </Tab.Navigator>
    );
};

const styles = ScaledSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: '24@s',
        height: '24@s',
        resizeMode: 'contain',
    },
    label: {
        fontSize: '9@s',
        fontWeight: 'bold',
        marginVertical: '5@s',
        textTransform: 'uppercase'
    },
    tabBar: {
        backgroundColor: COLORS.white,
        height: '60@s',
    },
});

export default TabNavigator;
