import { createAction, props } from '@ngrx/store';
import { ValueModel } from 'app/pages/model';

export const increment = createAction('[Counter Component] Increment',
    props<{ value: { e: string, p: number } }>());

export const decrement = createAction('[Counter Component] Decrement');
export const reset = createAction('[Counter Component] Reset');

export const retrievedValueList = createAction(
    '[Values Component] Retrieve Values Success',
    props<{ values: ReadonlyArray<ValueModel> }>()
);
