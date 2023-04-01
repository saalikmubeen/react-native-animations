import React, { useRef } from "react";
import {
    StyleSheet,
    View,
    Animated,
    Text,
} from "react-native";

export default function App() {
    const colorAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        // Parallel animation
        Animated.parallel([
            Animated.timing(colorAnimation, {
                toValue: 1,
                duration: 500,
            }),
            Animated.timing(scaleAnimation, {
                toValue: 2,
                duration: 300,
            }),
        ]).start(() => {
            // Fires when both animations are complete
            alert("Animation Complete");
        });

        // Sequence animation
        Animated.sequence([
            Animated.timing(colorAnimation, {
                toValue: 1,
                duration: 500,
            }),
            Animated.timing(scaleAnimation, {
                toValue: 2,
                duration: 300,
            }),
        ]).start();

        // Stagger animation
        // This will run the animations in parallel, but stagger them by 200ms.
        // That means the first animation will start immediately, the second will start 200ms later,
        // and the third will start 400ms later.
        Animated.stagger(200, [
            Animated.timing(colorAnimation, {
                toValue: 1,
                duration: 500,
            }),
            Animated.timing(scaleAnimation, {
                toValue: 2,
                duration: 300,
            }),
        ]).start();

        // Stagger is similar to this:
        Animated.timing(colorAnimation, {
            toValue: 1,
            duration: 500,
        }).start();

        setTimeout(() => {
            Animated.timing(scaleAnimation, {
                toValue: 2,
                duration: 300,
            }).start();
        }, 200);

        // Delay animation
        // This will delay the animation by 200ms.
        // So here with our delay animation, these run sequentially. 
        // This animation would last for 500 + 300 + 1500 + 500, and then our start would be called.
        Animated.sequence([
            Animated.timing(colorAnimation, {
                toValue: 1,
                duration: 500,
            }),
            Animated.timing(scaleAnimation, {
                toValue: 2,
                duration: 300,
            }),
            Animated.delay(1500),
            Animated.parallel([
                Animated.timing(colorAnimation, {
                    toValue: 0,
                    duration: 500,
                }),
                Animated.timing(scaleAnimation, {
                    toValue: 1,
                    duration: 300,
                }),
            ]),
        ]).start();
    };

    const backgroundColorInterpolate = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgb(255,99,71)", "rgb(99,71,255)"],
    });

    const boxStyle = {
        backgroundColor: backgroundColorInterpolate,
        transform: [{ scale: scaleAnimation }],
    };

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={handlePress}>
                <Animated.View style={[styles.box, boxStyle]}>
                    <Text style={styles.text}>Hello Parallel</Text>
                </Animated.View>
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
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#FFF",
    },
});
