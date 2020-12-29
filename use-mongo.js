module.exports = async function useMongo(username, cluster, password, databaseName) {
  const { MongoClient } = require('mongodb')
  const uri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${databaseName}?retryWrites=true&w=majority`
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  await client.connect()
  return name => client.db(databaseName).collection(name)
}