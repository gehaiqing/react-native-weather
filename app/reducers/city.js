/**
 * weahter reducers
 */

import * as TYPES from '../actions/types';

const initialState = {
    cityList: [],
};

export default function city(state = initialState, action) {
    switch (action.type) {
        case TYPES.GET_CITY_LIST_DONE:
            return {
                cityShowList: action.cityShowList,
                cityDataList: action.cityDataList
            }

        case TYPES.DELETE_CITY_DONE:
            return Object.assign({},
                state,
                {
                    deleting: false
                }
            )
        case TYPES.DELETE_CITY_DOING:
            return {
                deleting: true
            }
        case TYPES.GET_CITY_LIST_BY_NAME_DONE:
            return Object.assign({},
                state,
                { searchResultList: action.data }
            )
        default:
            return state;
    }

}