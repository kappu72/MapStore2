/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {connect} = require('react-redux');
const {compose} = require("recompose");

const {createSelector} = require('reselect');
const {selectedRules, filterSelector} = require('../selectors/rulesmanager');

const ContainerDimensions = require('react-container-dimensions').default;
const PropTypes = require('prop-types');
const {rulesSelected, setLoading, setFilter} = require("../actions/rulesmanager");
const {error} = require('../actions/notifications');

const ruelsSelector = createSelector([selectedRules, filterSelector], (rules, filters) => {
    return {
        selectedIds: rules.map(r => r.id),
        filters
}; });
const rulesGridEnhancer = compose(
    connect( ruelsSelector, {onSelect: rulesSelected, onLoadError: error, setLoading, setFilters: setFilter}),
    require('../components/manager/rulesmanager/rulesgrid/enhancers/rulesgrid'));

const RulesGrid = rulesGridEnhancer(require('../components/manager/rulesmanager/rulesgrid/RulesGrid'));

/**
  * @name RulesGrid
  * @memberof plugins
  * @class
  * @prop {boolean} cfg.virtualScroll default true. Activates virtualScroll. When false the grid uses normal pagination
  * @prop {number} cfg.maxStoredPages default 5. In virtual Scroll mode determines the size of the loaded pages cache
  * @prop {number} cfg.vsOverScan default 20. Number of rows to load above/below the visible slice of the grid
  * @prop {number} cfg.scrollDebounce default 50. milliseconds of debounce interval between two scroll event
  * @classdesc
  * Rules-grid it's part of rules-manager page. It loads goefence's rules from configured geofence instance.
  * It uses virtualScroll to manage rules loading. It allows to order geofence's rules by drag and drop.
  * Rules can be filtered selecting values form columns' header.
  * Prams geoFenceUrl and geoFenceGeoServerInstance have to be added to localConfig
  * It's also possible to configure the services used by the service and request
  * selectors. (see example).
  *
  * @example
  * // localConfig configuration example
  * "geoFenceUrl": "http://localhost:8081/",
  * "geoFenceGeoServerInstance": {
  *      "url": "geoserver/",
  *       "id" : 1
  *  }
  * "initialState": {
  *    "defaultState": {
  *       "rulesmanager": {
  *          "services": {
  *              "WFS": [
  *                 "DescribeFeatureType",
  *                   "GetCapabilities",
  *                   "GetFeature",
  *                   "GetFeatureWithLock",
  *                   "LockFeature",
  *                   "Transaction"
  *               ],
  *              "WMS": [
  *                   "DescribeLayer",
  *                   "GetCapabilities",
  *                   "GetFeatureInfo",
  *                   "GetLegendGraphic",
  *                   "GetMap",
  *                   "GetStyles"
  *               ]
  *           }
  *       }
  *     }
  *   },....
  * "plugins": {
  *  "rulesmanager": [{
  *           "name": "OmniBar",
  *           "cfg": {
  *               "containerPosition": "header",
  *               "className": "navbar shadow navbar-home"
  *           }
  *         }, {
  *           "name": "Home",
  *           "override": {
  *             "OmniBar": {
  *                 "position": 1,
  *                 "priority": 1
  *               }
  *             }
  *           },"Language", "Login", "Attribution", "RulesDataGrid", "Notifications", {
  *              "name": "RulesManagerFooter" , "cfg": { "containerPosition": "footer"} }]
  * }
*/

class RulesDataGridPlugin extends React.Component {
     static propTypes = {
         enabled: PropTypes.bool
     };
     static defaultProps = {
         enabled: true
     };
    render() {
        return (<ContainerDimensions>{({width, height}) =>
            (<div className="rules-data-gird">
                <RulesGrid width={width} height={height - 52}/>
            </div>)
        }
        </ContainerDimensions>);
    }
}

module.exports = {
    RulesDataGridPlugin,
    reducers: {rulesmanager: require('../reducers/rulesmanager')}
};
