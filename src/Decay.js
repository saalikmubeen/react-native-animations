import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated, PanResponder } from "react-native";

export default function App() {
    const animation = useRef(new Animated.ValueXY(0)).current;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            animation.extractOffset();
        },
        // onPanResponderMove: (event, gesture) => {
        //     animation.setValue({ x: gesture.dx, y: gesture.dy });
        // },
        // OR
        onPanResponderMove: Animated.event(
            [null, { dx: animation.x, dy: animation.y }],
            { useNativeDriver: false }
        ),
        onPanResponderRelease: (e, { vx, vy }) => {
            // Allows us to apply a velocity and deceleration to the animation
            Animated.decay(animation, {
                velocity: { x: vx, y: vy },
                deceleration: 0.997,
            }).start();
        },
    });

    useEffect(() => {
        animation.addListener(({ x, y }) => {
            console.log(x, y);
        });
    });

    const animatedStyle = {
        // transform: animation.getTranslateTransform(),
        // OR
        transform: [{ translateX: animation.x }, { translateY: animation.y }],
    };

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.box, animatedStyle]}
                {...panResponder.panHandlers}
            />
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
