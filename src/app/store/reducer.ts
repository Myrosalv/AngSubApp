import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset, retrievedValueList } from './actions';

export const initialState = [];

const _Reducer = createReducer(
    initialState,
    on(increment, (state, payload) => {
        return [...state, payload.value]
    }),
    on(decrement, (state, payload) => state),
    on(reset, (state) => []),
);

export function Reducer(state, action) {
    return _Reducer(state, action);
}

