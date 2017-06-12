/**
 * Created by kylechen on 17-6-12.
 */
/**
 * Created by kylechen on 17-5-30.
 */
import React, {
  Component
} from 'react'

import {
  StyleSheet,
  View,
  Text
} from 'react-native'

import TabBarComp from '../../components/tabbar'
import NavbarComp from '../../components/navbar'

export default class Home extends Component{
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>asdf</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
})