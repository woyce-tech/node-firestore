const admin = require('firebase-admin');

// eslint-disable-next-line
const { config } = require('/tmp/config');

// Define path to secret key generated for service account
const serviceAccount = config.realtimeFirebase;
// Initialize the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const dbFirestore = admin.firestore();

exports.callFirestore = async (sendData, time) => {
  try {
    const { action_id: actionId, pod_id: podID } = sendData.Item;
    const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    let timeStamp = today.getTime();
    if (time === 'hour') {
      timeStamp = today.getTime() - (1000 * 60 * 60);
    } else if (time === 'day') {
      timeStamp = today.getTime() - (1000 * 60 * 60 * 24);
    } else if (time === 'week') {
      timeStamp = today.getTime() - (1000 * 60 * 60 * 24 * 7);
    } else if (time === 'month') {
      timeStamp = today.getTime() - (1000 * 60 * 60 * 24 * 30);
    }
    try {
        // update document in all collection
        await dbFirestore.collection(`${time}_pod`).doc(podID).update({ [actionId]: dynamoDBCountPOD });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        if (error.code === 5) {
          // set document in all collection
          await dbFirestore.collection(`${time}_pod`).doc(podID).set({
            [actionId]: dynamoDBCountPOD,
            status: true,
          });
        }
      }
    return {
      status: true,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.message);
    return {
      status: false,
    };
  }
};

exports.firestorePODUpdate = async (sendData) => {
  try {
    const { pod_id: podID, action_id: actionId } = sendData.Item;
    try {
      // update document in staff collection
      await dbFirestore.collection('hour_pod').doc(podID).update({
        status: userStatus,
      });
      await dbFirestore.collection('day_pod').doc(podID).update({
        status: userStatus,
      });
      await dbFirestore.collection('week_pod').doc(podID).update({
        status: userStatus,
      });
      await dbFirestore.collection('month_pod').doc(podID).update({
        status: userStatus,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('update firestorePODUpdate error', error);
    }
    return {
      status: true,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.message);
    return {
      status: false,
    };
  }
};
