import React, { Component } from 'react';
import {
    View, StyleSheet,
    Image,
    Dimensions,
    Animated,
    Text,
    PixelRatio
} from 'react-native';

import AnimateView from '../native-components/AnimateView';

/**
 * 下雪效果
 * 
 * @export
 * @class Snow
 * @extends {Component}
 */
export default class Snow extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.count = 10;
        if (this.props.level) {
            switch (this.props.level) {
                case 'small':
                    this.count = 10;
                    break;
                case 'normal':
                    this.count = 20;
                    break;
                case 'large':
                    this.count = 40;
                    break;
                case 'heavy':
                    this.count = 60;
                    break;
            }
        }
        this.snows = [];
    }

    _genSnows() {
        let {width, height} = Dimensions.get('window');
        let count = this.count;
        let positions = [];
        for (let i = 0; i < count; i++) {
            let left = Math.random() * width;
            let top = -60;
            let size = Math.random() * 10 + 10;
            let dur = parseInt(Math.random() * 5000) + 8000;
            let delay = parseInt(Math.random() * (i%2 ==0) ?0:3000);
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
            return (<AnimateView dur={item.dur} delay={item.delay} translateY={item.translateY} key={index} style={[{ position: 'absolute', top: item.top, left: item.left }]}>
                <Text style={[styles.snow, { top: 0, left: 0, width: item.size, height: item.size,fontSize:item.size }]}>&#xe610;</Text>
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
                {this._genSnows()}
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
    snow: {
        fontFamily:'iconfont',
        fontSize:30,
        color:'white',

        // position: 'absolute'
    }
});

