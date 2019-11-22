/* eslint-disable no-unused-vars */
/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import MapViewerContainer from '../../containers/MapViewer';
import PropTypes from 'prop-types';

import DefaultConfig  from './DefaultConfiguration';

import enhancer from './enhancers/editor';

import ResizableModal from '../../components/misc/ResizableModal';

import Portal from '../../components/misc/Portal';

import Message from '../../components/I18N/Message';

/**
 * Media Editor Modal. Contains the media picker
 * @param {object} props the properties
 * @param {boolean} props.open show/hide the modal
 * @param {function} props.hide handler for close
 * @param {object} props.map current edited map
 * @param {string} props.owner current owner of map editor
 */
const MapModal = ({ open = false, pluginsConfig = DefaultConfig, hide = () => {}, save = () => {}, map, owner} = {}, {plugins}) => {
    return (
        <Portal>
            <ResizableModal
                title={<Message msgId="mapEditor.modalTitle" />}
                show={open}
                clickOutEnabled={false}
                onClose={hide}
                size="lg"
                showFullscreen
                bodyClassName="map-editor-modal-body"
                initialFullscreenState="expanded"
                modalClassName="map-editor-modal"
                buttons={[
                    {
                        text: <Message msgId="cancel" />,
                        bsSize: 'sm',
                        onClick: hide
                    },
                    {
                        text: <Message msgId="ok" />,
                        bsSize: 'sm',
                        onClick: save
                    }
                ]}>
                <MapViewerContainer pluginsConfig={pluginsConfig} plugins={plugins}/>
            </ResizableModal>
        </Portal>
    );
};

MapModal.contextTypes = {
    plugins: PropTypes.object
};

export default enhancer(MapModal);
