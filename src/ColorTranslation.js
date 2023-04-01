import React, { useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableWithoutFeedback,
} from "react-native";

export default function App() {
    const animation = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    handlePress = () => {
        animation.setValue(0);
        opacity.setValue(1);

        Animated.timing(animation, {
            duration: 1500,
            toValue: 1,
        }).start(({ finished }) => {
            // if animation finishes without any interruption by another animation(like a button press)
            if (finished) {
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                }).start();
            }
        });
    };

    const progressInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
        extrapolate: "clamp",
    });

    const colorInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgb(71,255,99)", "rgb(99,71,255)"],
    });

    const progressStyle = {
        width: progressInterpolate,
        bottom: 0,

        // height: progressInterpolate,
        // right: 0,

        // top: null,
        // bottom: 0,
        // width: progressInterpolate,
        // height: 5,

        opacity: opacity,
        backgroundColor: colorInterpolate,
    };

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={this.handlePress}>
                <View style={styles.button}>
                    <View style={StyleSheet.absoluteFill}>
                        <Animated.View
                            style={[
                                styles.progress,
                                progressStyle,
                                styles.opacityBackground,
                            ]}
                        />
                    </View>
                    <Text style={styles.buttonText}>Get it!</Text>
                </View>
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
    button: {
        backgroundColor: "#e6537d",
        borderRadius: 2,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 60,
        paddingVertical: 10,
        overflow: "hidden",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 24,
        backgroundColor: "transparent",
    },
    progress: {
        position: "absolute",
        left: 0,
        top: 0,
    },
    opacityBackground: {
        // backgroundColor: "rgba(255,255,255,.5)",
    },
});
