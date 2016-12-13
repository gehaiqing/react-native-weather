import React from 'react';

const crypto = require("crypto-js"); //使用scrypot-js进行HmacSHA256加密、BASE64加密。 npm install crypto-js --save
const uuid = require('node-uuid'); //生成随机字符串   npm install node-uuid --save
const ALICLOUD_KEY = '23541096';
const ALICLOUD_SECRET = 'eb1c4174d554af277b63c13d54f0cbfa';
const NET_ERROR = '网络异常';

/**
 * 天气数据服务
 * 
 * @export
 * @class WeatherService
 */
export default class WeatherService {
    /**
     * 根据path获取
     * 总的获取入口
     * @static
     * @param {string} path
     * @returns
     * 
     * @memberOf WeatherService
     */
    static getWeather(path) {
        let Accept = 'application/json';
        let ContentType = 'application/json';
        let Timestamp = Date.now();
        let Nonce = uuid.v4();
        let Headers =
            'X-Ca-Key' + ":" + ALICLOUD_KEY + "\n" +
            'X-Ca-Nonce' + ":" + Nonce + "\n" +
            'X-Ca-Request-Mode' + ":" + 'debug' + "\n" +
            'X-Ca-Stage' + ":" + 'RELEASE' + "\n" +
            'X-Ca-Timestamp' + ":" + Timestamp + "\n" +
            'X-Ca-Version' + ":" + '1' + "\n";

        let Url = 'http://weather.market.alicloudapi.com' + path;
        let stringToSign =
            'GET' + "\n" +
            Accept + "\n" +
            '' + "\n" +
            ContentType + "\n" +
            '' + "\n" +
            Headers +
            path; //此处为访问域名后面的字符串


        let sign = crypto.HmacSHA256(stringToSign, ALICLOUD_SECRET); //先进行HMAC SHA256加密。官方文档并无nodejs相关的说明，参照其他语言进行摸索
        sign = crypto.enc.Base64.stringify(sign); //将HMAC SHA256加密的原始二进制数据后进行Base64编码

        return new Promise((resolve, reject) => {
            fetch(Url, {
                method: 'GET',
                headers: {
                    'Accept': Accept,
                    'Content-Type': ContentType,
                    'X-Ca-Request-Mode': 'debug',
                    'X-Ca-Version': 1,
                    'X-Ca-Signature-Headers': 'X-Ca-Request-Mode,X-Ca-Version,X-Ca-Stage,X-Ca-Key,X-Ca-Timestamp,X-Ca-Nonce',
                    'X-Ca-Stage': 'RELEASE',
                    'X-Ca-Key': ALICLOUD_KEY,
                    'X-Ca-Timestamp': Timestamp,
                    'X-Ca-Nonce': Nonce,
                    'X-Ca-Signature': sign
                }
            }).then ((response) => { //response并不是单纯返回的JSON数据格式，使用使用response.json()处理
                if (response.status == 200)
                    response.json().then((data) => {
                        resolve(data);
                    })
                else {
                    // alert(JSON.stringify(response))
                }
            }).catch((err) => {
                // alert(JSON.stringify(err))
                reject(err.statusText)
            })
        });
    }
    /**
     * 根据GPS获取的经纬度获取
     * 
     * @static
     * @param {string} lat
     * @param {string} lng
     * @returns
     * 
     * @memberOf WeatherService
     */
    static async getByGps(lat, lng) {
        var path = '/gps-to-weather?from=1&lat=' + lat + '&lng=' + lng + '&need3HourForcast=1&needAlarm=1&needIndex=1&needMoreDay=1';
        return await this.getWeather(path);
    }
    /**
     * 根据城市名称获取
     * 
     * @static
     * @param {string} name
     * @returns
     * 
     * @memberOf WeatherService
     */
    static async getByName(name) {
        var path = '/area-to-weather?area=' + name + '&need3HourForcast=1&needAlarm=1&needIndex=1&needMoreDay=1';
        return await this.getWeather(path);
    }
    /**
     * 根据城市ID获取
     * 
     * @static
     * @param {string} id
     * @returns
     * 
     * @memberOf WeatherService
     */
    static async getById(id) {
        var path = '/area-to-weather?areaid=' + id + '&need3HourForcast=1&needAlarm=1&needIndex=1&needMoreDay=1';
        return await this.getWeather(path);
    }
    /**
     * 根据名称获取城市列表
     * 
     * @static
     * @param {string} name
     * @returns
     * 
     * @memberOf WeatherService
     */
    static async getIdListByName(name) {
        var path = '/area-to-id?area=' + name;
        return await this.getWeather(path);
    }
}