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

import TodosView from '../../views/todos'
import DailyPlanView from '../../views/dailyplan'
import StatsView from '../../views/stats'


export default class NavigatorComp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{name: 'todos', index: 0, id: 'todos'}}
          configureScene={this._configureScene}
          renderScene={this._renderScene}
        />
      </View>
    )
  }

  _renderScene(route, navigator) {
    switch (route.id) {
      case 'todos':
        return (
          <TodosView navigator={navigator} route={route}/>
        )
      case 'dailyPlan':
        return (
          <DailyPlanView navigator={navigator} route={route}/>
        )
      case 'stats':
        return (
          <StatsView navigator={navigator} route={route}/>
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
