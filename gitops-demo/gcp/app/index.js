const functions = require("@google-cloud/functions-framework");
const axios = require('axios');

const VOTE_SERVICE_URL = process.env.VOTE_SERVICE_URL;

functions.http("vote", (req, res) => {
    // res.set("Access-Control-Allow-Origin", "*")
    // res.set("Access-Control-Allow-Methods", "GET");

    // if (req.method === "OPTIONS") {
    //     res.status(204).send("");
    //     return;
    // }

    const timeStamp = Date.now();
    doCall(timeStamp);

    res.set("Content-Type", "application/json");
    res.status(201);
    res.send(
        JSON.stringify({
            voted: 'GCP',
            now: timeStamp,
        }),
    );
});

function doCall(timeStamp) {
    axios.post(VOTE_SERVICE_URL, {
        cloud: 'GCP',
        timeStamp: timeStamp
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}



