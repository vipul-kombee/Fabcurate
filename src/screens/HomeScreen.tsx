import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView, Image, ImageBackground, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { CONSTANTS } from "../utils/Constants";
import { getData } from "../api/ApiHelper";
import { STRINGS } from "../res/Strings";
import { ScaledSheet } from "react-native-size-matters";
import { COLORS } from "../res/Colors";
import Carousel from "react-native-reanimated-carousel";
import SubItemList from "../components/SubItemList";
import UnstitchedList from "../components/UnstitchedList";
import Toolbar from "../components/Toolbar";
import { IMAGES } from "../res/Images";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / 3 - 15;

const HomeScreen: React.FC = () => {
    const [topData, setTopData] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(0);
    const [middleData, setMiddleData] = useState([]);
    const [shopByCategoryData, setShopByCategoryData] = useState<any[]>([]);
    const [shopByFabricData, setShopByFabricData] = useState<any[]>([]);
    const [cauroselIndex, setCauroselIndex] = useState(0);
    const [bottomData, setBottomData] = useState([]);
    const [rangeOfPatternData, setRangeOfPatterData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            getAllData();
        }, [])
    );

    const getAllData = async () => {
        try {
            setLoading(true);

            const [topResponse, middleResponse, bottomResponse] = await Promise.all([
                getData(CONSTANTS.API_TOP_DATA),
                getData(CONSTANTS.API_MIDDLE_DATA),
                getData(CONSTANTS.API_BOTTOM_DATA),
            ]);

            setTopData({
                ...topResponse,
                main_sticky_menu: [...(topResponse?.main_sticky_menu || [])].sort(
                    (a, b) => a.sort_order - b.sort_order
                ),
            });

            setMiddleData(middleResponse);

            setBottomData(bottomResponse);

            setShopByCategoryData(
                formatData(
                    [...(middleResponse?.shop_by_category || [])].sort((a, b) => a.sort_order - b.sort_order),
                    2
                )
            );

            setShopByFabricData(
                formatData(
                    [...(middleResponse?.shop_by_fabric || [])].sort((a, b) => a.sort_order - b.sort_order),
                    2
                )
            );

            setRangeOfPatterData(formatData(bottomResponse?.range_of_pattern || [], 2));
        } catch (error) {
            console.error("Error getting data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatData = (data: any[], numRows: number) => {
        let formattedData = [];
        for (let i = 0; i < data.length; i += numRows) {
            formattedData.push(data.slice(i, i + numRows));
        }
        return formattedData;
    };

    const renderShopByCategoryData = ({ item }: { item: any }) => (
        <View style={styles.rowContainer}>
            {item.map((product: any) => (
                <View key={product.product_id} style={styles.squareItemContainer}>
                    <Image source={{ uri: product?.image }} style={styles.squareImage} resizeMode="cover" />
                    <View style={[styles.categoryDescription, { backgroundColor: product?.tint_color }]}>
                        <Text style={styles.categoryName} numberOfLines={1} ellipsizeMode="tail">
                            <Text style={styles.categoryName}>{product?.name.split(" ")[0]} </Text>
                            <Text style={styles.categoryNameBold}>{product?.name.split(" ")[1]}</Text>
                        </Text>
                        <Text style={styles.subName} numberOfLines={1} ellipsizeMode="tail">+ {STRINGS.explore}</Text>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderRangeOfPatternItem = ({ item }: { item: any }) => (
        <View style={styles.rowContainer}>
            {item.map((product: any) => (
                <View key={product.product_id} style={styles.circleItemContainer}>
                    <Image source={{ uri: product?.image }} style={styles.circleImage} resizeMode="cover" />
                    <Text style={styles.circleTitle} numberOfLines={2} ellipsizeMode="tail">{product?.name}</Text>
                </View>
            ))}
        </View>
    );

    const renderDesignAsPerOccasionItem = ({ item }: { item: any }) => (
        <View style={styles.itemContainer}>
            <ImageBackground
                source={{ uri: item?.image }}
                style={styles.image}
                resizeMode="cover">
                <View style={styles.description}>
                    <View style={{ flex: 7 }}>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item?.name}</Text>
                        <Text style={styles.subName} numberOfLines={1} ellipsizeMode="tail">{item?.sub_name}</Text>
                    </View>
                    <Text style={styles.cta}>{item?.cta}</Text>
                </View>
            </ImageBackground>
        </View>
    );

    const mainMenuItem = ({ item, index }: { item: any; index: number }) => (
        <TouchableOpacity style={styles.mainItemContainer}
            onPress={() => { setSelectedMenu(index) }}>
            <Image source={{ uri: item?.image }} style={styles.mainImage} resizeMode="cover" />
            <View style={styles.mainDescription}>
                <Text style={styles.mainName} numberOfLines={1} ellipsizeMode="tail">{item?.title} </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Toolbar
                isDashboard={true}
                titleImage={IMAGES.logo}
                onBackPress={() => { }}
                rightActions={[
                    { icon: IMAGES.ic_search, onPress: () => Alert.alert("Search pressed") },
                    { icon: IMAGES.ic_store, onPress: () => Alert.alert("Store pressed") },
                ]}
            />
            <ScrollView>
                {
                    loading
                        ?
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color={COLORS.black} />
                            <Text style={styles.title}>{STRINGS.loading}</Text>
                        </View>
                        :
                        <View>
                            <View style={styles.circleListContainer}>
                                <FlatList
                                    data={topData?.main_sticky_menu}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item, index }) => mainMenuItem({ item, index })}
                                    ListEmptyComponent={<Text style={styles.emptyText}>{STRINGS.noData}</Text>}
                                    contentContainerStyle={styles.listContainer}
                                    horizontal
                                />
                            </View>

                            {/* <SubItemList
                                data={[...(topData?.main_sticky_menu[selectedMenu]?.slider_images || [])].sort(
                                    (a, b) => a.sort_order - b.sort_order
                                )}
                            /> */}

                            <SubItemList
                                data={[...(topData?.main_sticky_menu?.[selectedMenu]?.slider_images || [])].sort(
                                    (a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0)
                                )}
                            />

                            <Text style={styles.title}>{STRINGS.shopByCategory}</Text>
                            <View style={styles.circleListContainer}>
                                <FlatList
                                    data={shopByCategoryData}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={renderShopByCategoryData}
                                    showsHorizontalScrollIndicator={false}
                                    ListEmptyComponent={<Text style={styles.emptyText}>{STRINGS.noData}</Text>}
                                    contentContainerStyle={styles.listContainer}
                                    horizontal={true}
                                />
                            </View>

                            <Text style={styles.title}>{STRINGS.shopByFabricMaterial}</Text>
                            <View style={styles.circleListContainer}>
                                <FlatList
                                    data={shopByFabricData}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={renderRangeOfPatternItem}
                                    showsHorizontalScrollIndicator={false}
                                    ListEmptyComponent={<Text style={styles.emptyText}>{STRINGS.noData}</Text>}
                                    contentContainerStyle={styles.listContainer}
                                    horizontal={true}
                                />
                            </View>

                            <Text style={styles.title}>{STRINGS.unstitched}</Text>
                            <UnstitchedList data={middleData?.Unstitched} />

                            <Text style={styles.title}>{STRINGS.boutiqueCollection}</Text>
                            <View style={styles.carouselContainer}>
                                <Carousel
                                    loop
                                    width={screenWidth}
                                    height={400}
                                    autoPlay={true}
                                    data={middleData?.boutique_collection}
                                    scrollAnimationDuration={3000}
                                    onSnapToItem={(index) => setCauroselIndex(index)}
                                    renderItem={({ item }) => (
                                        <View
                                            style={styles.cauroselContainer}>
                                            <Image
                                                source={{ uri: item?.banner_image }}
                                                style={styles.cauroselImage}
                                                resizeMode="cover"
                                            />
                                            <View style={styles.carouselContent}>
                                                <Text style={styles.carouselTitle}>
                                                    <Text style={styles.carouselTitle}>{STRINGS.handpickedFor} </Text>
                                                    <Text style={styles.carouselTitleBold}>{item?.name.split("Handpicked for ")[1]}</Text>
                                                </Text>
                                                <Text style={styles.carouselCta}>{item?.cta}</Text>
                                            </View>
                                        </View>
                                    )}
                                />
                                <View style={styles.cauroselIndicatorContainer}>
                                    {middleData?.boutique_collection?.map((_: any, index: React.Key | null | undefined) => (
                                        <View
                                            key={index}
                                            style={[styles.cauroselIndicator, {
                                                width: cauroselIndex === index ? 12 : 6,
                                                height: cauroselIndex === index ? 12 : 6
                                            }]}
                                        />
                                    ))}
                                </View>
                            </View>

                            <Text style={styles.title}>{STRINGS.rangeOfPattern}</Text>
                            <View style={styles.circleListContainer}>
                                <FlatList
                                    data={rangeOfPatternData}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={renderRangeOfPatternItem}
                                    showsHorizontalScrollIndicator={false}
                                    ListEmptyComponent={<Text style={styles.emptyText}>{STRINGS.noData}</Text>}
                                    contentContainerStyle={styles.listContainer}
                                    horizontal={true}
                                />
                            </View>

                            <Text style={styles.title}>{STRINGS.designAsPerOccasion}</Text>
                            <FlatList
                                data={bottomData?.design_occasion}
                                keyExtractor={(item) => item.product_id.toString()}
                                renderItem={renderDesignAsPerOccasionItem}
                                ListEmptyComponent={<Text style={styles.emptyText}>{STRINGS.noData}</Text>}
                                contentContainerStyle={styles.listContainer}
                                numColumns={3}
                            />
                        </View>
                }
            </ScrollView>
        </View>
    );
};

const styles = ScaledSheet.create({
    cauroselContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    cauroselImage: {
        width: '100%',
        height: '100%',
    },
    carouselContent: {
        position: 'absolute',
        bottom: 0,
        margin: '30@s',
        alignSelf: 'flex-start',
        gap: '24@s',
    },
    carouselContainer: {
        flex: 1,
        justifyContent: 'center',
        marginVertical: '10@s',
    },
    title: {
        fontSize: '14@s',
        fontWeight: 500,
        marginHorizontal: '10@s',
    },
    itemContainer: {
        width: itemWidth,
        margin: '5@s',
    },
    mainItemContainer: {
        width: '135@s',
        margin: '5@s',
        borderRadius: '4@s',
        elevation: '10@s',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: '4@s',
    },
    circleItemContainer: {
        height: '120@s',
        width: '120@s',
        borderRadius: '60@s',
        margin: '5@s',
    },
    squareItemContainer: {
        width: '120@s',
        margin: '5@s',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: '20@s',
        fontSize: '16@s',
        color: 'gray',
    },
    listContainer: {
        margin: '5@s',
    },
    circleListContainer: {
        marginEnd: '5@s',
    },
    loaderContainer: {
        flex: 1,
        alignSelf: 'center',
        height: '100%',
        gap: '10@s',
    },
    image: {
        width: '100%',
        height: '100@s',
    },
    circleImage: {
        height: '120@s',
        width: '120@s',
        borderRadius: '60@s',
    },
    squareImage: {
        height: '120@s',
        width: '120@s',
    },
    mainImage: {
        height: '65@s',
        width: '100%',
        borderTopLeftRadius: '4@s',
        borderTopRightRadius: '4@s',
    },
    description: {
        position: 'absolute',
        bottom: 0,
        padding: '5@s',
        backgroundColor: COLORS.descBgColor,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '10@s'
    },
    categoryDescription: {
        padding: '5@s',
        gap: '10@s'
    },
    mainDescription: {
        padding: '5@s',
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: '4@s',
        borderBottomRightRadius: '4@s',
    },
    name: {
        fontSize: '9@s',
        fontWeight: 500,
        textTransform: 'uppercase',
    },
    categoryName: {
        fontSize: '11@s',
        fontWeight: 500,
        textTransform: 'uppercase',
    },
    mainName: {
        fontSize: '12@s',
        fontWeight: 500,
        textAlign: 'center',
        color: 'gray',
    },
    categoryNameBold: {
        fontSize: '11@s',
        fontWeight: 800,
        textTransform: 'uppercase',
    },
    circleTitle: {
        fontSize: '13@s',
        fontWeight: 600,
        textTransform: 'uppercase',
        position: 'absolute',
        bottom: '12@s',
        alignSelf: 'center',
        color: COLORS.white,
        textAlign: 'center',
        marginHorizontal: '32@s',
    },
    carouselTitle: {
        fontSize: '24@s',
        fontWeight: 400,
        textTransform: 'uppercase',
        alignSelf: 'flex-start',
        color: COLORS.white,
    },
    carouselTitleBold: {
        fontSize: '24@s',
        fontWeight: 800,
        textTransform: 'uppercase',
        alignSelf: 'center',
        color: COLORS.white,
    },
    subName: {
        fontSize: '8@s',
        textTransform: 'uppercase',
    },
    cta: {
        fontSize: '7@s',
        textTransform: 'uppercase',
        alignSelf: 'flex-end'
    },
    carouselCta: {
        fontSize: '12@s',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: COLORS.white,
    },
    cauroselIndicatorContainer: {
        flexDirection: 'row',
        marginTop: '10@s',
        alignSelf: 'center'
    },
    cauroselIndicator: {
        borderRadius: '6@s',
        backgroundColor: 'gray',
        marginHorizontal: '4@s',
        alignSelf: 'center'
    },
    rowContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
    },
});

export default HomeScreen;
