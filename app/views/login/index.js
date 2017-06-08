/**
 * Created by kylechen on 17-5-31.
 */

'use strict';

import React from 'react';
import { AsyncStorage, Text, TextInput, View, Button } from 'react-native';
import styles from '../../styles';
import Index from '../stats';
import config from '../../config';
import RealmTasks from '../../realm';

export default class LoginScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = { login: config.login, password: config.password, error: null };
    this.user = null;
  }

  login () {
    RealmTasks.login(
      this.state.login,
      this.state.password,
      (error, realm) => {
        RealmTasks.realm = realm;
        this.setState({
          error: error ? error.message : "Success"
        });
      }
    );
  }

  register () {
    RealmTasks.register(
      this.state.login,
      this.state.password,
      (error, realm) => {
        RealmTasks.realm = realm;
        this.setState({
          error: error ? error.message : "Success"
        });
      }
    );
  }

  render () {
    if (RealmTasks.realm) return <Index/>; // logged in already

    return (
      <View style={[styles.loginView]}>
        <View>
          <Text style={[styles.loginRow,styles.loginTitle]}>RealmTasks</Text>
        </View>
        <View>
          <TextInput style={[styles.loginRow,styles.loginInput1]}
                     value={this.state.login}
                     onChangeText={ login => this.setState({
                       login,
                       password: this.state.password,
                       error: null
                     }) }
                     editable = {true}
                     placeholder = "Username"
                     maxLength = {40}
          ></TextInput>
        </View>
        <View>
          <TextInput
            style={[styles.loginRow,styles.loginInput2]}
            value={this.state.password}
            onChangeText={ password => this.setState({
              login: this.state.login,
              password,
              error: null
            }) }
            editable = {true}
            placeholder = "Password"
            maxLength = {40}
          />
        </View>
        <View>
          <Text style={[styles.loginRow, styles.LoginGap]}></Text>
        </View>
        <View>
          <Button title="Log in" onPress={ this.login.bind(this) }/>
        </View>
        <View>
          <Text style={[styles.loginRow, styles.LoginGap]}></Text>
        </View>
        <View>
          <Button title="Register" onPress={ this.register.bind(this) } />
        </View>
        <View>
          <Text style={[styles.loginRow,styles.loginErrorLabel]}>{this.state.error}</Text>
        </View>
      </View>
    );
  }
};
