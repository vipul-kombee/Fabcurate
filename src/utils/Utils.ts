import { STRINGS } from "../res/Strings";

export const resetToHome = (navigation: any) => {
    navigation.reset({
        index: 0,
        routes: [{ name: STRINGS.home }],
    });
};
