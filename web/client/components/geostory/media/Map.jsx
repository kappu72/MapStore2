/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { find } from 'lodash';
import { createSelector } from 'reselect';
import { connect } from "react-redux";
import { compose, withProps, branch, withHandlers} from 'recompose';
import uuid from "uuid";

import { resourcesSelector } from '../../../selectors/geostory';
import MapView from '../../widgets/widget/MapView'; // TODO: use a external component
import {createMapObject, applyDefaults } from '../../../utils/GeoStoryUtils';
import {defaultLayerMapPreview} from '../../../utils/MediaEditorUtils';

export default compose(
    branch(
        ({ resourceId }) => resourceId,
        compose(
            connect(createSelector(resourcesSelector, (resources) => ({ resources }))),
            withProps(
                ({ resources, resourceId, map = {}}) => {
                    const resource = find(resources, { id: resourceId }) || {};
                    return { map: createMapObject(resource.data, map) };
                }
            )
        )
    ),
    withHandlers({
        onMapViewChanges: ({ editMap = false, update = () => {}}) => ({center, zoom}) => {
            editMap && update("map", {
                center,
                zoom,
                mapStateSource: uuid()
            });
        }
    }),
)(({
    id,
    map = {layers: [defaultLayerMapPreview]},
    options = {},
    fit,
    onMapViewChanges
}) => {
    const { layers = [], mapOptions, ...m} = (map.data ? map.data : map); // remove mapOptions to not override options
    return (<div
        className="ms-media ms-media-map" style={{
            objectFit: fit
        }}>
        {/* BaseMap component overrides the MapView id with map's id */}
        <MapView
            onMapViewChanges={onMapViewChanges}
            map={{
                ...m,
                id: `media-${id}`
            }} // if map id is passed as number, the resource id, ol throws an error
            layers={layers}
            options={applyDefaults(options)}
        />
    </div>);
});
