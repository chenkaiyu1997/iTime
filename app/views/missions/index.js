import React, {
  Component
} from 'react'

import {
  StyleSheet
} from 'react-native'

import {TextInput, View, ListView, Image, Caption, Tile, Title, Text, Subtitle, Button, Screen, Divider, Icon, Row, DropDownMenu} from '@shoutem/ui'
import RealmTasks from '../../realm/index';
import * as Progress from 'react-native-progress';
import config from '../../config/index'
import TimePicker from '../../components/timepicker/index'
import utils from '../../utils/index'

export default class Missions extends Component{
  constructor(props) {
    super(props)

    this.missions = RealmTasks.realm.objects('Mission');
    this.getTmpMissions();
    this.missions.addListener((name, changes) => {
      this.getTmpMissions();
      this.forceUpdate();
    });

    this.renderRow = this.renderRow.bind(this);
    this.state = {
      editMode: false,
      text: ''
    }
  }

  getTmpMissions() {
    this.tmpMissions = [];
    this.maxid = 0;
    for (let i = 0; i < this.missions.length; i++) {
      this.tmpMissions.push(this.missions[i]);
      this.maxid = max(this.maxid, this.missions[i].id);
    }
  }

  handlePress(i) {
    this.props.navigator.push({
      title: 'missiondetail',
      params: {
        missionid: this.missions[i].id
      },
      id: 'missiondetail'
    })
  }
  addSimpleMission() {
    this.setState({
      editMode: true
    });
  }
  onTextChange(text) {
    this.setState({
      text: text
    });
  }
  finishName(state) {
    this.setState({
      editMode: false
    });
    if(state)
      this.addMission();
  }

  addMission() {
    RealmTasks.realm.write(() => {
      RealmTasks.realm.create('Mission', {
        id: this.maxid + 1,
        name: this.state.text,
        date: moment().format('MM-DD-YYYY')
      });
    });
  }

  renderRow(mission,sectionId,i){
    return (
      <View>
        <Row styleName="small" onPress={() => this.handlePress(i)}>

          <Progress.Pie style={styles.rowleft} progress={mission.percentage} size={20} color={config.blue}/>

          <Text>{mission.name}</Text>

          <Icon styleName="disclosure" name="right-arrow"/>

        </Row>
        <Divider styleName="line"/>
      </View>)
  }

  render() {
    return (
      <View>
        <ListView
          data={this.tmpMissions}
          renderRow={this.renderRow}
        />
        {this.state.editMode ?
          <TextInput
            placeholder={'input name'}
            onChangeText={(text) => this.onTextChange(text)}
            onEndEditing={() => this.finishName(true)}
            onBlur={() => this.finishName(false)}
            onSubmitEditing={() => this.finishName(true)}
          />
          :
          <Button onPress={() => addSimpleMission()}>
            <Icon name = "add-event"/>
            <Text>Add simple mission</Text>
          </Button>
        }
        <TimePicker ref={(ref) => this.timePicker = ref}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  rowleft: {
    marginRight: 10
  },
  rowRight: {
    alignSelf: 'flex-end'
  }
})
