'use strict';
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { createStore } = require('redux');

const ADD = n => ({
  type: 'ADD',
  n: n
});

const reducer = (state = 0, { type, n }) => {
  switch (type) {
    case 'ADD':
      return state + n;
    default:
      return state;
  }
};

// get snapshot from table
// -> const snapshot = 0;
let store = createStore(reducer, 0);

module.exports.injest = (event, context, callback) => {
  const action = event;
  store.dispatch(action);

  // THIS COULD BE MIDDLEWARE BUT WE WILL DO IT HERE FOR SIMPLICITY
  // save action to ledger
  // ->
  const state = store.getState();
  // persist state to snapshot table
  // ->

  const response = {
    statusCode: 200,
    body: {
      state: state,
      input: event
    }
  };

  callback(null, response);
};

module.exports.query = (event, context, callback) => {
  const state = store.getState();

  const response = {
    statusCode: 200,
    body: {
      state: state
    }
  };

  callback(null, response);
};
