/**
 * Created by kylechen on 17-5-31.
 */
'use strict';

import Realm from 'realm';
import schemas from '../models';
import config from '../config';

let realm = null;

function getRealm() {
  return new Realm({
    schema: schemas
  });
  let user = Realm.Sync.User.current;
  if (!user) {
    connect('login', '123', '123', (error, newuser) => {
      user = newuser;
      console.log(error ? error.message : "New user Success");
    });
  }
  return new Realm({
    sync: {
      user: user,
      url: config.db_uri,
    },
    schema: schemas,
    path: config.db_path
  });
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
        return callback(new Error(error.message));
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