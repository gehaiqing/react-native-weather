import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';

const LifeStart = new Date(1987, 8, 28, 9, 0, 0);
const MeetStart = new Date(2005, 9, 30, 9, 0, 0);
const LoveStart = new Date(2015, 2, 19, 22, 0, 0);

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const SECOND = 1000;

export default class LifeTimer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lifeTime: '',
            meetTime: '',
            loveTime: ''
        }
    }
    componentWillMount() {
        this._startTimer()
    }
    componentWillUnmount() {
        clearTimeout(this.timer);
    }
    _startTimer() {
        this._timerFn();
    }
    _formatTime(millisecond) {
        let t = '';
        let day = Math.floor(millisecond / DAY);
        t += (day ? day + '天' : '');
        let hour = Math.floor((millisecond - day * DAY) / HOUR);
        t += hour + '小时';
        let minute = Math.floor((millisecond - day * DAY - hour * HOUR) / MINUTE)
        t += minute + '分钟';
        let second = Math.floor((millisecond - day * DAY - hour * HOUR - minute * MINUTE) / SECOND)
        t += (second < 10 ? ('0' + second) : second) + '秒';
        return t + '\n' + Math.floor((millisecond) / HOUR) + '小时\n' +
            Math.floor((millisecond) / MINUTE) + '分钟\n' + Math.floor((millisecond) / SECOND) + '秒';
    }
    _timerFn() {
        let now = Date.now();
        this.setState({
            lifeTime: this._formatTime(now - LifeStart.getTime()),
            meetTime: this._formatTime(now - MeetStart.getTime()),
            loveTime: this._formatTime(now - LoveStart.getTime()),
        })

        this.timer = setTimeout(() => {
            this._timerFn();
        }, 1000)
    }
    _back() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => this._back()} >
                    <Image style={styles.bg} source={require('../res/img/bg.jpg')} resizeMode='cover'>
                        <Text style={styles.text}>{this.state.lifeTime}</Text>
                        <Text style={styles.text}>{this.state.meetTime}</Text>
                        <Text style={styles.text}>{this.state.loveTime}</Text>
                    </Image>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    bg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#eee',
        paddingVertical: 20,
        textAlign: 'left'
    }
})
