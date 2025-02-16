import React from 'react';
import { View, Text, SafeAreaView, Alert, Image } from 'react-native';
import Toolbar from '../components/Toolbar';
import { STRINGS } from '../res/Strings';
import { IMAGES } from '../res/Images';
import { ScaledSheet } from 'react-native-size-matters';
import { COLORS } from '../res/Colors';
import { useNavigation } from '@react-navigation/native';
import { resetToHome } from '../utils/Utils';

const CurateScreen: React.FC = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Toolbar
                title={STRINGS.curate}
                onBackPress={() => { resetToHome(navigation) }}
                rightActions={[
                    { icon: IMAGES.ic_search, onPress: () => Alert.alert("Search pressed") },
                    { icon: IMAGES.ic_store, onPress: () => Alert.alert("Store pressed") },
                ]}
            />
            <View style={styles.container}>
                <Image source={IMAGES.ic_curate} style={styles.image} resizeMode="cover" />
                <Text style={styles.text}>{STRINGS.curate}</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12@s',
    },
    text: {
        fontWeight: 600,
        color: COLORS.black,
        fontSize: '16@s',
    },
    image: {
        alignSelf: 'center',
        height: '40@s',
        width: '40@s'
    },
});

export default CurateScreen;
