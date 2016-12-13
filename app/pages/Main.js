import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {
    View, TextInput, StyleSheet, TouchableOpacity, Text, Navigator, BackAndroid
} from 'react-native';

import Weather from './Weather';
import LifeTimer from './LifeTimer';
import configureStore from '../store/index';
import Rain from './Rain';
import Snow from './Snow';
import Thunder from './Thunder';
import Test from './test';

let store = configureStore();

let _navigator;

/**
 * 入口，页面跳转的navigator
 * 
 * @export
 * @class Main
 * @extends {Component}
 */
export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            com: Test,
            init: false
        }
    }
    componentWillMount() {

    }
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', function () {
            if (_navigator == null) {
                return false;
            }
            if (_navigator.getCurrentRoutes().length === 1) {
                return false;
            }
            _navigator.pop();
            return true;
        });
    }

    render() {
        return (
            <Provider store={store}>
                <Navigator
                    initialRoute={{ name: '入口', component: this.state.com }}
                    configureScene={(route) => {
                        return Navigator.SceneConfigs.FadeAndroid;
                    } }
                    renderScene={(route, navigator) => {
                        _navigator = navigator;
                        let Component = route.component;
                        return <Component {...route.params} navigator={navigator} name={route.name} />
                    } }
                    />
            </Provider>);
    }
}

