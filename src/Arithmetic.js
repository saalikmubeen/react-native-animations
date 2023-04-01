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
        Animated.timing(animation, {
            toValue: 300,
            duration: 1500,
        }).start(() => {
            Animated.timing(animation, {
                toValue: 0,
                duration: 200,
            }).start();
        });
    };

    const randomValue = new Animated.Value(50);
    // const randomValue = 50;

    // Add the random value to the animation value
    const newAnimation = Animated.add(animation, randomValue);

    // Multiply the animation value by new random Animated.Value
    // const newAnimation = Animated.multiply(animation, randomValue);

    // Divide the animation value by new random Animated.Value
    // const newAnimation = Animated.divide(animation, randomValue);

    // Subtract the animation value by new random Animated.Value
    // const newAnimation = Animated.subtract(animation, randomValue);

    // Modulo the animation value by new random Animated.Value
    // const newAnimation = Animated.modulo(animation, randomValue);

    const animatedStyles = { transform: [{ translateY: newAnimation }] };

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
        width: 50,
        height: 50,
        backgroundColor: "tomato",
    },
});
