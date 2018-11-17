const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const databaseRef = admin.firestore();

exports.getDevices = functions.https.onRequest((req, res) => {
   if(req.method !== 'GET') {
       return res.status(203).json({
           message: "Bad request: GET Required"
       })
   }

   let devices = [];

   databaseRef.collection("Houses").doc("Lab5House").collection("Devices").get()
       .then(snapshot => {
           if (snapshot.exists) {
               snapshot.forEach(doc => {
                   devices.push(doc.data())
               });
               return res.status(200).json(devices)
           } else {
               return res.status(404).json({
                   message: "No devices"
               })
           }
       })
       .catch((error) => {
       return res.status(500).json({
           message: `Error: ${error}`
       })
   })
});

exports.device = functions.https.onRequest((req, res) => {
   const data = req.body;
   if(req.method === 'GET') {
       const device_type = req.query.device_type;
       databaseRef.collection("Houses").doc("Lab5House").collection("Devices").doc(device_type).get()
           .then(data => {
                if(!data.exists) {
                    return res.status(404).json({
                        message: "Device not found"
                    })
                } else {
                    return res.status(200).json(data.data())
                }
           })
           .catch((error) => {
               return res.status(500).json({
                   message: `Error: ${error}`
               })
           })
   }
   if(req.method === 'POST') {
       databaseRef.collection("Houses").doc("Lab5House").collection("Devices").doc(data.device_type).set({
           device_status: data.device_status
       }).then(() => {
           return res.status(200).json({
               message: "Device registered successfully!",
               device_type: data.device_type,
               device_status: data.device_status
           })
       }).catch((error) => {
           return res.status(500).json({
               message: `Error: ${error}`
           })
       })
   } else if (req.method === 'PUT') {
       databaseRef.collection("Houses").doc("Lab5House").collection("Devices").doc(data.device_type).update({
           device_status: data.device_status
       })
       .then(() => {
           return res.status(200).json({
               message: `Device toggled`,
               device_type: data.device_type,
               device_status: data.device_status
           })
       })
       .catch((error) => {
           return res.status(500).json({
               message: `Error: ${error}`
           })
       })
    }
});

exports.house = functions.https.onRequest((req, res) => {
    const data = req.body;
    if(req.method === 'GET') {
        databaseRef.collection("Houses").doc("Lab5House").get()
            .then(house => {
                if(!house.exists) {
                    return res.status(404).json({
                        message: "House doesn't exist."
                    })
                } else {
                    return res.status(200).json(house.data())
                }
            })
            .catch((error) => {
                return res.status(500).json({
                    message: `Error: ${error}`
                })
            })
    }
    if (req.method === 'POST') {
        databaseRef.collection("Houses").doc("Lab5House").set({
            house_name: data.house_name,
        })
        .then(() => {
            return res.status(200).json({
                message: `House registered: ${data.house_name}`,
            })
        })
        .catch((error) => {
            return res.status(500).json({
                message: `Error: ${error}`
            })
        })
    } else if (req.method === 'PUT') {
        databaseRef.collection("Houses").doc("Lab5House").update({
            house_name: data.house_name
        })
        .then(() => {
            return res.status(200).json({
                message: `House updated successfully.`,
                house_name: data.house_name
            })
        })
        .catch((error) => {
            return res.status(500).json({
                message: `Error: ${error}`
            })
        })
    }
});
