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

import Login from '../../views/login'
import Missiondetail from '../../views/missiondetail'
import Settings from '../../views/settings'
import Records from '../../views/records'
import Index from '../../views/index'
import RealmTasks from '../../realm/index'

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

  componentDidMount() {
    RealmTasks.login(
      '123',
      '123',
      (error, realm) => {
        RealmTasks.realm = realm;
        console.log(error ? error.message : "Success");
      }
    );
  }

  _renderScene(route, navigator) {
    switch (route.id) {
      case 'index':
        return (
          <Index navigator={navigator} route={route}/>
        )
      case 'login':
        return (
          <Login navigator={navigator} route={route}/>
        )
      case 'missiondetail':
        return (
          <Missiondetail navigator={navigator} route={route}/>
        )

      case 'records':
        return (
          <Records navigator={navigator} route={route}/>
        )
      case 'settings':
        return (
          <Settings navigator={navigator} route={route}/>
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
