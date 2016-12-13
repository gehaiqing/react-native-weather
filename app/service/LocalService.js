import React from 'react';
import {
    AsyncStorage
} from 'react-native'

const KEY = '$WEATHER_LIST$$';
const CUR_CITY_KEY = '$WEATHER_CUR_CITY$$';

let cityList = null;
// AsyncStorage.clear();
/**
 * 本地数据存储
 * 
 * @export
 * @class LocalService
 */
export default class LocalService {
    /**
     * 添加城市
     * 
     * @static
     * @param {object} data 城市天气数据
     * @param {boolean} isGps 是否是定位获取
     * @returns
     * 
     * @memberOf LocalService
     */
    static async  addCity(data, isGps) {
        try {
            let cities = await AsyncStorage.getItem(KEY);
            cities = (cities == null) ? {} : JSON.parse(cities);

            if (!!isGps) {//GPS定位得到的
                let tmp = {}
                for (let key in cities) {//去除之前GPS获取到的
                    if (!cities[key].fromGPS)
                        tmp[key] = cities[key];
                }
                data.fromGPS = true;
                tmp[data.cityInfo.c1] = data;
                cityList = tmp;
                await AsyncStorage.setItem(KEY, JSON.stringify(tmp));
            } else {
                cities[data.cityInfo.c1] = data;
                cityList = cities;
                await AsyncStorage.setItem(KEY, JSON.stringify(cities));
            }
        } catch (err) {
            alert(err)
        }
    }
    static async removeCity(city) {

    }
    /**
     * 从本地删除城市
     * 
     * @static
     * @param {Array} cities 删除城市的ID数组
     * 
     * @memberOf LocalService
     */
    static async removeCities(cities) {
        let locals = await AsyncStorage.getItem(KEY);
        let curCityId = await AsyncStorage.getItem(CUR_CITY_KEY);
        let shouldResetCurCity = false;
        locals = JSON.parse(locals);

        for (let i = 0; i < cities.length; i++) {
            delete locals[cities[i]];
            if (curCityId == cities[i]) {
                shouldResetCurCity = true;
            }
        }
        cityList = locals;
        await AsyncStorage.setItem(KEY, JSON.stringify(locals));
        if (shouldResetCurCity) {
            let count = 0;
            for (let key in locals) {
                if (count == 0) {
                    count++;
                    await this.setCurCity(locals[key].cityInfo.c1)
                    // alert(locals[key].cityInfo.c3);
                }
            }
            if (count == 0) {
                await AsyncStorage.removeItem(CUR_CITY_KEY);
            }
        }
    }
    /**
     * 获取本地城市列表
     * 
     * @static
     * @returns
     * 
     * @memberOf LocalService
     */
    static async getCities() {
        if (cityList)
            return cityList;

        let cities = await AsyncStorage.getItem(KEY);
        cities = cities == null ? {} : JSON.parse(cities);
        cityList = cities;
        return cities;
    }
    /**
     * 设置当前显示的城市ID
     * 
     * @static
     * @param {string} id 城市id
     * 
     * @memberOf LocalService
     */
    static async setCurCity(id) {
        await AsyncStorage.setItem(CUR_CITY_KEY, id);
    }
    /**
     * 获取当前城市的数据
     * 
     * @static
     * @returns
     * 
     * @memberOf LocalService
     */
    static async getCurCity() {
        let curCityId = await AsyncStorage.getItem(CUR_CITY_KEY);
        let cities = await AsyncStorage.getItem(KEY);
        cities = JSON.parse(cities);
        return cities[curCityId];
    }
    /**
     * 当前是否有城市可以显示
     * 
     * @static
     * @returns
     * 
     * @memberOf LocalService
     */
    static async hasCity() {
        let curCityId = await AsyncStorage.getItem(CUR_CITY_KEY);
        return curCityId ? true : false;
    }
} 