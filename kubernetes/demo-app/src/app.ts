import express, { Application } from "express";

const app: Application = express();
const PORT = process.env.EXPRESS_PORT || 3000;

let awsVotes = 0;
let gcpVotes = 0;
let azureVotes = 0;

app.get("/aws", async (_req, res) => {
  awsVotes += 1;
  res.send({
    message: `AWS got one point. Total : ${awsVotes}`,
  });
});

app.get("/gcp", async (_req, res) => {
    gcpVotes += 1;
    res.send({
      message: `GCP got one point. Total : ${gcpVotes}`,
    });
  });

  app.get("/azure", async (_req, res) => {
    azureVotes += 1;
    res.send({
      message: `Azure got one point. Total : ${azureVotes}`,
    });
  });

  app.get("/score", async (_req, res) => {
    res.send({
      aws: `${awsVotes}`,
      gcp: `${gcpVotes}`,
      azure: `${azureVotes}`,
    });
  });


app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});