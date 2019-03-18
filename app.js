const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const imdb = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';

const CONNECTION_URL = "mongodb+srv://Alex1730:saXU3W3yZzQDO4ST@cluster0-k7juy.gcp.mongodb.net/test?retryWrites=true"
const DATABASE_NAME = "Cluster0";

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
  extended: true
}));

var database, collection;

app.listen(9292, () => {
  MongoClient.connect(CONNECTION_URL, {
    useNewUrlParser: true
  }, (error, client) => {
    if (error) {
      throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection("people");
    console.log("Connected to " + DATABASE_NAME + "!");
  });
});

app.get("/movies/populate", async (request, response) => {
  const movies = await imdb(DENZEL_IMDB_ID);
  console.log(`${movies.length} movies found.`);
  collection.insertMany(movies, (error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result.result);
  });
});

app.get("/movies/search", (request, response) => {
  var metascore = request.query.metascore;
  var limit = request.query.limit;
  if (metascore == undefined) {
    metascore = 0;
  }
  if (limit == undefined) {
    limit = 5;
  }
  collection.aggregate([{
    $match: {
      metascore: {
        $gte: Number(metascore)
      }
    }
  }, {
    $sample: {
      size: Number(limit)
    }
  }, {
    $sort: {
      "metascore": -1
    }
  }]).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

app.get("/movies", (request, response) => {
  collection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

app.get("/movies/:id", (request, response) => {
  collection.findOne({
    "id": request.params.id
  }, (error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});


app.post("/movies/:id", (request, response) => {
  collection.updateOne({
    "id": request.params.id
  }, {
    $set: {
      "date": request.query.date,
      "review": request.query.review
    }
  }, (error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result.result);
  });
});
