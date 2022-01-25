import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ValueModel } from 'app/pages/model';

export const selectValues = createFeatureSelector<ReadonlyArray<ValueModel>>('values')

export const getAllValues = createSelector(
    selectValues,
    (values, collection) => {
        console.log('-----------------------------------------------------')
        console.log("values :>>", values)
        console.log("collection :>>", collection)
        console.log('-----------------------------------------------------')
        return values;
    }
);