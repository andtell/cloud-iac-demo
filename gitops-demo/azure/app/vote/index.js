const axios = require('axios');

const VOTE_SERVICE_URL = process.env.VOTE_SERVICE_URL;

module.exports = async function (context, req) {

    // const headers = {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "GET",
    // };

    
    // if (req.method === "OPTIONS") {
    //     context.res = {
    //         headers,
    //         body: "",
    //         status: 204,
    //     };

    //     return;
    // } 
    

    const timeStamp = Date.now();
    doCall(timeStamp);

    context.res = {
        status: 201,
        body: JSON.stringify({
            voted: 'Azure',
            now: timeStamp
        }),
    };
};

function doCall(timeStamp) {
    axios.post(VOTE_SERVICE_URL, {
        cloud: 'Azure',
        timeStamp: timeStamp
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}
