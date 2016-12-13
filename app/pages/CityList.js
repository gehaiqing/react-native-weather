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
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    Animated,
    BackAndroid,
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';


import WeatherService from '../service/WeatherService';
import LocalService from '../service/LocalService';
import { connect } from 'react-redux';
import Action from '../actions/city';
import Icon from '../res/iconfont';

/**
 * 城市列表
 * 
 * @export
 * @class CityList
 * @extends {Component}
 */
class CityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ani: new Animated.Value(width),
            cities: [],
            deleting: false
        }
        this.processBack = this._processBack.bind(this);
        this.isShow = false;
        this.list = {};
        this.refresh();
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true)
        }
    }
    /**
     * 刷新列表
     * 
     * 
     * @memberOf CityList
     */
    async refresh() {
        const {dispatch} = this.props;
        if (dispatch) {
            dispatch(Action.getCities());
        }
    }
    /**
     * 显示列表
     * 
     * 
     * @memberOf CityList
     */
    show() {
        Animated.timing(this.state.ani, {
            toValue: width
        }).start((() => {

        }).bind(this));
        this.isShow = true;
    }
    /**
     * 隐藏列表
     * 重置选中状态
     * 
     * @memberOf CityList
     */
    _close() {
        Animated.timing(this.state.ani, {
            toValue: 0
        }).start((() => {
        }).bind(this));
        this.isShow = false;
        this.exitDelete();

    }
    /**
     * 切换显示城市
     * 
     * @param {object} city 要切换的城市数据
     * 
     * @memberOf CityList
     */
    showCity(city) {
        if (this.state.deleting) {
            city.selected = !city.selected;
            this.setState({
                cities: this.state.cities
            })
        }
        else if (this.props.weather) {
            this.props.weather.changeLocalCity(this.list[city.id])
        }
    }
    /**
     * 显示删除相关UI
     * 
     * @param {object} city 当前选中的城市数据
     * 
     * @memberOf CityList
     */
    _showDeleteSel(city) {
        if (!this.state.deleting) {
            city.selected = !city.selected;
            this.setState({
                deleting: true
            })
        }
    }
    /**
     * 退出删除状态
     * 
     * @memberOf CityList
     */
    exitDelete() {
        for (let key in this.state.cities) {
            this.state.cities[key].selected = false;
        }
        this.setState({
            deleting: false
        })
    }
    /**
     * 处理Android返回键
     * 处于删除状态，则退出删除状态
     * 否则，处于列表状态，则退出列表
     * 否则，退出界面
     * 
     * @returns
     * 
     * @memberOf CityList
     */
    _processBack() {
        if (this.state.deleting) {
            this.exitDelete();
            return true;
        }
        else if (this.isShow) {
            this._close();
            return true;
        }
        return false;
    }
    /**
     * 删除选中的城市
     * 
     * 
     * @memberOf CityList
     */
    async _delete() {
        var delCities = [];
        for (let key in this.state.cities) {
            if (this.state.cities[key].selected) {
                delCities.push(this.state.cities[key].id);
            }
        }

        let {dispatch} = this.props;
        if (dispatch) {
            dispatch(Action.removeCities(delCities))
        }
    }
    componentWillMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.processBack);
    }
    /**
     * 改变属性后处理
     * 
     * @param {any} nextProps
     * 
     * @memberOf CityList
     */
    componentWillReceiveProps(nextProps) {
        if ((nextProps.deleting != null) && nextProps.deleting != this.state.deleting) {
            this.setState({
                deleting: nextProps.deleting
            })
        }
        if (this.props.cities) {
            this.setState({
                cities: nextProps.cities
            })
            this.list = nextProps.list;
        }
    }
    /**
     * LayoutAnimation 动画设置
     * 
     * 
     * @memberOf CityList
     */
    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }
    /**
     * 渲染城市列表
     * 
     * @returns
     * 
     * @memberOf CityList
     */
    _renderList() {
        return (this.state.cities.map((item, index) => {
            return (
                <TouchableNativeFeedback onPress={() => this.showCity(item)} key={index} onLongPress={() => this._showDeleteSel(item)}>
                    <View style={styles.cityListItem}>
                        {
                            this.state.deleting ? (item.selected ? <Text style={[styles.checkBoxTxt]}>{Icon.CHECKED_TRUE}</Text> : <Text style={[styles.checkBoxTxt]}>{Icon.CHECKED_FALSE}</Text>)
                                : null
                        }
                        <Text style={[styles.cityListItemTxt]}>{item.name + (item.fromGPS ? Icon.LOCATION : '')}</Text>
                        <Image source={{ uri: item.image }} style={styles.cityListItemImg} resizeMode='contain' />
                        <Text style={[styles.cityListItemTxt, { textAlign: 'right' }]}>{item.tmp}</Text>
                    </View>
                </TouchableNativeFeedback>
            )
        }));
    }
    /**
     * 渲染顶部栏
     * 
     * @returns
     * 
     * @memberOf CityList
     */
    _renderOpt() {
        return (this.state.deleting ?
            <View style={[styles.delWrap]}>
                <TouchableNativeFeedback onPress={() => this._delete()} >
                    <Text style={[styles.delBtn]}>删除</Text>
                </TouchableNativeFeedback>
            </View> :
            <Text style={[styles.text, styles.header, { marginTop: 10 }]}> {Icon.CATEGORY}城市列表</Text>);
    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={() => this._close()}>
                <Animated.View style={[styles.container, { width: this.props.width }]}  >
                    <TouchableWithoutFeedback>
                        <View style={styles.content}>
                            {this._renderOpt()}
                            <ScrollView style={styles.scroll}>
                                <View style={styles.cityList}>
                                    {this._renderList()}
                                </View>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </TouchableWithoutFeedback>
        )
    }
}
const width = 160;

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        width: 10,
        // position: 'absolute',
        top: 0,
        left: 0,
        // alignItems: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    content: {
        width: width,
        flex: 1,
        paddingTop: 15,
        backgroundColor: 'rgba(49,207,218,0.9)',
    },
    text: {
        color: 'white',
        fontFamily: 'iconfont',
    },
    header: {
        fontSize: 20
    },
    scroll: {
        // backgroundColor:'gray'
    },
    cityList: {
        padding: 5
    },
    cityListItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cityListItemImg: {
        width: 30,
        height: 30,
        flex: 1
    },
    cityListItemTxt: {
        color: 'white',
        fontFamily:'iconfont'
        // flex: 1
    },
    checkBoxTxt: {
        fontFamily: 'iconfont',
        color: 'white',
        marginHorizontal: 5
    },
    delWrap: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    delBtn: {
        backgroundColor: 'white',
        fontSize: 16,
        paddingVertical: 2,
        borderRadius: 5,
        width: 50,
        textAlign: 'center',
        marginRight: 5
    }
});

function select(store) {
    return {
        cities: store.cityStore.cityShowList,
        list: store.cityStore.cityDataList,
        deleting: store.cityStore.deleting
    }
}


export default connect(select, null, null, { withRef: true })(CityList);