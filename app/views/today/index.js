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


export default class Today extends Component{
  constructor(props) {
    super(props)
    this.state = {
      editMode: false
    }
  }

  componentWillMount() {
    this.props.route.getEditMode = this._getEditMode.bind(this);
  }

  _getEditMode() {
    return this.state.editMode;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello!</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
})
