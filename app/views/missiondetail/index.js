/**
 * Created by kylechen on 17-5-30.
 */
import React, {
  Component
} from 'react'

import {
  StyleSheet
} from 'react-native'

import {View, TextInput, ListView, Image, Caption, Tile, Title, Text, Subtitle, Button, Screen, Divider, Icon, Row, DropDownMenu} from '@shoutem/ui'
import RealmTasks from '../../realm/index';
import * as Progress from 'react-native-progress';
import config from '../../config/index'
import DatePicker from '../../components/datepicker/index'
import utils from '../../utils/index'
import NavbarComp from '../../components/navbar'
import TimePicker from '../../components/timepicker/index'
let moment = require('moment');

export default class Missiondetail extends Component{
  constructor(props) {
    super(props);

    this.id = this.props.missionid;
    this.missions = RealmTasks.realm.objects('Mission').filtered('id = ' + this.id);
    if(this.missions.length === 0)
      console.error("no mission found!");
    this.mission = this.missions[0];

    this.missions.addListener((name, changes) => {
      this.forceUpdate();
    });

    this.state = {
      name: this.mission.name,
      daily: this.mission.daily,
      spent: 0,
      date: this.mission.date,
      needed: 1,
      deadline: ''
    };

    this.renderitem = this.renderitem.bind(this);
    this.updateDate = this.updateDate.bind(this);

  }
  onChangeText(part, text) {
    let tmp = {};
    tmp[part] = text;
    this.setState(tmp);
  }
  onSubmit(part, state, keyboard) {
    if(state === false)
      return;
    let tmp = this.state[part];
    if(keyboard === 'numeric')
      tmp = parseInt(tmp, 10);
    RealmTasks.realm.write(() => {
      this.mission[part] = tmp;
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
          value={'' + this.state[part]}
          placeholder={part}
          onChangeText={(text) => this.onChangeText(part, text)}
          onEndEditing={() => this.onSubmit(part, true, keyboard)}
          onBlur={() => this.onSubmit(part, false, keyboard)}
          onSubmitEditing={() => this.onSubmit(part, true, keyboard)}
          keyboardType={keyboard}
        />
      </View>
    )
  }
  showPicker(t, part) {
    this.datePicker.show(t, this.updateDate.bind(undefined, part));
  }
  updateDate(part, time) {
    RealmTasks.realm.write(() => {
      this.mission[part] = time;
      this.needed = this.mission.daily * moment().diff(moment(time, 'MM-DD-YYYY'), 'days') + 1;
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
        <Divider styleName="section-header">
          <Caption>
            {'Date'}
          </Caption>
        </Divider>
        <Row>
          <Text>{this.mission.date}</Text>
          <Icon name="add-event" onPress={() => this.showPicker(this.mission.date, 'date')}/>
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
