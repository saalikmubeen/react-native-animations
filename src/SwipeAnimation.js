import React, { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    PanResponder,
    Animated,
    Dimensions,
    LayoutAnimation,
    UIManager,
} from "react-native";


function DeckItem({ element }) {
    return (
        <View style={{ height: 200, width: 300 }}>
            <Image source={{ uri: element.uri }} style={styles.image} />
        </View>
    );
}

const DATA = [
    {
        id: 1,
        text: "Card #1",
        uri: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    },
    {
        id: 2,
        text: "Card #2",
        uri: "https://images.unsplash.com/photo-1618407961072-5afd4ea27e41?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=663&q=80",
    },
    {
        id: 3,
        text: "Card #3",
        uri: "https://images.unsplash.com/photo-1618452808296-6f9cb49a0c2a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=649&q=80",
    },
    {
        id: 4,
        text: "Card #4",
        uri: "https://images.unsplash.com/photo-1618487593906-06e42a881e77?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=633&q=80",
    },
    {
        id: 5,
        text: "Card #5",
        uri: "https://images.unsplash.com/photo-1618429357361-1f57a652c10a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    {
        id: 6,
        text: "Card #6",
        uri: "https://images.unsplash.com/photo-1618365378941-f1cc4e3a0587?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    {
        id: 7,
        text: "Card #7",
        uri: "https://images.unsplash.com/photo-1618338335589-d364e9f65f5f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=701&q=80",
    },
    {
        id: 8,
        text: "Card #8",
        uri: "https://images.unsplash.com/photo-1618397480957-852dbfbd6ce6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=701&q=80",
    },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.5;

export default function DeckScreen() {
    const [currentCard, setCurrentCard] = useState(0);
    const position = useRef(new Animated.ValueXY()).current;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,

        onPanResponderMove: (event, gesture) => {
            position.setValue({ x: gesture.dx, y: gesture.dy });
        },

        onPanResponderRelease: (event, gesture) => {
            if (gesture.dx > SWIPE_THRESHOLD) {
                console.log("swiped right!");
                swipeAway("right");
            } else if (gesture.dx < -SWIPE_THRESHOLD) {
                swipeAway("left");
                console.log("swiped left!");
            } else {
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            }
        },
    });

    const swipeAway = (direction) => {
        const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;

        Animated.timing(position, {
            toValue: { x: x, y: 0 },
            duration: 500,
            useNativeDriver: false,
        }).start(() => {
            console.log("card swipe away complete");

            // const item = DATA[currentCard] // item swiped
            // direction === "right" ? props.onSwipeRight(item) : props.onSwipeLeft(item)

            position.setValue({ x: 0, y: 0 });
            setCurrentCard((currentCard) => currentCard + 1);
        });
    };

    const animatedCardStyle = () => {
        const rotation = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ["-120deg", "0deg", "120deg"],
        });

        return {
            ...position.getLayout(),
            transform: [{ rotate: rotation }],
        };
    };

    useEffect(() => {
        UIManager.setLayoutAnimationEnabledExperimental &&
            UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }, [currentCard]);

    if (currentCard >= DATA.length) {
        return (
            <View style={styles.message}>
                <Text>No more cards to swipe through!</Text>
            </View>
        );
    }

    return (
        <View style={{ margin: 10 }}>
            {DATA.map((element, idx) => {
                if (idx < currentCard) {
                    return null;
                } else if (idx === currentCard) {
                    return (
                        <Animated.View
                            key={element.id}
                            {...panResponder.panHandlers}
                            style={[animatedCardStyle(), styles.cardStyle]}
                        >
                            <DeckItem element={element} />
                        </Animated.View>
                    );
                } else {
                    return (
                        <Animated.View
                            key={element.id}
                            style={[
                                styles.cardStyle,
                                { top: 10 * (idx - currentCard), zIndex: -1 },
                            ]}
                        >
                            <DeckItem element={element} />
                        </Animated.View>
                    );
                }
            }).reverse()}
        </View>
    );
}

const styles = StyleSheet.create({
    rotation: {
        transform: [{ rotate: "45deg" }],
    },

    cardStyle: {
        position: "absolute",
        width: "100%",
        // left: 0,
        // right: 0
    },

    message: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 10,
        
    }
});
