/**
 * Created by kylechen on 17-5-31.
 */
import React, {
  Component
} from 'react'
import Icon from 'react-native-vector-icons/Ionicons';

import {
  StyleSheet,
  Text
} from 'react-native'

import TabNavigator from 'react-native-tab-navigator'

import Home from '../../views/home'
import Missions from '../../views/missions'
import Stats from '../../views/stats'
import Today from '../../views/today'


export default class TabBarComp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'home'
    }
  }

  render() {
    return (
      <TabNavigator hidesTabTouch={true} sceneStyle={styles.sceneStyle}>
        {this._renderTabItem('home', <Home navigator={this.props.navigator}/>)}
        {this._renderTabItem('today', <Today navigator={this.props.navigator}/>)}
        {this._renderTabItem('missions', <Missions navigator={this.props.navigator}/>)}
        {this._renderTabItem('stats', <Stats navigator={this.props.navigator}/>)}
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

  _renderTabItemIcon(tag, selected=false) {
    return (
      <Icon name="ios-person" size={30} color="#ff9630" />
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