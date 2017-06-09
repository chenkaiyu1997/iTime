/**
 * Created by kylechen on 17-5-30.
 */
import React, {
  Component
} from 'react'

import {
  Navigator,
  Platform,
  View
} from 'react-native'

import Home from '../../views/home'
import Login from '../../views/login'
import Missiondetail from '../../views/missiondetail'
import Missions from '../../views/missions'
import Records from '../../views/records'
import Settings from '../../views/settings'
import Stats from '../../views/stats'
import Index from '../../views/index'
import Today from '../../views/today'


export default class NavigatorComp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{name: 'index', index: 0, id: 'index'}}
          configureScene={this._configureScene}
          renderScene={this._renderScene}
        />
      </View>
    )
  }

  _renderScene(route, navigator) {
    switch (route.id) {
      case 'index':
        return (
          <Index navigator={navigator} route={route}/>
        )
      case 'home':
        return (
          <Home navigator={navigator} route={route}/>
        )
      case 'login':
        return (
          <Login navigator={navigator} route={route}/>
        )
      case 'missiondetail':
        return (
          <Missiondetail navigator={navigator} route={route}/>
        )
      case 'missions':
        return (
          <Missions navigator={navigator} route={route}/>
        )
      case 'records':
        return (
          <Records navigator={navigator} route={route}/>
        )
      case 'settings':
        return (
          <Settings navigator={navigator} route={route}/>
        )
      case 'stats':
        return (
          <Stats navigator={navigator} route={route}/>
        )
      case 'today':
        return (
          <Today navigator={navigator} route={route}/>
        )
      default:
        break
    }
  }

  _configureScene(route, routeStack) {
    switch (route.id) {
      default:
        return Navigator.SceneConfigs.FloatFromRight
    }
  }
}

const styles = {
  container: {
    flexGrow: 1
  }
}
