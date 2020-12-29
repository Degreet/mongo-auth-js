const MongoAuth = require("./MongoAuth.js")
const useMongo = require("./use-mongo.js")
const dotenv = require("dotenv")
dotenv.config()

const username = "Node"
const clusterName = "cluster0-ttfss"
const password = process.env.MONGO_KEY
const databaseName = "use-mongo-test"

useMongo(username, clusterName, password, databaseName).then(async getCollect => {
  const users = getCollect("users")
  const mongoAuth = new MongoAuth(users)

  async function reg() {
    const candidate = await mongoAuth.reg("username", "password", {
      age: 3
    })
  }

  async function auth() {
    const failTry = { login: "Jonh", password: "ewqde" }
    const successTry = { login: "username", password: "password" }

    const failCheck = await mongoAuth.auth(failTry.login, failTry.password)
    const successCheck = await mongoAuth.auth(successTry.login, successTry.password)

    if (successCheck) {
      const candidate = successCheck
      const token = candidate.token
    }
  }

  auth()
})