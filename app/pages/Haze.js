import React, { Component } from 'react';
import {
    View, StyleSheet,
    Image,
    Dimensions,
    Animated,
    Text
} from 'react-native';

/**
 * 霾效果
 * 
 * @export
 * @class Haze
 * @extends {Component}
 */
export default class Haze extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.count = 100;
    }

    _genHaze() {
        let {width, height} = Dimensions.get('window');
        let count = this.count;
        let positions = [];
        for (let i = 0; i < count; i++) {
            let top = Math.random() * height;
            let left = Math.random() * width;
            let size = Math.random() * 4 + 1;
            positions.push({
                top,
                left,
                size,
            })
        }

        this.positions = positions;
        return (positions.map((item, index) => {
            return (<View key={index} style={[styles.haze, { top: item.top, left: item.left, width: item.size, height: item.size }]} />)
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
                {this._genHaze()}
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
    haze: {
        width: 20,
        height: 20,
        position: 'absolute',
        backgroundColor: '#999',
        borderRadius: 20
    }
});

