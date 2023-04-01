import React, { useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
} from "react-native";

export default function App() {
    const [index, setIndex] = React.useState(0);

    const questions = [
        "Do you tend to follow directions when given?",
        "Are you comfortable with the idea of standing and doing light physical activity most of the day?",
        "Would you enjoy making sure your customers leave happy?",
        "Are you willing to work nights and weekends (and possibly holidays)?",
    ];

    const animation = useRef(new Animated.Value(0)).current;
    const progress = useRef(new Animated.Value(0)).current;

    const reset = () => {
        animation.setValue(0);
        progress.setValue(0);
        setIndex(0);
    };

    const handleAnswer = () => {
        Animated.parallel([
            Animated.timing(progress, {
                toValue: index + 1,
                duration: 400,
            }),
            Animated.timing(animation, {
                toValue: 1,
                duration: 400,
            }),
        ]).start(() => {
            // this.setState(
            //     (state) => {
            //         return {
            //             index: state.index + 1,
            //         };
            //     },
            //     () => {
            //         this.state.animation.setValue(0);
            //     }
            // );

            setIndex(index + 1);
        });
    };

    React.useEffect(() => {
        animation.setValue(0);
    }, [index]);

    const { width } = Dimensions.get("window");

    const nextQuestionInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [width, 0],
    });

    const mainQuestionInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -width],
    });

    const progressInterpolate = progress.interpolate({
        inputRange: [0, questions.length],
        outputRange: ["0%", "100%"],
    });

    const progressStyle = {
        width: progressInterpolate,
    };

    const mainQuestionStyle = {
        transform: [
            {
                translateX: mainQuestionInterpolate,
            },
        ],
    };

    const nextQuestionStyle = {
        transform: [
            {
                translateX: nextQuestionInterpolate,
            },
        ],
    };

    const question = questions[index];
    let nextQuestion;
    if (index + 1 < questions.length) {
        nextQuestion = questions[index + 1];
    }

    return (
        <View style={styles.container}>
            <View style={[styles.overlay, StyleSheet.absoluteFill]}>
                <View style={styles.questionContainer}>
                    <Animated.Text
                        style={[styles.questionText, mainQuestionStyle]}
                    >
                        {question}
                    </Animated.Text>
                    <Animated.Text
                        style={[styles.questionText, nextQuestionStyle]}
                    >
                        {nextQuestion}
                    </Animated.Text>
                </View>
            </View>

            <View style={styles.progress}>
                <Animated.View style={[styles.bar, progressStyle]} />
            </View>

            <TouchableOpacity
                onPress={handleAnswer}
                style={styles.option}
                activeOpacity={0.7}
            >
                <Text style={styles.optionText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleAnswer}
                style={[styles.option, styles.yes]}
                activeOpacity={0.7}
            >
                <Text style={styles.optionText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.close} onPress={reset}>
                <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
        </View>
    );
}
// Add progress bar at bottom

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E22D4B",
        flexDirection: "row",
    },
    progress: {
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
        height: 10,
    },
    bar: {
        height: "100%",
        backgroundColor: "#FFF",
    },
    overlay: {
        alignItems: "center",
        justifyContent: "center",
    },
    questionContainer: {
        width: "100%",
        height: 100,
    },
    questionText: {
        fontSize: 30,
        color: "#FFF",
        textAlign: "center",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
    },
    close: {
        position: "absolute",
        top: 30,
        right: 30,
        backgroundColor: "transparent",
    },
    closeText: {
        fontSize: 30,
        color: "#FFF",
    },
    option: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    yes: {
        backgroundColor: "rgba(255,255,255,.1)",
    },
    optionText: {
        fontSize: 30,
        color: "#FFF",
        marginBottom: 50,
    },
});
