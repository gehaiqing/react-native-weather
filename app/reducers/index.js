/**
 * redux reducers 
 * collect all reducer
 * 整合所有的reducer
 */

import { combineReducers } from 'redux';
import weatherReducer from './weather';
import cityReducer from './city';

export default combineReducers({
    weatherStore: weatherReducer,
    cityStore: cityReducer
});