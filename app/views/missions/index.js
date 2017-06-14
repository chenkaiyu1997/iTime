import React, {
  Component
} from 'react'

import {
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native'

import {TextInput, View, ListView, Image, Caption, Tile, Title, Text, Subtitle, Button, Screen, Divider, Icon, Row, DropDownMenu} from '@shoutem/ui'
import RealmTasks from '../../realm/index';
import * as Progress from 'react-native-progress';
import config from '../../config/index'
import TimePicker from '../../components/timepicker/index'
import utils from '../../utils/index'
let moment = require('moment');


export default class Missions extends Component{
  constructor(props) {
    super(props)

    this.missions = RealmTasks.realm.objects('Mission').sorted('percentage');
    this.getTmpMissions();
    this.missions.addListener((name, changes) => {
      this.getTmpMissions();
      this.forceUpdate();
    });

    this.renderRow = this.renderRow.bind(this);
    this.deleteMission = this.deleteMission.bind(this);
    this.state = {
      editMode: false,
      text: ''
    }
  }

  getTmpMissions() {
    this.tmpMissions = [];
    this.maxid = 0;
    this.sum = 0;
    for (let i = 0; i < this.missions.length; i++) {
      this.tmpMissions.push(this.missions[i]);
      this.sum += this.missions[i].daily;
      this.maxid = Math.max(this.maxid, this.missions[i].id);
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
    if(state)
      this.addMission();
    setImmediate(() => this.setState({
      editMode: false
    }));
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


  deleteMission(i) {
    RealmTasks.realm.write(() => {
      RealmTasks.realm.delete(this.missions[i]);
    });
  }

  deleteAlert(i) {
    Alert.alert(
      'Are you sure',
      'This operation may not be recovered',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => setImmediate(() => this.deleteMission(i))},
      ],
      { cancelable: true }
    )
  }
  resetDate() {
    RealmTasks.realm.write(() => {
      for(let i = 0; i < this.missions.length; i++) {
        this.missions[i].date = moment().format('MM-DD-YYYY');
        this.missions[i].spent = 0;
        this.missions[i].needed = this.missions[i].daily * (moment().diff(moment(this.missions[i].date, 'MM-DD-YYYY'), 'days') + 1);
        this.missions[i].percentage = this.missions[i].needed === 0 ? 0 : this.missions[i].spent / this.missions[i].needed;
      }
      this.missions.date = moment().format('MM-DD-YYYY');
    })
  }
  resetDateAlert() {
    Alert.alert(
      'Are you sure',
      'This operation may not be recovered',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => setImmediate(() => this.resetDate())},
      ],
      { cancelable: true }
    )
  }

  renderRow(mission,sectionId,i){
    return (
      <View>
        <Row styleName="small">

          <Progress.Pie style={styles.rowleft} progress={mission.percentage} size={20} color={config.blue}/>

          <Text>{mission.name}</Text>


          <Button title="adjusttime" styleName="disclosure" onPress={() => this.handlePress(i)}>
            <Text>{utils.m2s(mission.daily)}</Text>
          </Button>


          <Button title="adjusttime" styleName="disclosure" onPress={() => this.handlePress(i)}>
            <Text>{utils.m2s(mission.spent - mission.needed)}</Text>
          </Button>

          <Button title="adjusttime" styleName="disclosure" onPress={() => this.handlePress(i)}>
            <Icon name="search"/>
          </Button>

          <Icon styleName="disclosure" name="close" onPress={() => this.deleteAlert(i)}/>


        </Row>
        <Divider styleName="line"/>
      </View>)
  }
  renderFooter() {
    console.warn(this.state.editMode)
    if(this.state.editMode === true)
      return(
        <TextInput
          ref="textinput"
          placeholder={'input name'}
          onChangeText={(text) => this.onTextChange(text)}
          onEndEditing={() => this.finishName(true)}
          onBlur={() => this.finishName(false)}
          onSubmitEditing={() => this.finishName(true)}
        />);
    return (
      <Button onPress={() => this.addSimpleMission()}>
        <Icon name = "add-event"/>
        <Text>Add simple mission</Text>
      </Button>
    );
  }

  render() {
    return (
      <ScrollView>
        <ListView
          data={this.tmpMissions}
          key={this.state.editMode}
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
          <Button onPress={() => this.addSimpleMission()}>
            <Icon name = "add-event"/>
            <Text>Add simple mission</Text>
          </Button>}
        <Button onPress={() => this.resetDateAlert()}>
          <Icon name = "refresh"/>
          <Text>Reset start to today</Text>
        </Button>
        <Button>
          <Icon name = "checkbox-on"/>
          <Text>{'Daily: ' + utils.m2s(this.sum)}</Text>
        </Button>
        <TimePicker ref={(ref) => this.timePicker = ref}/>
      </ScrollView>
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
