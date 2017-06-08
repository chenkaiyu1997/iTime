/**
 * Created by kylechen on 17-5-31.
 */
'use strict';

import Realm from 'realm';
import schemas from '../models';
import config from '../config';

let realm = null;

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
        realm = new Realm({
          schema: schemas,
          sync: {
            user,
            url: config.db_uri
          },
          path: config.db_path
        });
        return callback(null, realm);
      }
    }
  );
}

export default {
  login: connect.bind(undefined, 'login'),
  register: connect.bind(undefined, 'register'),
  realm
};