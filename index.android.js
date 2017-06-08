import React, {
    Component,
    PropTypes
} from 'react'

import {
    AppRegistry,
    StyleSheet,
    View
} from 'react-native'

import NavigatorComp from './app/components/navigator'

AppRegistry.registerComponent('itime', () => NavigatorComp)
