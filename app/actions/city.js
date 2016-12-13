/**
 * city actions
 */

import * as TYPES from './types';
import LocalService from '../service/LocalService';
import WeatherService from '../service/WeatherService';
import WeatherAction from './weather';

export default class Action {
    /**
     * 添加城市
     * 
     * @static
     * @param {Object} data 天气数据
     * @param {boolean} isGps 是否是根据地理位置获取到的天气数据
     * @returns
     * 
     * @memberOf Action
     */
    static addCity(data, isGps) {
        return async (dispatch) => {
            await LocalService.addCity(data, isGps);
            await LocalService.setCurCity(data.cityInfo.c1);
            dispatch(this.getCities());
        }
    }
    /**
     * 获取城市列表
     * 
     * @static
     * @returns
     * 
     * @memberOf Action
     */
    static getCities() {
        return async (dispatch) => {
            let data = await LocalService.getCities();
            let tmp = [];
            for (let key in data) {
                tmp.push({
                    'id': data[key].cityInfo.c1,
                    'image': data[key].f1.day_weather_pic,
                    'name': data[key].cityInfo.c3,
                    'tmp': data[key].f1.day_air_temperature + ' ~ ' + data[key].f1.night_air_temperature + '°c',
                    'fromGPS': data[key].fromGPS
                })
                console.log(data[key].fromGPS)
            }
            dispatch({ 'type': TYPES.GET_CITY_LIST_DONE, cityShowList: tmp, cityDataList: data });
        }
    }
    /**
     * 删除城市
     * 
     * @static
     * @param {Array} delCities
     * @returns
     * 
     * @memberOf Action
     */
    static removeCities(delCities) {
        return async (dispatch) => {
            let curCity = await LocalService.getCurCity();
            let cities = await LocalService.getCities();

            let shouldRefreshWeather = false;
            if (curCity) {
                delCities.forEach((item) => {
                    if (cities[item].cityInfo.c1 == curCity.cityInfo.c1)
                        shouldRefreshWeather = true;
                })
            }

            await LocalService.removeCities(delCities);
            dispatch(this.getCities());
            dispatch({ 'type': TYPES.DELETE_CITY_DONE });
            if (shouldRefreshWeather) {
                dispatch(WeatherAction.showCurCity());
            }
        }
    }
    /**
     * 
     * 开始删除
     * 
     * @static
     * @returns
     * 
     * @memberOf Action
     */
    static startDelete() {
        return async (dispatch) => {
            dispatch({ 'type': TYPES.DELETE_CITY_DOING });
        }
    }

    /**
     * 结束删除
     * 
     * @static
     * @returns
     * 
     * @memberOf Action
     */
    static finishDelete() {
        return async (dispatch) => {
            dispatch({ 'type': TYPES.DELETE_CITY_DONE });
        }
    }

    /**
     * 根据名称获取城市列表
     * 
     * @static
     * @param {string} name
     * @returns
     * 
     * @memberOf Action
     */
    static getListByName(name) {
        return async (dispatch) => {
            let data = await WeatherService.getIdListByName(name);
            if (data.showapi_res_body.list) {
                dispatch({ 'type': TYPES.GET_CITY_LIST_BY_NAME_DONE, data: data.showapi_res_body.list });
            }
        }
    }

}
