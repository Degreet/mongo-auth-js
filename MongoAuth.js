const bcrypt = require("bcrypt")
const chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'

module.exports = class MongoAuth {
  constructor(usersCollection) {
    if (usersCollection && usersCollection.findOne) {
      this.usersCollection = usersCollection
    }
  }

  async reg(username, password, otherFields = {}) {
    const usersCollection = this.usersCollection

    if (usersCollection && usersCollection.findOne) {
      password = bcrypt.hashSync(password, 10)
      await usersCollection.insertOne({
        username,
        password,
        ...otherFields
      })

      return true
    }

    return false
  }

  async auth(username, password) {
    const usersCollection = this.usersCollection

    if (usersCollection && usersCollection.findOne) {
      const candidate = await usersCollection.findOne({ username })

      if (candidate) {
        const checkPasswords = bcrypt.compareSync(password, candidate.password)

        if (checkPasswords) {
          const token = generateToken()
          candidate.token = token

          usersCollection.updateOne({ username }, {
            $set: {
              token
            }
          })

          return candidate
        } else {
          return false
        }
      }

      return false
    }

    return false
  }

  async verify(token) {
    const usersCollection = this.usersCollection

    if (usersCollection && usersCollection.findOne) {
      const candidate = await usersCollection.findOne({ token })
      
      if (candidate) {
        return candidate
      } else {
        return false
      }
    }

    return false
  }
}

function generateToken() {
  let res = ''
  for (let i = 0; i < 32; i++) res += chars[Math.floor(Math.random() * chars.length)]
  return res
}