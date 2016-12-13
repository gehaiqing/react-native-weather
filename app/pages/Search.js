import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback,
    TextInput,
    BackAndroid,
} from 'react-native';

import Weather from './Weather';
import WeatherService from '../service/WeatherService';
import { connect } from 'react-redux';
import Action from '../actions/city';
import Icon from '../res/iconfont';

/**
 * 城市查询页面
 * 
 * @export
 * @class Search
 * @extends {Component}
 */
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
    }

    /**
     * 返回键处理
     * 
     * 
     * @memberOf Search
     */
    _back() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
            this.setState({
                list: []
            })
        }
    }
    /**
     * 静态列表选中处理
     * 
     * @param {string} cityName
     * 
     * @memberOf Search
     */
    _onStaticItemSelected(cityName) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.resetTo({
                name: '天气',
                component: Weather,
                params: {
                    type: cityName == 'gps' ? 'gps' : 'name',
                    cityName: cityName
                }
            })
        }
    }
    /**
     * 动态列表获取
     * 
     * @param {string} text
     * @returns
     * 
     * @memberOf Search
     */
    async _onSearchTextChange(text) {
        text = text.replace(/\s/g, '');
        if (text == '') {
            this.setState({
                list: []
            })
            return;
        }


        const {dispatch} = this.props;
        if (dispatch) {
            dispatch(Action.getListByName(text));
        }
    }
    /**
     * 动态列表选择处理
     * 
     * @param {any} id
     * 
     * @memberOf Search
     */
    _onSearchItemSelected(id) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.resetTo({
                name: '天气',
                component: Weather,
                params: {
                    type: 'id',
                    cityId: id
                }
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.list)
            this.setState({
                list: nextProps.list
            })
    }
    render() {
        return (
            <View style={[styles.container, { left: this.state.ani }]} {...this.props} >
                <View style={styles.topBar}>
                    <TouchableNativeFeedback onPress={() => this._back()}>
                        <Text style={styles.backBtn}>{Icon.BACK}</Text>
                    </TouchableNativeFeedback>
                    <TextInput onChangeText={(text) => this._onSearchTextChange(text)} placeholder='搜索' autoCorrect={false} autoFocus={false} underlineColorAndroid={'#00000000'} style={styles.searchBox}></TextInput>
                </View>
                {
                    this.state.list.length == 0 ?
                        <View style={styles.cityList}>
                            <View style={styles.cityListItem}>
                                <TouchableNativeFeedback onPress={() => this._onStaticItemSelected('gps')} >
                                    <Text style={[styles.cityListItemTxt,{fontFamily:'iconfont'}]}>{Icon.LOCATION} 定位</Text>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback  >
                                    <Text style={[styles.cityListItemTxt, { backgroundColor: 'transparent' }]}></Text>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback >
                                    <Text style={[styles.cityListItemTxt, { backgroundColor: 'transparent' }]}></Text>
                                </TouchableNativeFeedback>
                            </View>
                            <View style={styles.cityListItem}>
                                <TouchableNativeFeedback onPress={() => this._onStaticItemSelected('成都')} >
                                    <Text style={styles.cityListItemTxt}>成都</Text>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback onPress={() => this._onStaticItemSelected('绵阳')} >
                                    <Text style={styles.cityListItemTxt}>绵阳</Text>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback onPress={() => this._onStaticItemSelected('许昌')} >
                                    <Text style={styles.cityListItemTxt} >许昌</Text>
                                </TouchableNativeFeedback>
                            </View>
                            <View style={styles.cityListItem}>
                                <TouchableNativeFeedback onPress={() => this._onStaticItemSelected('北京')} >
                                    <Text style={styles.cityListItemTxt}>北京</Text>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback onPress={() => this._onStaticItemSelected('上海')} >
                                    <Text style={styles.cityListItemTxt}>上海</Text>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback onPress={() => this._onStaticItemSelected('深圳')} >
                                    <Text style={styles.cityListItemTxt} >深圳</Text>
                                </TouchableNativeFeedback>
                            </View>
                        </View> :
                        <View style={styles.cityList}>
                            {
                                this.state.list.map((item, key) => {
                                    return (
                                        <TouchableNativeFeedback key={key} onPress={() => this._onSearchItemSelected(item.cityInfo.c1)} >
                                            <View style={styles.searchListItem}>
                                                <Text style={styles.cityItem}>{item.cityInfo.c3}</Text>
                                                <Text style={styles.provinceItem}>{item.distric + ' / ' + item.prov}</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    )
                                })
                            }

                        </View>
                }
            </View>
        )
    }
}
const width = 150;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 20
    },
    text: {
        color: 'white',
        fontFamily: 'iconfont',
    },
    header: {
        fontSize: 24
    },
    scroll: {
        // backgroundColor:'gray'
    },
    cityList: {
        marginTop: 20
    },
    cityListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    cityListItemImg: {
        width: 30,
        height: 30,
        flex: 1,
    },
    cityListItemTxt: {
        color: '#2896e1',
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        backgroundColor: '#eee',
        paddingVertical: 5,
        margin: 5
    },
    topBar: {
        flexDirection: 'row',
        backgroundColor: '#2896e1',
        height: 60,
        alignItems: 'center'
    },
    backBtn: {
        fontFamily: 'iconfont',
        color: 'white',
        fontSize: 40,
        paddingHorizontal: 5,
        marginRight: 10
    },
    searchBox: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 3,
        height: 30,
        fontSize: 20,
        marginRight: 30,
        padding: 0,
        paddingHorizontal: 10
    },
    searchListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderColor: '#2896e1',
        borderBottomWidth: .5,
        paddingHorizontal: 30
    },
    cityItem: {
        color: '#2896e1',
        fontSize: 24,
        flex: 1
    },
    provinceItem: {
        color: '#666',
        fontSize: 20
    }
});

function select(store) {
    return {
        list: store.cityStore.searchResultList,
    }
}


export default connect(select)(Search);