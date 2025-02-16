import React, { useRef, useState } from 'react';
import {
    View, Text, Animated, Dimensions,
    Image
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { COLORS } from '../res/Colors';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
const ITEM_HEIGHT = 400;
const SPACING = 1;
const FULL_SIZE = ITEM_WIDTH + SPACING * 2;

const FashionCard = ({ item, scaleY }: any) => {

    const colors = ['#E7D3CE', '#FEE3C5', '#EFE2F6'];
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
    const [randomColor, setRandomColor] = useState(getRandomColor());

    return (
        <Animated.View style={[styles.cardContainer, { transform: [{ scaleY }] }]}>
            <Image source={{ uri: item?.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.bottomContainer}>
                <Text style={[styles.name, { color: randomColor }]} numberOfLines={1} ellipsizeMode="tail">{item?.name}</Text>
            </View>
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{item?.description}</Text>
        </Animated.View>
    );
};

const UnstitchedList = ({ data }: any) => {
    const scrollX = useRef(new Animated.Value(0)).current;

    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={data}
                horizontal
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                pagingEnabled
                decelerationRate="fast"
                snapToInterval={FULL_SIZE}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                renderItem={({ item, index }) => {
                    const inputRange = [
                        (index - 1) * FULL_SIZE,
                        index * FULL_SIZE,
                        (index + 1) * FULL_SIZE,
                    ];

                    const scaleY = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.8, 1, 0.8],
                        extrapolate: 'clamp',
                    });

                    return <FashionCard item={item} scaleY={scaleY} />;
                }}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        margin: '10@s',
    },
    cardContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    description: {
        position: 'absolute',
        fontSize: '12@s',
        fontWeight: 700,
        textTransform: 'uppercase',
        textAlign: 'center',
        color: COLORS.white,
        bottom: '60@s',
        lineHeight: '20@s',
        marginHorizontal: '24@s'
    },
    name: {
        fontSize: '28@s',
        fontWeight: 800,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    bottomContainer: {
        backgroundColor: COLORS.lightBlack,
        height: '20%',
        position: 'absolute',
        width: '100%',
        bottom: 0,
        justifyContent: 'center'
    },
});

export default UnstitchedList;
