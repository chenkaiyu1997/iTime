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

import RealmTasks from '../../realm/';

export default class TodosView extends Component{
  constructor(props) {
    super(props)

    this.todos = RealmTasks.realm.objects('Todo').sorted('percentage');

    this.todoLists.addListener((name, changes) => {
      console.log("changed: " + JSON.stringify(changes));
      this.forceUpdate();
    });

    // Bind all the methods that we will be passing as props.
    this.renderScene = this.renderScene.bind(this);
    this._addNewTodoList = this._addNewTodoList.bind(this);
    this._onPressTodoList = this._onPressTodoList.bind(this);

    this.state = {};
  }

  componentWillMount() {
    if (Platform.OS == 'ios') {
      StatusBar.setBarStyle('light-content');
    }
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
