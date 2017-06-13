/**
 * Created by kylechen on 17-5-31.
 */
'use strict';

import Realm from 'realm';
import schemas from '../models';
import config from '../config';
import RealmTasks from '../realm/index'

let realm = null;

function getRealm(next, next2) {
  let user = Realm.Sync.User.current;
  if (!user) {
    connect('login', 'testuser', 'testuser', (error, newuser) => {
      console.warn('connected');
      user = newuser;
      RealmTasks.realm = new Realm({
        sync: {
          user: user,
          url: config.db_uri,
        },
        schema: schemas,
        path: config.db_path
      });
      console.log(error ? error.message : "New user Success");
      next();
      next2();
    });
    // connect('register', 'testuser', 'testuser', (error, newuser) => {
    //   connect('login', 'testuser', 'testuser', (error, newuser) => {
    //     console.warn('connected');
    //     user = newuser;
    //     RealmTasks.realm = new Realm({
    //       sync: {
    //         user: user,
    //         url: config.db_uri,
    //       },
    //       schema: schemas,
    //       path: config.db_path
    //     });
    //     console.log(error ? error.message : "New user Success");
    //     next();
    //     next2();
    //   });
    // });
  }
  else {
    RealmTasks.realm = new Realm({
      sync: {
        user: user,
        url: config.db_uri,
      },
      schema: schemas,
      path: config.db_path
    });
    next();
    next2();
  }
}


function connect (action, username, password, callback) {
  username = username.trim();
  password = password.trim();
  if(username === '') {
    return callback(new Error('Username cannot be empty'));
  } else if (password === '') {
    return callback(new Error('Password cannot be empty'));
  }

  Realm.Sync.User[action](config.auth_uri, username, password,
    (error, user) => {
      if (error) {
        console.warn(error);
      } else {
        return callback(null, user);
      }
    }
  );
}

export default {
  login: connect.bind(undefined, 'login'),
  register: connect.bind(undefined, 'register'),
  realm: realm,
  getRealm: getRealm
};