/**
 * Created by kylechen on 17-5-30.
 */
import React, {
  Component
} from 'react'

import {
  StyleSheet,
  Text,
  View
} from 'react-native'

import {
  Spinner
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

    this._handleChangeSelectedTab = this._handleChangeSelectedTab.bind(this);
  }

  componentDidMount() {
    RealmTasks.getRealm(manager.startup, () => {this.setState({
      hasRealm: true
    })});
  }

  _handleChangeSelectedTab(selectedTab) {
    this.setState({
      selectedTab: selectedTab
    })
  }

  render() {
    if(this.state.hasRealm) {
      return (
        <View style={styles.container}>
          <NavbarComp route={this.props.route} navigator={this.props.navigator} {...this.state}
                      onChangeSelectedTab={this._handleChangeSelectedTab}/>
          <TabBarComp route={this.props.route} navigator={this.props.navigator} {...this.state}
                      onChangeSelectedTab={this._handleChangeSelectedTab}/>
        </View>
      )
    }
    return (
      <View>
          <Spinner/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
})
