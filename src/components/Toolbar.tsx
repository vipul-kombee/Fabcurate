import React from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent, Image, ImageProps } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { COLORS } from "../res/Colors";
import { IMAGES } from "../res/Images";
import { useNavigation } from "@react-navigation/native";

interface ToolbarProps {
    isDashboard?: boolean;
    title?: string;
    titleImage?: ImageProps;
    onBackPress?: (event: GestureResponderEvent) => void;
    rightActions?: { icon: ImageProps; onPress: (event: GestureResponderEvent) => void }[];
}

const Toolbar: React.FC<ToolbarProps> = ({ title, titleImage, onBackPress, rightActions = [], isDashboard = false }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            {onBackPress && !isDashboard && (
                <TouchableOpacity onPress={onBackPress || navigation.goBack} style={styles.button}>
                    <Image source={IMAGES.ic_arrow} style={[styles.image, { transform: [{ rotate: '90deg' }] }]} resizeMode="cover" />
                </TouchableOpacity>
            )}

            {title && <Text style={styles.title}>{title}</Text>}
            {titleImage && <View style={styles.titleImageStyle}>
                <Image source={titleImage} style={styles.logoImage} resizeMode="cover" />
            </View>
            }

            <View style={styles.rightContainer}>
                {rightActions.map((action, index) => (
                    <TouchableOpacity key={index} onPress={action.onPress} style={styles.button}>
                        <Image source={action.icon} style={styles.image} resizeMode="cover" />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        height: '56@s',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: '8@s',
        backgroundColor: COLORS.white,
    },
    button: {
        padding: '8@s',
    },
    image: {
        height: '16@s',
        width: '16@s',
    },
    logoImage: {
        height: '32@s',
        width: '60%'
    },
    title: {
        fontSize: '16@s',
        fontWeight: 600,
        color: 'gray',
        flex: 1,
        textAlign: "center",
    },
    titleImageStyle: {
        flex: 1,
    },
    rightContainer: {
        flexDirection: "row",
    },
});

export default Toolbar;
