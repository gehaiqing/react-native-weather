/**
 * weather actions
 */

import * as TYPES from './types';
import Service from '../service/WeatherService';
import LocalService from '../service/LocalService';
import CityAction from './city';

export default class Action {
    /**
     * 获取天气数据
     * 
     * @static
     * @param {string} type 获取类型：gps:通过gps获取到的位置获取; id:根据城市id获取; name:根据城市名称获取
     * @param {any} args type为gps时为{lat,lng}. id时为城市id. name时为城市名称
     * @returns
     * 
     * @memberOf Action
     */
    static getWeather(type, args) {
        return async (dispatch) => {
            dispatch({ 'type': TYPES.GET_WEATHER_DOING });
            let data;
            switch (type) {
                case 'gps':
                    data = await Service.getByGps(args.lat, args.lng);
                    break;
                case 'id':
                    data = await Service.getById(args);
                    break;
                case 'name':
                    data = await Service.getByName(args);
                    break;
            }
            if (data) {
                if (type == 'gps') {
                    data.showapi_res_body.fromGPS = true;
                }
                dispatch({ 'type': TYPES.GET_WEATHER_DONE, data: data.showapi_res_body });
                dispatch(CityAction.addCity(data.showapi_res_body, type == 'gps' ? true : false));
            }
        }
    }

    /**
     * 从本地读取城市数据显示
     * 
     * @static
     * @param {string} id
     * @returns
     * 
     * @memberOf Action
     */
    static showCity(id) {
        return async (dispatch) => {
            let list = await LocalService.getCities();
            dispatch({ 'type': TYPES.GET_WEATHER_DONE, data: list[id] });
            await LocalService.setCurCity(id);
        }
    }
    /**
     * 显示当前城市
     * 
     * @static
     * @returns
     * 
     * @memberOf Action
     */
    static showCurCity() {
        return async (dispatch) => {
            let city = await LocalService.getCurCity();
            if (city)
                dispatch({ 'type': TYPES.GET_WEATHER_DONE, data: city });
            else
                dispatch({ 'type': TYPES.GET_WEATHER_DONE, data: null });
        }
    }
}
