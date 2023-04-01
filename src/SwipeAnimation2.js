import React, { useRef, useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Animated,
    PanResponder,
    TouchableOpacity,
} from "react-native";

function clamp(value, min, max) {
    return min < max
        ? value < min
            ? min
            : value > max
            ? max
            : value
        : value < max
        ? max
        : value > min
        ? min
        : value;
}

const Cat1 = { uri: "http://i.imgur.com/W4qnVsw.jpg" };
const Cat2 = { uri: "http://i.imgur.com/4WVHep7.jpg" };
const Cat3 = { uri: "http://i.imgur.com/rxvWa3V.jpg" };
const Cat4 = { uri: "http://i.imgur.com/V2DHGcN.jpg" };

const SWIPE_THRESHOLD = 120;

export default function App() {
    const [items, setItems] = useState([
        {
            image: Cat1,
            id: 1,
            text: "Sweet Cat",
        },
        {
            image: Cat2,
            id: 2,
            text: "Sweeter Cat",
        },
        {
            image: Cat3,
            id: 3,
            text: "Sweetest Cat",
        },
        {
            image: Cat4,
            id: 4,
            text: "Aww",
        },
    ]);

    const currentCard = useRef(new Animated.ValueXY(0)).current;
    const currentCardOpacity = useRef(new Animated.Value(1)).current;
    const nextCard = useRef(new Animated.Value(0.75)).current;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event(
            [
                null,
                {
                    dx: currentCard.x,
                    dy: currentCard.y,
                },
            ],
            { useNativeDriver: false }
        ),
        onPanResponderRelease: (e, { dx, vx, vy }) => {
            let velocity;

            if (vx >= 0) {
                velocity = clamp(vx, 3, 5);
            } else if (vx < 0) {
                velocity = clamp(Math.abs(vx), 3, 5) * -1;
            }

            if (Math.abs(dx) > SWIPE_THRESHOLD) {
                Animated.decay(currentCard, {
                    velocity: { x: velocity, y: vy },
                    deceleration: 0.98,
                    useNativeDriver: false,
                }).start(transitionNext);
            } else {
                Animated.spring(currentCard, {
                    toValue: { x: 0, y: 0 },
                    friction: 4,
                    useNativeDriver: false,
                }).start();
            }
        },
    });

    const transitionNext = () => {
        Animated.parallel([
            Animated.timing(currentCardOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.spring(nextCard, {
                toValue: 1,
                friction: 4,
                useNativeDriver: false,
            }),
        ]).start(() => {
            // this.setState(
            //     (state) => {
            //         return {
            //             items: state.items.slice(1),
            //         };
            //     },
            //     () => {
            //         this.state.next.setValue(0.9);
            //         this.state.opacity.setValue(1);
            //         this.state.animation.setValue({ x: 0, y: 0 });
            //     }
            // );

            setItems(items.slice(1));
        });
    };

    const handleNo = () => {
        Animated.timing(currentCard.x, {
            toValue: -SWIPE_THRESHOLD,
            useNativeDriver: false,
        }).start(transitionNext);
    };

    const handleYes = () => {
        Animated.timing(currentCard.x, {
            toValue: SWIPE_THRESHOLD,
            useNativeDriver: false,
        }).start(transitionNext);
    };

    useEffect(() => {
        nextCard.setValue(0.75);
        currentCardOpacity.setValue(1);
        currentCard.setValue({ x: 0, y: 0 });
    }, [items]);

    const rotate = currentCard.x.interpolate({
        inputRange: [-200, 0, 200],
        outputRange: ["-30deg", "0deg", "30deg"],
        extrapolate: "clamp",
    });

    const imageOpacity = currentCard.x.interpolate({
        inputRange: [-200, 0, 200],
        outputRange: [0.5, 1, 0.5],
    });

    const yesOpacity = currentCard.x.interpolate({
        inputRange: [0, 150],
        outputRange: [0, 1],
    });
    const yesScale = currentCard.x.interpolate({
        inputRange: [0, 150],
        outputRange: [0.5, 1],
        extrapolate: "clamp",
    });

    const animatedYupStyles = {
        transform: [{ scale: yesScale }, { rotate: "-30deg" }],
        opacity: yesOpacity,
    };

    const noOpacity = currentCard.x.interpolate({
        inputRange: [-150, 0],
        outputRange: [1, 0],
    });
    const noScale = currentCard.x.interpolate({
        inputRange: [-150, 0],
        outputRange: [1, 0.5],
        extrapolate: "clamp",
    });
    const animatedNopeStyles = {
        transform: [{ scale: noScale }, { rotate: "30deg" }],
        opacity: noOpacity,
    };

    const animatedCardStyles = {
        transform: [{ rotate }, ...currentCard.getTranslateTransform()],
        opacity: currentCardOpacity,
    };

    const animatedImageStyles = {
        opacity: imageOpacity,
    };

    if (items.length === 0) {
        return (
            <View style={styles.message}>
                <Text>No more cards to swipe through!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                {[...items]
                    .reverse()
                    .map(({ image, id, text }, index, items) => {
                        const isCurrentCard = index === items.length - 1;
                        const isNextCard = index === items.length - 2;

                        const panHandlers = isCurrentCard
                            ? panResponder.panHandlers
                            : {};
                        const cardStyle = isCurrentCard
                            ? animatedCardStyles
                            : undefined;
                        const imageStyle = isCurrentCard
                            ? animatedImageStyles
                            : undefined;
                        const nextStyle = isNextCard
                            ? { transform: [{ scale: nextCard }] }
                            : undefined;

                        return (
                            <Animated.View
                                {...panHandlers}
                                style={[styles.card, cardStyle, nextStyle]}
                                key={id}
                            >
                                <Animated.Image
                                    source={image}
                                    style={[styles.image, imageStyle]}
                                    resizeMode="cover"
                                />
                                <View style={styles.lowerText}>
                                    <Text>{text}</Text>
                                </View>

                                {isCurrentCard && (
                                    <Animated.View
                                        style={[
                                            styles.nope,
                                            animatedNopeStyles,
                                        ]}
                                    >
                                        <Text style={styles.nopeText}>
                                            Nope!
                                        </Text>
                                    </Animated.View>
                                )}

                                {isCurrentCard && (
                                    <Animated.View
                                        style={[styles.yup, animatedYupStyles]}
                                    >
                                        <Text style={styles.yupText}>Yup!</Text>
                                    </Animated.View>
                                )}
                            </Animated.View>
                        );
                    })}
            </View>
            <View style={styles.buttonBar}>
                <TouchableOpacity
                    onPress={handleNo}
                    style={[styles.button, styles.nopeButton]}
                >
                    <Text style={styles.nopeText}>NO</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleYes}
                    style={[styles.button, styles.yupButton]}
                >
                    <Text style={styles.yupText}>YES</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    top: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
    },
    button: {
        marginHorizontal: 10,
        padding: 20,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        shadowOpacity: 0.3,
        shadowOffset: { x: 0, y: 0 },
        shadowRadius: 5,
    },
    yupButton: {
        shadowColor: "green",
    },
    nopeButton: {
        shadowColor: "red",
    },

    card: {
        width: 300,
        height: 300,
        position: "absolute",
        borderRadius: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { x: 0, y: 0 },
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: "#FFF",
    },
    lowerText: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 5,
    },
    image: {
        width: null,
        height: null,
        borderRadius: 2,
        flex: 3,
    },
    yup: {
        borderColor: "green",
        borderWidth: 2,
        position: "absolute",
        padding: 20,
        borderRadius: 5,
        top: 20,
        left: 20,
        backgroundColor: "#FFF",
    },
    yupText: {
        fontSize: 16,
        color: "green",
    },
    nope: {
        borderColor: "red",
        borderWidth: 2,
        position: "absolute",
        padding: 20,
        borderRadius: 5,
        right: 20,
        top: 20,
        backgroundColor: "#FFF",
    },
    nopeText: {
        fontSize: 16,
        color: "red",
    },
    message: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
