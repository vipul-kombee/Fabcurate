import React, { useRef, useState } from 'react';
import {
    View, Text, Animated, Dimensions,
    Image
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { COLORS } from '../res/Colors';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
const ITEM_HEIGHT = 200;
const SPACING = 5;
const FULL_SIZE = ITEM_WIDTH + SPACING * 2;

const FashionCard = ({ item, scaleY }: any) => {

    const colors = ['#E7D3CE', '#FEE3C5', '#EFE2F6'];
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
    const [randomColor, setRandomColor] = useState(getRandomColor());

    const words = item.title.split(' ');

    return (
        <Animated.View style={[styles.cardContainer, { transform: [{ scaleY }] }]}>
            <Image source={{ uri: item?.image }} style={styles.image} resizeMode="cover" />
            <View style={{ backgroundColor: randomColor, height: '25%' }}>
            </View>
            <View style={styles.overlay}>
                <Text style={styles.title}>
                    {words.map((word: any, index: number) => (
                        <Text
                            key={index}
                            style={index === 1 || index === 2 ? styles.categoryNameBold : styles.categoryName}>
                            {word}{' '}
                        </Text>
                    ))}
                </Text>
                <Text style={styles.subName} numberOfLines={1} ellipsizeMode="tail">{item?.cta}</Text>
            </View>
        </Animated.View>
    );
};

const SubItemList = ({ data }: any) => {
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
                        outputRange: [0.85, 1, 0.85],
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
        margin: '5@s',
    },
    cardContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: '6@s',
        overflow: 'hidden',
        marginHorizontal: '5@s',
    },
    image: {
        width: '100%',
        height: '75%',
    },
    overlay: {
        alignSelf: 'center',
        marginBottom: '10@s',
        width: '70%',
        backgroundColor: COLORS.white,
        padding: '16@s',
        position: 'absolute',
        bottom: '5@s',
        gap: '10@s'
    },
    title: {
        fontSize: '14@s',
    },
    categoryName: {
        fontSize: '11@s',
        fontWeight: 500,
        textTransform: 'uppercase',
    },
    categoryNameBold: {
        fontSize: '11@s',
        fontWeight: 800,
        textTransform: 'uppercase',
    },
    subName: {
        fontSize: '8@s',
        textTransform: 'uppercase',
    },
});

export default SubItemList;
