import React, {
  Component
} from 'react'

import {
  StyleSheet
} from 'react-native'

import {ListView, View, Image, Caption, Tile, Title, Text, Subtitle, Button, Screen, Divider, Icon, Row} from '@shoutem/ui'
import RealmTasks from '../../realm/index';
import * as Progress from 'react-native-progress';
import config from '../../config/index'
import TimePicker from '../../components/timepicker/index'
import Time from 'react-native-gifted-chat/src/Time'

export default class Home extends Component{
  constructor(props) {
    super(props)

    this.todos = RealmTasks.realm.objects('Todo').sorted('percentage');
    this.todos.addListener((name, changes) => {
      console.log("changed: " + JSON.stringify(changes));
      this.forceUpdate();
    });
    console.log(this.todos);
    this.updateTime = this.updateTime.bind(this);
  }

  addNew() {
    console.log(this.todos);
    RealmTasks.realm.write(() => {
      RealmTasks.realm.create('Todo', {
        name: 'asdfasdf',
        needed: '1:00',
        spent: '0:30',
        color: 'red',
        percentage: 0.5
      });
    });
  }

  adjustTime(t, i) {
    //this.timePicker = new TimePicker;
    this.timePicker.show(t, this.updateTime.bind(undefined, i));
  }

  updateTime(i, time) {
    console.log("update" + i + time);
    RealmTasks.realm.write(() => {
      this.todos[i].needed = time;
    });
  }

  render() {
    let tmptodo = [];
    for(let i = 0; i < this.todos.length; i++)
      tmptodo.push(
        <Row key={i} styleName="small">
          {/*<Icon name="add-to-favorites-open"/>*/}
          <Progress.Pie style={styles.rowleft} progress={this.todos[i].percentage} size={20} color={config.blue}/>
          <Text>{this.todos[i].name}</Text>
          <Button title="adjusttime" styleName="disclosure" onPress={() => this.adjustTime(this.todos[i].needed, i)}>
            <Text>Time:{this.todos[i].needed}</Text>
            <View styleName="Vertical">
              <Icon name="up-arrow" />
              <Icon name="down-arrow" />
            </View>
          </Button>
      </Row>);
    console.log(tmptodo);
    return (
      <View>
        {tmptodo}
        <Button title="addnew" onPress={() => this.addNew()}>
          <Icon name="add-event" />
          <Text>ADD TO CALENDAR</Text>
        </Button>
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
