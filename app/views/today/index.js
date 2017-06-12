import React, {
  Component
} from 'react'

import {
  StyleSheet,
  ScrollView
} from 'react-native'

import {View, ListView, Image, Caption, Tile, Title, Text, Subtitle, Button, Screen, Divider, Icon, Row} from '@shoutem/ui'
import RealmTasks from '../../realm/index';
import * as Progress from 'react-native-progress';
import config from '../../config/index'
import TimePicker from '../../components/timepicker/index'
import utils from '../../utils/index'

export default class Today extends Component{
  constructor(props) {
    super(props)


    this.todos = RealmTasks.realm.objects('Todo').sorted('percentage', true);
    this.getTmpTodos();
    this.todos.addListener((name, changes) => {
      this.getTmpTodos();
      this.getTmpMissions();
      this.forceUpdate();
    });

    this.missions = RealmTasks.realm.objects('Mission');
    this.getTmpMissions();

    this.updateTime = this.updateTime.bind(this);
    this.renderTodoRow = this.renderTodoRow.bind(this);
    this.renderMissionRow = this.renderMissionRow.bind(this);

  }

  getTmpTodos() {
    this.tmpTodo = [];
    this.sum = 0;
    for (let i = 0; i < this.todos.length; i++) {
      this.tmpTodo.push(this.todos[i]);
      this.sum += this.todos[i].needed;
    }
  }

  getTmpMissions() {
    this.tmpMission = [];
    for (let i = 0; i < this.missions.length; i++) {
      if(this.todos.filtered('id = ' + this.missions[i].id).length === 0)
        this.tmpMission.push(this.missions[i]);
    }
  }


  adjustTime(t, i) {
    //this.timePicker = new TimePicker;
    this.timePicker.show(t, this.updateTime.bind(undefined, i));
  }

  deleteTodo(i) {
    RealmTasks.realm.write(() => {
      RealmTasks.realm.delete(this.todos[i]);
    });
  }

  addTodo(i) {
    let mission = this.tmpMission[i];
    RealmTasks.realm.write(() => {
      RealmTasks.realm.create('Todo', {
        id: mission.id,
        name: mission.name,
        needed: mission.daily || 0,
        spent: 0
      });
    });
  }

  updateTime(i, time) {
    RealmTasks.realm.write(() => {
      this.todos[i].needed = utils.s2m(time);
    });
  }

  renderMissionRow(mission, sectionId, i) {
    return (
      <View>
        <Row styleName="small">
          <Icon name="add-to-favorites-off"/>
          <Text>{mission.name}</Text>

          <Button title="delete" styleName="right-icon" onPress={() => this.addTodo(i)}>
            <Icon name="add-event" />
          </Button>
        </Row>
        <Divider styleName="line"/>
      </View>)
  }

  renderTodoRow(todo,sectionId,i){
    return (
      <View>
        <Row styleName="small">
         {/*<Icon name="add-to-favorites-on"/>*/}
        <Progress.Pie style={styles.rowleft} progress={todo.percentage} size={20} color={config.blue}/>
        <Text>{todo.name}</Text>

        <Button title="adjusttime" styleName="disclosure" onPress={() => this.adjustTime(utils.m2s(todo.needed), i)}>
          <Text>Time:{utils.m2s(todo.needed)}</Text>
          <View styleName="Vertical">
            <Icon name="up-arrow" />
            <Icon name="down-arrow" />
          </View>
        </Button>

        <Button title="delete" styleName="right-icon" onPress={() => this.deleteTodo(i)}>
          <Icon name="close" />
        </Button>
        </Row>
        <Divider styleName="line"/>
      </View>)
  }

  render() {
    return (
      <ScrollView>
        <Divider styleName="section-header">
          <Caption>Todo list</Caption>
        </Divider>
        <ListView
          data={this.tmpTodo}
          renderRow={this.renderTodoRow}
        />
        <Divider styleName="section-header">
          <Caption>Missions</Caption>
        </Divider>
        <ListView
          data={this.tmpMission}
          renderRow={this.renderMissionRow}
        />
        <Button>
          <Icon name = "checkbox-on"/>
          <Text>{utils.m2s(this.sum)}</Text>
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
