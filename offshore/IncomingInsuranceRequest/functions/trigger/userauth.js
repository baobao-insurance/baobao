const functions = require("firebase-functions");
const admin = require("firebase-admin");
/**
 * functions.auth.user().onCreate is triggered when
 * 1. register via email/password
 * 2. first logIn via 3rd party auth providers (Facebook, Google, etc)
 * 3. developer creates new account via Firebase Admin SDK
 * 4. first logIn as anonymousUser
 *
 * What this functions doses is that when onCreate method is triggered,
 * we create `newUser` with necessary information including uid or displayName from given user
 * And then save it in our database
 */
module.exports.onUserCreate = functions.auth.user().onCreate(user => {
  const dayInMs = 24 * 60 * 60 * 1000;

  // Think of this as user of simple game app
  // you have daily goals(quests) and you earn points by finishing them
  const newUser = {
    user,
    points: 0,
    questType: "kill_monster",
    questGoal: 30,
    questActual: 10,
    // valid for next 24 hours
    questValidUntil: Date.now() + dayInMs
  };

  return admin
    .database()
    .ref(`/users/${user.uid}`)
    .set(newUser);
});
