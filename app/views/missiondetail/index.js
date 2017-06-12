/**
 * Created by kylechen on 17-5-30.
 */
import React, {
  Component
} from 'react'

import {
  StyleSheet
} from 'react-native'

import {View, ListView, Image, Caption, Tile, Title, Text, Subtitle, Button, Screen, Divider, Icon, Row, DropDownMenu} from '@shoutem/ui'
import RealmTasks from '../../realm/index';
import * as Progress from 'react-native-progress';
import config from '../../config/index'
import DatePicker from '../../components/datepicker/index'
import utils from '../../utils/index'
import NavbarComp from '../../components/navbar'
import TimePicker from '../../components/timepicker/index'


export default class Missiondetail extends Component{
  constructor(props) {
    super(props)

    this.id = this.props.missionid;
    this.mission = RealmTasks.realm.objects('Mission').filtered('id = ' + this.id);
    if(mission.length === 0)
      console.error("no mission found!");
    this.mission = this.mission[0];

    this.mission.addListener((name, changes) => {
      this.forceUpdate();
    });

    this.state = {
      name: '',
      daily: 1,
      spent: 0,
      date: '',
      needed: 1,
      deadline: ''
    };

    this.renderitem = this.renderitem.bind(this);
  }
  onChangeText(part, text) {
    this.setState((prev) => {
      prev[text] = text;
      return prev;
    })
  }
  onSubmit(part) {
    RealmTasks.realm.write(() => {
      this.mission[part] = this.state[part];
    });
  }
  renderitem(part, keyboard='default') {
    return (
      <View>
        <Divider styleName="section-header">
          <Caption>
            {part}
          </Caption>
        </Divider>
        <TextInput
        placeholder={part}
        value={this.state[part]}
        onChangeText={(text) => this.onTextChange(part, text)}
        onEndEditing={() => this.onSubmit(part, true)}
        onBlur={() => this.onSubmit(part, false)}
        onSubmitEditing={() => this.onSubmit(part, true)}
        keyboardType={keyboard}
        />
      </View>
    )
  }
  showPicker(part) {
    this.datePicker.show(t, this.updateDate.bind(undefined, part, type));
  }
  updateDate(part, time) {
    RealmTasks.realm.write(() => {
      this.mission[part] = time;
      this.needed = this.mission.daily * moment().diff(moment(time), 'days') + 1;
      this.percentage = this.needed === 0 ? 0 : this.spent / this.needed;
    });
  }

  render() {
    return (
      <View>
        <NavbarComp route={this.props.route} navigator={this.props.navigator}/>

        {this.renderitem('name')}
        {this.renderitem('daily', 'numeric')}
        {this.renderitem('spent', 'numeric')}

        <Row onPress={() => this.showPicker('date')}>
          <Text>{this.mission.date}</Text>
          <Icon name="add-create"/>
        </Row>
        <DatePicker ref={(ref) => this.datePicker = ref}/>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  }
})
