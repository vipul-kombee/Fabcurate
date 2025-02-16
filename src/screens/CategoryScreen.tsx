import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, SectionList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { getData } from '../api/ApiHelper';
import { CONSTANTS } from '../utils/Constants';
import { ScaledSheet } from 'react-native-size-matters';
import { COLORS } from '../res/Colors';
import { IMAGES } from '../res/Images';
import Toolbar from '../components/Toolbar';
import { STRINGS } from '../res/Strings';
import { resetToHome } from '../utils/Utils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const CategoryScreen: React.FC = () => {
    const navigation = useNavigation();

    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    useEffect(() => {
        getCategoryData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            getCategoryData();
        }, [])
    );

    const getCategoryData = async () => {
        try {
            setLoading(true);
            const categoryData: any = await Promise.all([
                getData(CONSTANTS.API_CATEGORY_DATA),
            ]);
            setCategoryData(categoryData);
        } catch (error) {
            console.error("Error getting category data:", error);
        } finally {
            setLoading(false);
        }
    };

    const sections = categoryData[0]?.categories?.map((category: any) => ({
        title: category.category_name,
        id: category.category_id,
        data: expandedSection === category.category_id ? category.child || [] : []
    })) || [];

    const toggleSection = (categoryId: string) => {
        setExpandedSection(prev => (prev === categoryId ? null : categoryId));
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <Toolbar
                title={STRINGS.category}
                onBackPress={() => { resetToHome(navigation) }}
                rightActions={[
                    { icon: IMAGES.ic_search, onPress: () => Alert.alert("Search pressed") },
                    { icon: IMAGES.ic_store, onPress: () => Alert.alert("Store pressed") },
                ]}
            />
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={COLORS.black} />
                    <Text style={styles.title}>{STRINGS.loading}</Text>
                </View>
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.category_id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.childText}>{item.category_name}</Text>
                        </View>
                    )}
                    renderSectionHeader={({ section }) => (
                        <TouchableOpacity onPress={() => toggleSection(section.id)}>
                            <View style={styles.header}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.headerText}>
                                        {section.title}
                                    </Text>
                                </View>
                                <View style={styles.rightContainer}>
                                    <Image source={IMAGES.dress} style={styles.image} resizeMode="cover" />
                                </View>
                                <Image source={IMAGES.ic_arrow} style={[styles.arrowImage, expandedSection === section.id && { transform: [{ rotate: '180deg' }] }]} resizeMode="cover" />
                            </View>
                            <View style={styles.seprator} />
                        </TouchableOpacity>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const styles = ScaledSheet.create({
    titleContainer: {
        borderTopRightRadius: '40@s',
        borderBottomRightRadius: '40@s',
        borderColor: COLORS.borderColor,
        borderRightWidth: '1@s',
        elevation: '10@s',
        width: '100%',
        flex: 1.5,
        backgroundColor: COLORS.darkCategoryBg,
        justifyContent: 'center'
    },
    seprator: {
        height: '0.7@s',
        backgroundColor: COLORS.white,
        width: '100%',
    },
    header: {
        height: '100@s',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: COLORS.lightCategoryBg,
    },
    headerText: {
        fontSize: '16@s',
        fontWeight: 400,
        margin: '16@s',
    },
    image: {
        alignSelf: 'flex-end',
        height: '80%',
        width: '80%'
    },
    rightContainer: {
        flex: 1,
        end: 0,
        justifyContent: 'center',
    },
    arrowImage: {
        height: '12@s',
        width: '12@s',
        alignSelf: 'center',
        end: '10@s',
        position: 'absolute',
    },
    title: {
        fontSize: '14@s',
        fontWeight: 500,
        marginHorizontal: '10@s',
    },
    item: {
        padding: '16@s',
        borderBottomWidth: '1@s',
        borderColor: COLORS.borderColor,
    },
    childText: {
        fontSize: '16@s',
        fontWeight: 400,
    },
    loaderContainer: {
        flex: 1,
        alignSelf: 'center',
        height: '100%',
        gap: '10@s',
    },
});

export default CategoryScreen;
