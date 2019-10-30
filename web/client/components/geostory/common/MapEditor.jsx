/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import {compose, branch, withProps, defaultProps} from 'recompose';

import { Modes} from '../../../utils/GeoStoryUtils';


import connectMap, {withFocusedContentMap,
    handleMapUpdate,
    handleToolbar,
    withToolbar} from './enhancers/map';

import localizeStringMap from '../../misc/enhancers/localizeStringMap';


import BorderLayout from '../../layout/BorderLayout';
import TOC from '../../widgets/builder/wizard/map/TOC';
import NodeEditor from '../../widgets/builder/wizard/map/NodeEditor';
import StepHeader from '../../misc/wizard/StepHeader';

import nodeEditor from '../../widgets/builder/wizard/map/enhancers/nodeEditor';


import Toolbar from '../../misc/toolbar/Toolbar';

import Message from '../../I18N/Message';

const EditorTitle = compose(
    nodeEditor,
    withProps(({selectedNode: layer}) => ({
        title: layer && layer.title
    })),
    localizeStringMap('title')
)(StepHeader);

const Editor = nodeEditor(NodeEditor);


const MapEditor = ({
    mode = Modes.VIEW,
    isFocused = false,
    map = {},
    onChange = () => {},
    selectedNodes,
    onNodeSelect =  () => {},
    buttons = [],
    editNode,
    closeNodeEditor
}) => (mode === Modes.EDIT && isFocused ? <div
    key="left-column"
    style={{ order: -1, width: 400, position: 'relative' }}>
    <BorderLayout className="ms-geostory-map-editor"
        header={
            <div className="ms-geostory-map-editor-header text-center">
                <StepHeader title={<Message msgId={`geostory.mapEditor.configureMapOptions`} />}/>
                <Toolbar
                    btnGroupProps={{
                        className: "ms-geostory-map-editor-toolbar"
                    }}
                    btnDefaultProps={{
                        className: "square-button-md no-border",
                        bsStyle: "primary"
                    }}
                    buttons={buttons}/>
            </div>
        }>
        {!!editNode &&
            [<EditorTitle map={map} editNode={editNode} />, <Editor
                closeNodeEditor={closeNodeEditor}
                editNode={editNode}
                map={map}
                onChange={onChange}/>] ||
            [<StepHeader title={<Message msgId={`layers`} />} />, <TOC map={map} onChange={onChange} selectedNodes={selectedNodes} onSelect={onNodeSelect}/>]}
    </BorderLayout>

</div> : null);


export default branch(
    ({focusedContent: {path} = {}}) => path,
    compose(
        defaultProps({
            isFocused: true,
            editMap: true
        }),
        withFocusedContentMap,
        connectMap,
        handleMapUpdate,
        handleToolbar,
        withToolbar
    )
)(MapEditor);
