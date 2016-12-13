/**
 * weahter reducers
 */

import * as TYPES from '../actions/types';

const initialState = {
    info: null,
};

export default function weather(state = initialState, action) {
    switch (action.type) {
        case TYPES.GET_WEATHER_DOING:
            return state;
        case TYPES.GET_WEATHER_DONE:
            return {
                info: action.data
            }
        
        default:
            return state;
    }

}