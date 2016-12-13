import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    PermissionsAndroid,
    StatusBar,
    ScrollView,
    RefreshControl,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    LayoutAnimation,
    Platform,
    UIManager,
    BackAndroid
} from 'react-native';

import Service from '../service/WeatherService';
import CityList from './CityList';
import Search from './Search';
import LocalService from '../service/LocalService';
import LifeTimer from './LifeTimer';
import WeatherAction from '../actions/weather';
import CityAction from '../actions/city';
import Rain from './Rain';
import Haze from './Haze';
import Snow from './Snow';
import Thunder from './Thunder';
import Icon from '../res/iconfont';

import { connect } from 'react-redux';

var defaultData = require('../data/data.json');

/**
 * 天气主页面
 * 
 * @export
 * @class Weather
 * @extends {Component}
 */
class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: null,
            permission: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            days: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'],
            refreshing: false,
            showCityList: 0
        }
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true)
        }
        this.processBack = this._processBack.bind(this);
    }
    componentWillMount() {
        this._init();
        BackAndroid.addEventListener('hardwareBackPress', this.processBack);
    }
    _processBack() {
        if (this.state.showCityList) {
            this._toggleCities();
            return true;
        }

        return false;
    }
    /**
     * 初始化
     * 
     * 
     * @memberOf Weather
     */
    async _init() {

        if (this.props.type)
            this._changeCity();
        else {
            let hasCity = await LocalService.hasCity();

            if (hasCity) {
                let {dispatch} = this.props;
                if (dispatch) {
                    dispatch(WeatherAction.showCurCity());
                }
            } else {
                this._requestPermission();
            }
        }
    }
    /**
     * 重置
     * 删除城市后，如果当前选择的城市被删除则重置
     * 
     * @memberOf Weather
     */
    async reset() {
        let curCity = await LocalService.getCurCity();

        if (curCity) {
            let {dispatch} = this.props;
            if (dispatch) {
                dispatch(WeatherAction.showCurCity());
            }
        } else {
            this._requestPermission();
        }
    }
    /**
     * 城市变化处理
     * 
     * 
     * @memberOf Weather
     */
    async _changeCity() {
        if (this.props.type == 'name') {
            let {dispatch} = this.props;
            if (dispatch) {
                dispatch(WeatherAction.getWeather('name', this.props.cityName));
            }
        } else if (this.props.type == 'id') {
            let {dispatch} = this.props;
            if (dispatch) {
                dispatch(WeatherAction.getWeather('id', this.props.cityId));
            }
        } else if (this.props.type == 'gps') {
            this._requestPermission();
        }
    }
    /**
     * 获取定位位置的天气数据
     * 
     * 
     * @memberOf Weather
     */
    async _requestPermission() {
        let result = await PermissionsAndroid.requestPermission(
            this.state.permission,
            {
                title: '权限请求',
                message:
                '该应用需要地理职位权限 ' +
                ' 请授权!'
            },
        );

        if (result) {
            navigator.geolocation.getCurrentPosition(async (location) => {
                const {dispatch} = this.props;
                dispatch(WeatherAction.getWeather('gps', { lat: location.coords.latitude, lng: location.coords.longitude }));
            })
        } else {
            const {dispatch} = this.props;
            dispatch(WeatherAction.getWeather('name', '北京'));
        }
    }
    /**
     * 汽车限号
     * 
     * @param {int} week
     * @returns
     * 
     * @memberOf Weather
     */
    _carNumberLimit(week) {
        var limits = [[], [5, 0], [1, 6], [2, 7], [3, 8], [4, 9], [], []];
        return limits[week].length > 0 ? limits[week].join(' | ') : null;
    }
    /**
     * 将数字转换为星期
     * 
     * @param {int} num
     * @returns
     * 
     * @memberOf Weather
     */
    _convertNumToCHWeek(num) {
        var chs = ['', '一', '二', '三', '四', '五', '六', '日', '八', '九'];
        return '周' + chs[num];
    }
    /**
     * 
     * 下拉刷新
     * 
     * @memberOf Weather
     */
    async _refresh() {
        this.setState({
            refreshing: true
        })

        if (this.state.info.fromGPS)
            this._requestPermission();

        else {
            let {dispatch} = this.props;
            if (dispatch) {
                dispatch(WeatherAction.getWeather('id', this.state.info.cityInfo.c1));
            }
        }
    }
    /**
     * 时间格式化
     * 
     * @returns
     * 
     * @memberOf Weather
     */
    _getTime() {
        var str = '';
        var date = new Date();
        str = (date.getMonth() + 1) + '月';
        str += date.getDate() + '日, ';
        str += this._convertNumToCHWeek(date.getDay()) + ' '
        let hour = date.getHours();
        str += (hour < 10 ? '0' + hour : hour) + ':';
        let minute = date.getMinutes();
        str += minute < 10 ? '0' + minute : minute + '';

        return str;
    }
    /**
     * 天气数据中的日期格式化
     * 
     * @param {string} str 时间字符串，如20161128
     * @returns
     * 
     * @memberOf Weather
     */
    _getDay(str) {
        let curYear = new Date().getFullYear();
        let timeYear = str.replace(/(\d{4})(\d{2})(\d{2})/, '$1');
        return str.replace(/(\d{4})(\d{2})(\d{2})/, curYear == timeYear ? '$2月$3日' : '$1年$2月$3日');
    }
    /**
     * 显示城市列表
     * 
     * @memberOf Weather
     */
    _toggleCities(flag) {
        if (typeof flag == 'boolean' && !flag) {
            this.setState({
                showCityList: false
            })
        } else {
            this.setState({
                showCityList: !this.state.showCityList
            })
        }

        if (this.state.showCityList) {
            this.cityListPanel.exitDelete();
        }
    }
    /**
     * 显示添加城市界面
     * 
     * @memberOf Weather
     */
    _showSearch() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: '添加城市',
                component: Search,
            })
        }
    }
    /**
     * 切换本地城市
     * 
     * @param {object} data 城市天气数据
     * 
     * @memberOf Weather
     */
    changeLocalCity(data) {
        let {dispatch} = this.props;
        if (dispatch) {
            dispatch(WeatherAction.showCity(data.cityInfo.c1));
        }
    }
    /**
     * 显示时间页面
     * 
     * 
     * @memberOf Weather
     */
    _showLifeTime() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: '我的时间',
                component: LifeTimer,
            })
        }
    }
    /**
     * 根据天气编码变化北京颜色
     * 
     * @param {string} weather_code
     * 
     * @memberOf Weather
     */
    _setBGColor(weather_code) {
        switch (weather_code) {
            case '00':
                bgColor = '#2896e1';
                break;
            case '01':
                bgColor = '#49a2df';
                break;
            case '02':
                bgColor = '#b6bfd0';
                break;
            case '53':
                bgColor = '#808284';
                break;
            default:
                bgColor = '#2896e1';
                break;
        }
    }

    /**
     * 渲染天气背景
     * 
     * @returns
     * 
     * @memberOf Weather
     */
    _renderBg() {
        if (!this.state.info)
            return;

        let id = this.state.info.cityInfo.c1;
        switch (this.state.info.now.weather_code) {
            case '04':
            case '05':
                return (<Thunder id={id} />)
            case '07':
                return (<Rain level={'small'} id={id} />)
            case '08':
            case '21':
                return (<Rain level={'middle'} id={id} />)
            case '09':
            case '22':
                return (<Rain level={'normal'} id={id} />)
            case '10':
            case '23':
                return (<Rain level={'large'} id={id} />)
            case '11':
            case '24':
                return (<Rain level={'larger'} id={id} />)
            case '12':
            case '25':
                return (<Rain level={'heavy'} id={id} />)
            case '13':
            case '14':
            case '15':
            case '16':
            case '17':
            case '26':
            case '27':
            case '28':
                return (<Snow id={id} />);
            case '53':
                return (<Haze id={id} />)
        }

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            info: nextProps.info,
            refreshing: false
        })
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    /**
     * 渲染城市列表栏
     * 
     * @returns
     * 
     * @memberOf Weather
     */
    _renderCityList() {
        if (this.cityListPanel) {
            return (<CityList width={cityListWidth} weather={this} />)
        } else {
            return (<CityList width={cityListWidth} ref={(cl) => { cl ? this.cityListPanel = cl.getWrappedInstance() : null; } } weather={this} />)
        }
    }
    /**
     * 渲染预报日期列表
     * 
     * @returns
     * 
     * @memberOf Weather
     */
    _renderDayList() {
        return (
            this.state.showCityList ? null :
                <View style={styles.list}>
                    {
                        this.state.days.map((item, index) => {
                            return (
                                <View style={[styles.horContainer, { borderColor: 'rgba(40,255,255,0.2)', borderBottomWidth: 0.8 }]} key={index}>
                                    <View style={[styles.verContainer, { flex: 1.5 }]}>
                                        <Text style={[styles.text]}>{item == 'f1' ? '今天' : this._getDay(this.state.info[item].day)}</Text>
                                        {item == 'f1' ? null : <Text style={styles.text}>{item == 'f1' ? ' ' : this._convertNumToCHWeek(this.state.info[item].weekday)}</Text>}
                                    </View>
                                    <Image source={{ uri: this.state.info[item].day_weather_pic }} style={[styles.image, { flex: 1 }]} resizeMode='contain' />
                                    <View style={[styles.verContainer, { flex: 1.5, alignItems: 'flex-end' }]}>
                                        <Text style={styles.text}>{this.state.info[item].day_weather}</Text>
                                        <Text style={styles.text}>{this.state.info[item].day_air_temperature + ' ~ ' + this.state.info[item].night_air_temperature + '°c'}</Text>
                                        <Text style={styles.text}>{this.state.info[item].day_wind_power.split(' ')[0]}</Text>
                                    </View>
                                </View>)
                        })
                    }
                </View>
        );
    }
    /**
     * 渲染提示信息
     * 
     * @returns
     * 
     * @memberOf Weather
     */
    _renderTipList() {
        return (this.state.showCityList ? null :
            <View style={[styles.list, { marginBottom: 50 }]}>
                {this._carNumberLimit(this.state.info.f1.weekday) && this.state.info.cityInfo.c7 == '北京' ?
                    <View style={[styles.horContainer]}>
                        <View style={[styles.verContainerCenter, { flex: 1 }]}>
                            <Text style={[styles.text]}>限号</Text>
                            <Text style={styles.largeText}>{this._carNumberLimit(this.state.info.f1.weekday)}</Text>
                        </View>
                    </View> : null}
                <View style={[styles.horContainer]}>
                    <View style={[styles.verContainerCenter, { flex: 1, borderColor: borderColor, borderBottomWidth: 1, borderRightWidth: 1 }]}>
                        <Text style={[styles.text]}>约会</Text>
                        <Text style={styles.largeText}>{this.state.info.f1.index.yh.title || '无'}</Text>
                    </View>
                    <View style={[styles.verContainerCenter, { flex: 1, borderColor: borderColor, borderBottomWidth: 1, borderRightWidth: 1 }]}>
                        <Text style={[styles.text]}>晾晒</Text>
                        <Text style={styles.largeText}>{this.state.info.f1.index.ls.title || '无'}</Text>
                    </View>
                    <View style={[styles.verContainerCenter, { flex: 1, borderColor: borderColor, borderBottomWidth: 1 }]}>
                        <Text style={[styles.text]}>穿衣指数</Text>
                        <Text style={styles.largeText}>{this.state.info.f1.index.clothes.title || '无'}</Text>
                    </View>
                </View>
                <View style={[styles.horContainer]}>
                    <View style={[styles.verContainerCenter, { flex: 1, borderColor: borderColor, borderBottomWidth: 1, borderRightWidth: 1 }]}>
                        <Text style={[styles.text]}>户外运动</Text>
                        <Text style={styles.largeText}>{this.state.info.f1.index.sports.title || '无'}</Text>
                    </View>
                    <View style={[styles.verContainerCenter, { flex: 1, borderColor: borderColor, borderBottomWidth: 1, borderRightWidth: 1 }]}>
                        <Text style={[styles.text]}>旅游</Text>
                        <Text style={styles.largeText}>{this.state.info.f1.index.travel.title || '无'}</Text>
                    </View>
                    <View style={[styles.verContainerCenter, { flex: 1, borderColor: borderColor, borderBottomWidth: 1 }]}>
                        <Text style={[styles.text]}>化妆指数</Text>
                        <Text style={styles.largeText}>{this.state.info.f1.index.beauty.title || '无'}</Text>
                    </View>
                </View>
                <View style={[styles.horContainer]}>
                    <View style={[styles.verContainerCenter, { flex: 1, borderColor: borderColor, borderRightWidth: 1 }]}>
                        <Text style={[styles.text]}>感冒</Text>
                        <Text style={styles.largeText}>{this.state.info.f1.index.cold.title || '无'}</Text>
                    </View>
                    <View style={[styles.verContainerCenter, { flex: 1, borderColor: borderColor, borderRightWidth: 1 }]}>
                        <Text style={[styles.text]}>紫外线</Text>
                        <Text style={styles.largeText}>{this.state.info.f1.index.uv.title || '无'}</Text>
                    </View>
                    <View style={[styles.verContainerCenter, { flex: 1 }]}>
                        <Text style={[styles.text]}>洗车</Text>
                        <Text style={styles.largeText}>{this.state.info.f1.index.wash_car.title || '无'}</Text>
                    </View>
                </View>
            </View>);
    }
    /**
     * 渲染当前城市信息
     * 
     * @returns
     * 
     * @memberOf Weather
     */
    _renderCityInfo() {
        return (<View style={styles.now}>
            <Text style={styles.textTitle}>{(this.state.info.fromGPS ? Icon.LOCATION : '') + ' ' + this.state.info.cityInfo.c3}</Text>
            <Text style={[styles.text, { marginTop: 10 }]}>{this._getTime()}</Text>
            <View style={styles.horContainer}>
                <Image source={{ uri: this.state.info.now.weather_pic }} style={styles.image} />
                <Text style={styles.textLargeTmp}>{this.state.info.now.temperature + '°'}</Text>
                <Text style={[styles.text, { fontSize: 50, marginLeft: -5, bottom: -3 }]}>c</Text>
            </View>
            {
                this.state.info.now.aqiDetail ?
                    <Text style={styles.text}>{'AQI ' + this.state.info.now.aqiDetail.aqi + ' ' + this.state.info.now.aqiDetail.quality}</Text>
                    : null
            }

            <Text style={styles.text}>{this.state.info.now.weather}</Text>
            <Text style={[styles.text, { fontSize: 10 }]}>数据时间: {this.state.info.time.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$2/$3 ') + this.state.info.now.temperature_time} </Text>
        </View>);
    }

    /**
     * 渲染顶部栏
     * 
     * @returns
     * 
     * @memberOf Weather
     */
    _renderBar() {
        return (<View style={[styles.barPanel, { backgroundColor: bgColor, width: Dimensions.get('window').width + (this.state.showCityList ? -cityListWidth : 0) }]}>
            <View style={{ flex: 1 }}>
                {
                    this.state.showCityList ? null :
                        <TouchableOpacity onPress={() => this._showLifeTime()} >
                            <Text style={[styles.textBar]}>{Icon.TIME}我的时间</Text>
                        </TouchableOpacity>
                }

            </View>
            {
                this.state.showCityList ? null : <TouchableOpacity onPress={() => this._showSearch()}>
                    <Text style={styles.textBar}>{Icon.ADD}添加</Text>
                </TouchableOpacity>
            }

            <TouchableOpacity onPress={() => this._toggleCities()}>
                {
                    this.state.showCityList == 0 ? <Text style={styles.textBar}>{Icon.CATEGORY}城市</Text>
                        : <Text style={styles.textBar}>{Icon.CLOSE}城市</Text>
                }
            </TouchableOpacity>
        </View>);
    }
    /**
     * 渲染天气界面
     * 
     * @returns
     * 
     * @memberOf Weather
     */
    _renderWeather() {
        return (
            <View style={{ flex: 1, backgroundColor: bgColor }}>
                <StatusBar hidden={true} backgroundColor='transparent' />
                {this._renderBg()}
                {
                    this.state.info ?
                        <ScrollView style={styles.scroll}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    progressViewOffset={80}
                                    onRefresh={() => { this._refresh() } }
                                    tintColor={"#2896e1"}
                                    title="Loading..."
                                    titleColor="#00ff00"
                                    colors={["#2896e1"]}
                                    progressBackgroundColor="white"
                                    />
                            }>
                            <TouchableWithoutFeedback onPress={() => this._toggleCities(false)}>
                                <View style={[!this.state.showCityList ? styles.container : styles.containerCenter, { backgroundColor: 'transparent', justifyContent: 'center' }]}>
                                    {this._renderCityInfo()}
                                    {this._renderTipList()}
                                    {this._renderDayList()}
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView> : <View></View>
                }
                {this._renderBar()}
            </View>);
    }
    render() {
        if (this.state.info) {
            this._setBGColor(this.state.info.now.weather_code);
            // this._setBGColor('02');
        }
        return (
            <View style={{ flexDirection: 'row', left: 0, backgroundColor: bgColor, width: Dimensions.get('window').width + (this.state.showCityList ? 0 : cityListWidth) }}>
                {this._renderWeather()}
                {this._renderCityList()}
            </View>
        )
    }
}

const cityListWidth = 160;
let bgColor = 'transparent';
const borderColor = 'rgba(40,255,255,0.2)';
const styles = StyleSheet.create({
    scroll: {
        // backgroundColor: bgColor,
        // height: 200
        flex: 1,
    },
    container: {
        flex: 1,
        // backgroundColor: bgColor,
        paddingHorizontal: 10,
        paddingTop: 60,
    },
    containerCenter: {
        paddingHorizontal: 10,
        height: Dimensions.get('window').height
    },
    horContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    verContainer: {
        flexDirection: 'column',
    },
    verContainerCenter: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 10
    },
    now: {
        alignItems: 'center',
    },
    list: {
        marginTop: 40,
        borderColor: 'rgba(40,255,255,0.2)',
        // borderTopWidth: 1
    },
    text: {
        color: 'white',
        marginVertical: 2
    },
    textTitle: {
        color: 'white',
        fontSize: 30,
        fontFamily: 'iconfont'
    },
    largeText: {
        color: 'white',
        marginVertical: 2,
        fontSize: 18
    },
    textFlex: {
        color: 'white',
    },
    textLargeTmp: {
        color: 'white',
        fontSize: 60,
        marginLeft: 10
    },
    image: {
        width: 60,
        height: 60
    },
    barPanel: {
        position: 'absolute',
        paddingTop: 20,
        paddingHorizontal: 10,
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        top: 0,
        left: 0,
        height: 60,
        // backgroundColor: bgColor,
        // justifyContent: 'flex-end'
    },
    textBar: {
        color: 'white',
        fontFamily: 'iconfont',
        fontSize: 20,
        padding: 5
    }
})

function select(store) {
    return {
        info: store.weatherStore.info,
    }
}


export default connect(select)(Weather);
