import React, { useRef } from "react";
import { StyleSheet, View, Animated, ScrollView } from "react-native";

export default function App() {
    const animation = useRef(new Animated.Value(0)).current;

    const backgroundInterpolate = animation.interpolate({
        inputRange: [0, 3000],
        outputRange: ["rgb(255,99,71)", "rgb(99,71,255)"],
    });

    const backgroundStyle = {
        backgroundColor: backgroundInterpolate,
    };

    return (
        <View style={styles.container}>
            <ScrollView
                scrollEventThrottle={16}
                // scrollEventThrottle={1} // if useNativeDriver is true
                // onScroll={(e) => {
                //     animation.setValue(e.nativeEvent.contentOffset.y);
                // }}
                // OR
                onScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: animation,
                                },
                            },
                        },
                    ],
                    { useNativeDriver: false }
                )}
            >
                <Animated.View style={[styles.content, backgroundStyle]} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        height: 3000,
    },
});
