const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

module.exports = class MongoAuth {
	constructor(usersCollection) {
		if (usersCollection && usersCollection.findOne) {
			this.usersCollection = usersCollection;
		}
	}

	async findUser(fields) {
		const usersCollection = this.usersCollection;
		const candidate = await usersCollection.findOne(fields);

		if (candidate) return candidate;
		else return false;
	}

	async reg(username, password, otherFields = {}) {
		const usersCollection = this.usersCollection;

		if (usersCollection && usersCollection.findOne) {
			password = bcrypt.hashSync(password, 10);
			await usersCollection.insertOne({
				username,
				password,
				...otherFields,
			});

			return true;
		}

		return false;
	}

	async auth(username, password) {
		const usersCollection = this.usersCollection;

		if (usersCollection && usersCollection.findOne) {
			const candidate = await usersCollection.findOne({ username });

			if (candidate) {
				const checkPasswords = bcrypt.compareSync(password, candidate.password);

				if (checkPasswords) {
					const token = randomstring.generate();
					candidate.token = token;

					usersCollection.updateOne(
						{ username },
						{
							$set: {
								token,
							},
						}
					);

					return candidate;
				} else {
					return false;
				}
			}

			return false;
		}

		return false;
	}

	async verify(token) {
		const usersCollection = this.usersCollection;

		if (usersCollection && usersCollection.findOne) {
			const candidate = await usersCollection.findOne({ token });

			if (candidate) {
				return candidate;
			} else {
				return false;
			}
		}

		return false;
	}
};
