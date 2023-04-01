import React, { useRef } from "react";
import {
    StyleSheet,
    View,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";

export default function App() {
    const animation = useRef(new Animated.ValueXY(0)).current;
    let _width = 0;
    let _height = 0;

    const startAnimation = () => {
        
        const { width, height } = Dimensions.get("window");

        Animated.sequence([
            Animated.spring(animation.y, {
                toValue: height - _height,
            }),
            Animated.spring(animation.x, {
                toValue: width - _width,
            }),
            Animated.spring(animation.y, {
                toValue: 0,
            }),
            Animated.spring(animation.x, {
                toValue: 0,
            }),
        ]).start();
    };

    
    const saveDimensions = (e) => {
        const { width, height } = e.nativeEvent.layout;
        _width = width;
        _height = height;
    };

   const animatedStyles = {
       transform: animation.getTranslateTransform(),
   };

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback
                onPress={startAnimation}
                onLayout={saveDimensions}
            >
                <Animated.View style={[styles.box, animatedStyles]} />
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    box: {
        width: 150,
        height: 150,
        backgroundColor: "tomato",
        position: "absolute",
        top: 0,
        left: 0,
    },
});