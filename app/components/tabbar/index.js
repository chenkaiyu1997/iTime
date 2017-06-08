/**
 * Created by kylechen on 17-5-31.
 */
import React, {
  Component
} from 'react'

import {
  StyleSheet,
  Text
} from 'react-native'

import TabNavigator from 'react-native-tab-navigator'

import TodosView from '../../views/todos'
import DailyPlanView from '../../views/dailyplan'
import StatsView from '../../views/stats'


export default class TabBarComp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'todos'
    }
  }

  render() {
    return (
      <TabNavigator hidesTabTouch={true} sceneStyle={styles.sceneStyle}>
        {this._renderTabItem('todos', <TodosView navigator={this.props.navigator}/>)}
        {this._renderTabItem('dailyPlan', <DailyPlanView navigator={this.props.navigator}/>)}
        {this._renderTabItem('stats', <StatsView navigator={this.props.navigator}/>)}
      </TabNavigator>
    )
  }

  _renderTabItem(tag, childView) {
    return (
      <TabNavigator.Item
        title={tag}
        titleStyle={styles.titleStyle}
        selectedTitleStyle={styles.selectedTitleStyle}
        renderIcon={() => this._renderTabItemIcon(tag)}
        renderSelectedIcon={() => this._renderTabItemIcon(tag, true)}
        selected={this.state.selectedTab === tag}
        onPress={() => this.setState({ selectedTab: tag })}>
        {childView}
      </TabNavigator.Item>
    )
  }

  _renderTabItemIcon(tag, selected = false) {
    return (
      <Text style={[styles.tabIcon, selected ? styles.selectedTabIcon : {}]}></Text>
    )
  }
}

const styles = StyleSheet.create({
  sceneStyle: {
    ...styleUtils.containerBg
  },
  titleStyle: {
    color: '#929292',
    fontSize: 12,
    marginTop: -2
  },
  selectedTitleStyle: {
    color: '#ff9630'
  },
  tabIcon: {
    fontSize: 28,
    color: '#929292',
    fontFamily: 'iconfont'
  },
  selectedTabIcon: {
    color: '#ff9630'
  }
})