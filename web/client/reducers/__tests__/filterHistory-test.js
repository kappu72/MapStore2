/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const expect = require('expect');

const { APPLIED_FILTER, STORE_CURRENT_APPLIED_FILTER, INIT_FILTER_HISTORY, RESTORE_CURRENT_SAVED_FILTER} = require("../../actions/filterHistory");
const { QUERY_FORM_RESET} = require('../../actions/queryform');
const filterHistory = require('../filterHistory');

describe('Test the filterHistory reducer', () => {
    it('init filter history', () => {
        const filter = {};
        const state = filterHistory(undefined, {
            type: INIT_FILTER_HISTORY,
            filter
        });
        expect(state.persisted).toExist();
        expect(state.applied).toExist();
        expect(state.persisted).toBe(filter);
        expect(state.applied).toBe(filter);
    });
    it('restore saved filter', () => {
        const filterA = { id: 1};
        const filterB = {id: 2}
        const state = filterHistory({persisted: filterA, applied: filterB}, {
            type: RESTORE_CURRENT_SAVED_FILTER
        });
        expect(state.persisted).toExist();
        expect(state.applied).toExist();
        expect(state.persisted).toBe(filterA);
        expect(state.applied).toBe(filterA);
        expect(state.applied === state.persisted).toBeTruthy();
    });
    it('applied filter', () => {
        const filterA = { id: 1};
        const filter = {id: 2};
        const state = filterHistory({persisted: filterA, applied: filterA}, {
            type: APPLIED_FILTER,
            filter
        });
        expect(state.persisted).toExist();
        expect(state.applied).toExist();
        expect(state.persisted).toBe(filterA);
        expect(state.applied).toBe(filter);
        expect(state.applied !== state.persisted).toBeTruthy();
    });
    it('save current applied filter', () => {
        const filterA = { id: 1};
        const filterB = {id: 2}
        const state = filterHistory({persisted: filterA, applied: filterB}, {
            type: STORE_CURRENT_APPLIED_FILTER
        });
        expect(state.persisted).toExist();
        expect(state.applied).toExist();
        expect(state.persisted).toBe(filterB);
        expect(state.applied).toBe(filterB);
        expect(state.applied === state.persisted).toBeTruthy();
    });
    it('clean state on query_form_reset', () => {
        const filterA = { id: 1};
        const filterB = {id: 2}
        const state = filterHistory({persisted: filterA, applied: filterB}, {
            type: QUERY_FORM_RESET
        });
        expect(state.persisted).toNotExist();
        expect(state.applied).toNotExist();
    });
});
