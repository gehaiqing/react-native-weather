import React, { Component } from 'react';
import {
    View, StyleSheet,
    Image,
    Dimensions,
    Animated,
    Text
} from 'react-native';


import AnimateView from '../native-components/AnimateView';

/**
 * 下雨效果
 * 
 * @export
 * @class Rain
 * @extends {Component}
 */
export default class Rain extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.count = 40;
        if (this.props.level) {
            switch (this.props.level) {
                case 'small':
                    this.count = 10;
                    break;
                case 'middle':
                    this.count = 20;
                    break;
                case 'normal':
                    this.count = 30;
                    break;
                case 'large':
                    this.count = 40;
                    break;
                case 'larger':
                    this.count = 50;
                    break;
                case 'heavy':
                    this.count = 60;
                    break;
            }
        }

    }

    _genRains() {
        let {width, height} = Dimensions.get('window');
        let count = this.count;
        let positions = [];
        for (let i = 0; i < count; i++) {
            let left = Math.random() * width;
            let top = -60;
            let size = Math.random() * 10 + 10;
            let dur = parseInt(Math.random() * 5000);
            let delay = parseInt(Math.random() * 2000);
            let translateY = (Math.ceil(Dimensions.get('window').height + 50 - top));
            positions.push({
                top,
                left,
                size,
                dur,
                delay,
                translateY
            })
        }

        this.positions = positions;
        return (positions.map((item, index) => {
            return (
                <AnimateView dur={item.dur} delay={item.delay} translateY={item.translateY} key={index} style={[{ position: 'absolute', top: item.top, left: item.left }]}>
                    <Animated.Image key={index}
                        style={[styles.rain, { top: 0, left: 0, width: item.size, height: item.size }]}
                        source={require('../res/img/rain.png')} />
                </AnimateView>)
        })
        );
    }

    componentDidUpdate() {

    }
    componentDidMount() {
    }
    shouldComponentUpdate(nextProps) {
        if (this.props.id == nextProps.id)
            return false;
        return true;
    }
    render() {
        return (
            <View style={styles.container} >
                {this._genRains()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        // backgroundColor:'gray',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    rain: {
        width: 20,
        height: 20,
        // position: 'absolute'
    }
});

