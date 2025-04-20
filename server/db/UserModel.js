import { MongoClient, ObjectId } from 'mongodb';
import db from './connect.js';

const users = db.collection('users');

class User {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this._id = data._id;
  }

  static async findOne(query) {
    const userData = await users.findOne(query);
    return userData ? new User(userData) : null;
  }

  async save() {
    if (this._id) {
      await users.updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { email: this.email, password: this.password } }
      );
    } else {
      const result = await users.insertOne({
        email: this.email,
        password: this.password,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      this._id = result.insertedId;
    }
    return this;
  }
}

export default User; 
