import React, { useRef } from "react";
import {
    StyleSheet,
    View,
    Animated,
    TouchableWithoutFeedback,
} from "react-native";

export default function App() {
    const animation = useRef(new Animated.Value(0)).current;

    const startAnimation = () => {
        Animated.loop(
            Animated.timing(animation, {
                toValue: 1,
                duration: 1500,
                // useNativeDriver: true,
            })
        ).start();
    };

    const rotateInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });


    const animatedStyles = {
        transform: [{ rotate: rotateInterpolate }],
    };

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={startAnimation}>
                <Animated.View style={[styles.box, animatedStyles]} />
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    box: {
        width: 150,
        height: 150,
        backgroundColor: "tomato",
    },
});
