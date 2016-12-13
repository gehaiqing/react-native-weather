import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    Animated,
    Text
} from 'react-native';

/**
 * 闪电效果
 * 
 * @export
 * @class Thunder
 * @extends {Component}
 */
export default class Thunder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anim: new Animated.Value(0)
        }
    }

    ani() {
        let timing = Animated.timing;
        let seq = [Animated.delay(1000)];
        for (let i = 0; i < 6; i++) {
            seq.push(timing(this.state.anim, {
                toValue: 1,
                duration: 100,
            }))
            seq.push(timing(this.state.anim, {
                toValue: 0,
                duration: 100,
            }))
        }
        Animated.sequence(seq
        ).start(() => this.ani());
    }
    componentDidUpdate() {
        this.ani();
    }
    componentDidMount() {
        this.ani()
    }
    shouldComponentUpdate(nextProps) {
        if (this.props.id == nextProps.id)
            return false;
        return true;
    }
    render() {
        return (
            <View style={styles.container} >
                <Animated.Image style={[styles.thunder, { opacity: this.state.anim }]} source={require('../res/img/thunder1.png')}></Animated.Image>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    thunder: {
        width: 320,
        height: 320,
        position: 'absolute',
        right: 0
    }
});

