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
import {ListView, Image, Tile, Title, Subtitle, Screen, Divider, Icon, Row} from '@shoutem/ui'

export default class Home extends Component{
  constructor(props) {
    super(props)
    this.state = {
      restaurants: [{
        "name": "Gaspar Brasserie",
        "address": "185 Sutter St, San Francisco, CA 94109",
        "image": { "url": "https://shoutem.github.io/restaurants/restaurant-1.jpg" },
      }, {
        "name": "Chalk Point Kitchen",
        "address": "527 Broome St, New York, NY 10013",
        "image": { "url": "https://shoutem.github.io/restaurants/restaurant-2.jpg" },
      }]
    }
    this._renderRow = this._renderRow.bind(this);
  }

  _renderRow(restaurant) {
    return (
      <View>
        <Row styleName="small">
          <Icon name="add-to-favorites-off" />
          <Text>{this.props.editMode ? '1' : '2'}</Text>
        </Row>
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Screen>
          <ListView
            data={this.state.restaurants}
            renderRow={this._renderRow}
          />
        </Screen>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
})
