import express, { Application } from 'express';
import cors from 'cors';

const app: Application = express();
const PORT = process.env.EXPRESS_PORT || 3000;
const VERSION = process.env.VERSION || "dev-0";

let awsVotes = 0;
let gcpVotes = 0;
let azureVotes = 0;

app.use(cors()); 
app.disable('etag');
app.use(express.json());

app.get('/', (req, res) => {
  res.send({
    version: VERSION,
  });
});

app.post("/aws", (req, res) => {
  awsVotes += 1;
  res.send({
    message: `AWS got one point. Total : ${awsVotes}`,
  });
});

app.post("/gcp", (req, res) => {
    gcpVotes += 1;
    res.send({
      message: `GCP got one point. Total : ${gcpVotes}`,
    });
  });

  app.post("/azure", (req, res) => {
    azureVotes += 1;
    res.send({
      message: `Azure got one point. Total : ${azureVotes}`,
    });
  });

  app.get("/score", (req, res) => {
    res.send({
      aws: `${awsVotes}`,
      gcp: `${gcpVotes}`,
      azure: `${azureVotes}`,
    });
  });


app.listen(PORT, () => {
  console.log(`Server is running app version '${VERSION}' on port '${PORT}'`);
});