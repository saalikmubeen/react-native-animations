import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Text, Animated, PanResponder } from "react-native";

const Vjeux = { uri: "http://i.imgur.com/eiNhZrh.jpg" };

export default function App() {
    const heads = [
        {
            image: Vjeux,
            animation: new Animated.ValueXY(),
            text: "Drag Me",
        },
        {
            image: Vjeux,
            animation: new Animated.ValueXY(),
        },
        {
            image: Vjeux,
            animation: new Animated.ValueXY(),
        },
        {
            image: Vjeux,
            animation: new Animated.ValueXY(),
        },
    ];

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            heads.map(({ animation }) => {
                animation.extractOffset();
                // setValue Animated bug fix
                animation.setValue({ x: 0, y: 0 });
            });
        },
        onPanResponderMove: (event, { dx, dy }) => {
            // for first head
            heads[0].animation.setValue({
                x: dx,
                y: dy,
            });

            // for rest of heads or images
            heads.slice(1).map(({ animation }, index) => {
                return Animated.sequence([
                    Animated.delay(index * 10),
                    Animated.spring(animation, {
                        toValue: { x: dx, y: dy },
                        useNativeDriver: false,
                    }),
                ]).start();
            });
        },
    });

    return (
        <View style={styles.container}>
            {heads
                .slice(0)
                // .reverse()
                .map((item, index, items) => {
                    // const panHandlers =
                    //     index === items.length - 1
                    //         ? panResponder.panHandlers
                    //         : {};

                    const panHandlers =
                        index === 0 ? panResponder.panHandlers : {};

                    return (
                        <Animated.Image
                            {...panHandlers}
                            key={index}
                            source={item.image}
                            style={[
                                styles.head,
                                {
                                    transform:
                                        item.animation.getTranslateTransform(),
                                },
                            ]}
                        />
                    );
                })
                .reverse()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    head: {
        width: 80,
        height: 80,
        borderRadius: 40,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
});
