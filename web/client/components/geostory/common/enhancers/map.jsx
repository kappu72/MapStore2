/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import {withProps, compose, withHandlers, withStateHandlers, branch} from 'recompose';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import { find } from 'lodash';

import {createMapObject} from '../../../../utils/GeoStoryUtils';
import {resourcesSelector, getCurrentFocusedContentEl} from '../../../../selectors/geostory';


import Message from '../../../I18N/Message';
import withNodeSelection from '../../../widgets/builder/wizard/map/enhancers/handleNodeSelection';

import withConfirm from '../../../misc/toolbar/withConfirm';
import ToolbarButton from '../../../misc/toolbar/ToolbarButton';
const ResetButton = withConfirm(ToolbarButton);

/**
 * create a map property merging a resource map and a content map obj
 * resourceId a and map should be present in props
 */
export default compose(
    connect(createSelector(resourcesSelector, (resources) => ({ resources }))),
    withProps(
        ({ resources, resourceId, map = {}}) => {
            const cleanedMap = {...map, layers: (map.layers || []).map(l => l ? l : undefined)};
            const resource = find(resources, { id: resourceId }) || {};
            return { map: createMapObject(resource.data, cleanedMap) };
        }
    ));
/**
 * Adds resourceId and content map props needed to connect the mapEditor to the map.
 * Adds disableReset prop when map hasn't been modified
 */
export const withFocusedContentMap = compose(
    connect(createSelector(getCurrentFocusedContentEl, (focusedEl = {}) => ({focusedEl }))), // Map connection and update withFocusedMap
    withProps(
        ({ focusedEl: {resourceId, map} = {}}) => {
            return { map: map || {},  resourceId, disableReset: !map };
        }
    ));
/**
 * It Adjusts the path to update content map config obj
 */
export const handleMapUpdate = withHandlers({
    onChange: ({update, focusedContent = {}}) =>
        (path, value) => {
            update(focusedContent.path + `.${path}`, value, "merge");
        }});
/**
 * Handle edit map toggle and map rest.
 * Map reset restores the original resource map configuration by removing all content map configs
 */
export const handleToolbar = withHandlers({
    toggleEditing: ({editMap, update, focusedContent}) => () =>
        update(focusedContent.path + ".editMap", !editMap),
    onReset: ({update, focusedContent = {}}) => () =>
        update(focusedContent.path + `.map`, undefined)
});
/**
 * It adds toolbar button and handling of layer selection
 */
export const withToolbar = compose(
    withProps(({editMap, toggleEditing, disableReset, onReset}) => ({
        buttons: [{
            glyph: "1-map",
            visible: true,
            bsStyle: editMap ? "success" : "primary",
            tooltipId: "geostory.contentToolbar.editMap",
            onClick: toggleEditing
        }, {
            Element: () => (<ResetButton
                glyph="1-close"
                visible
                bsStyle= "primary"
                className="square-button-md no-border"
                tooltipId="geostory.contentToolbar.resetMap"
                confirmTitle={<Message msgId="geostory.contentToolbar.resetMapConfirm" />}
                disabled= {disableReset}
                confirmContent={<Message msgId="geostory.contentToolbar.resetConfirmContent" />}
                onClick={onReset} />)
        }]
    })),
    withNodeSelection,      // Node selection
    withStateHandlers(() => ({'editNode': undefined}), { // Node enable editing
        setEditNode: () => node => ({'editNode': node}),
        closeNodeEditor: () => () => ({'editNode': undefined})
    }),
    branch( // Setting node buttons
        ({editNode}) => !!editNode,
        withProps(({ selectedNodes = [], closeNodeEditor = () => {}}) => ({
            buttons: [{
                visible: selectedNodes.length === 1,
                tooltipId: "close",
                glyph: "1-close",
                onClick: closeNodeEditor
            }]
        })),
        withProps(({ selectedNodes = [], setEditNode = () => { }, buttons = [] }) => ({
            buttons: [{
                visible: selectedNodes.length === 1,
                glyph: "wrench",
                tooltipId: "toc.toolLayerSettingsTooltip",
                onClick: () => {setEditNode(selectedNodes[0]);}
            }, ...buttons]
        }))));
