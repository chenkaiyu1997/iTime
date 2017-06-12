/**
 * Created by kylechen on 17-5-30.
 */
import React, {
  Component
} from 'react'

import {
  StyleSheet,
  Text
} from 'react-native'

import {
  View, Spinner
} from '@shoutem/ui'
import TabBarComp from '../../components/tabbar'
import NavbarComp from '../../components/navbar'
import RealmTasks from '../../realm/index'
import manager from '../../components/manager/index'

export default class Home extends Component{
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'home',
      hasRealm: false
    }
    RealmTasks.getRealm(manager.startup, () => {this.setState({
      hasRealm: true
    })});

    this._handleChangeSelectedTab = this._handleChangeSelectedTab.bind(this);
  }

  _handleChangeSelectedTab(selectedTab) {
    this.setState({
      selectedTab: selectedTab
    })
  }

  render() {
    return (
      <View>
        {this.state.hasRealm ?
          <View>
            <NavbarComp route={this.props.route} navigator={this.props.navigator} {...this.state}
                    onChangeSelectedTab={this._handleChangeSelectedTab}/>
            <TabBarComp route={this.props.route} navigator={this.props.navigator} {...this.state} onChangeSelectedTab={this._handleChangeSelectedTab}/>
          </View>
          :
          <Spinner/>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
})
