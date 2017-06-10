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
import I18n from '../../i18n/i18n'

export default class TabBarComp extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
        title={I18n.t(tag)}
        titleStyle={styles.titleStyle}
        selectedTitleStyle={styles.selectedTitleStyle}
        renderIcon={() => this._renderTabItemIcon(tag)}
        renderSelectedIcon={() => this._renderTabItemIcon(tag, true)}
        selected={this.props.selectedTab === tag}
        onPress={() => this.props.onChangeSelectedTab(tag)}
      >
        {childView}
      </TabNavigator.Item>
    )
  }

  _renderTabItemIcon(tag, selected=false) {
    const names = {
      'home': 'md-checkbox-outline',
      'today': 'md-list',
      'missions': 'md-filing',
      'stats': 'md-ribbon'
    }
    return (
      <Icon name={names[tag]} size={25} color={selected ? '#39A9FF' : '#929292'}/>
    )
  }
}

const styles = StyleSheet.create({
  sceneStyle: {
    backgroundColor: '#efeff4'
  },
  titleStyle: {
    color: '#929292',
    fontSize: 14,
    marginTop: -2
  },
  selectedTitleStyle: {
    color: '#39A9FF'
  },
  tabIcon: {
    fontSize: 28,
    color: '#929292',
    fontFamily: 'iconfont'
  },
  selectedTabIcon: {
    color: '#39A9FF'
  }
})