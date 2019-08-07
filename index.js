const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
var msgdata;

exports.offertrigger = functions.firestore.document('offers/{offerId}').onCreate((snapshot, context) => {
    msgdata = snapshot.data();

    admin.firestore().collection('pushtoken').get().then((snapshots) => {
        var tokens = [];
        if (snapshots.empty) {
            console.log('no devices');
        } else {
            for (var token of snapshots.docs) {
                tokens.push(token.data().devid);
            }
            const payload = {
                "notification": {
                    "title": msgdata.buisnessname,
                    "body": msgdata.offervalue,
                    "sound": "default",
                    
                },
                "data": {
                    "sendername": msgdata.buisnessname,
                    "message": msgdata.offervalue,
                    "icon": "https://www.google.com/search?rlz=1C1CHBF_enIN824IN824&tbm=isch&q=adidas+icon&chips=q:adidas+icon,g_1:black:0q2wlGh12ak%3D&usg=AI4_-kTtCvktyJoX7kT5z-EM_r2yDxasfA&sa=X&ved=0ahUKEwi7y--GoZfhAhVG7nMBHSPtCMwQ4lYILCgC&biw=1536&bih=722&dpr=1.25#imgrc=qdl1aJSwrdLk0M:",
                    "image": "https://www.google.com/search?rlz=1C1CHBF_enIN824IN824&biw=1536&bih=722&tbm=isch&sa=1&ei=qZ-VXKj_CpLez7sP1I2wgAQ&q=adidas+shoes+discount&oq=adidas+shoes+di&gs_l=img.1.0.0l2j0i8i30l8.150116.154586..156640...0.0..0.328.2400.0j4j5j2......1....1..gws-wiz-img.......0i67j0i10j35i39.kbz7RSvMLQQ#imgrc=B2iaEPncJ9RCcM:"
                }

            }
            return admin.messaging().sendToDevice(tokens, payload).then((response) => {
                console.log("pushed them all");
            }).catch((err) => {
                console.log("erroroccured" + err);
            })
        }
    })
})