import React, { useRef } from "react";
import {
    StyleSheet,
    View,
    Animated,
    TouchableWithoutFeedback,
} from "react-native";

export default function App() {

    const animation = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        animation.addListener(({ value }) => {
            console.log(value);
        });
        Animated.spring(animation, {
            toValue: 2,
            friction: 2,
            tension: 160,
        }).start(() => {
            Animated.timing(animation, {
                toValue: 1,
                duration: 100,
            }).start();
        });
    };


    const animatedStyle = {
        transform: [{ scale: animation }],
    };
    

    return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={handlePress}>
                    <Animated.View style={[styles.box, animatedStyle]} />
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
