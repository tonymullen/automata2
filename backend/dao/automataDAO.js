import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let automata;

export default class AutomataDAO {
  static async injectDB(conn) {
    if (automata) {
      return;
    }
    try {
      automata = await conn.db(
        process.env.AUTOMATA_COLLECTION)
        .collection('automatons');
    } catch (e) {
      console.error(`Unable to connect to automataDAO: ${e}`);
    }
  }

  static async getAutomata({
    filters = null,
    page = 0,
    automataPerPage = 20,
  } = {}) { // empty object as default value
    let query;
    if (filters) {
      if ('title' in filters) {
        query = { $text: { $search: filters['title'] } };
      } else if ('rated' in filters) {
        query = { 'rated': { $eq: filters['rated'] } };
      }
    }

    let cursor;
    try {
      cursor = await automata.find(query)
                           .limit(automataPerPage)
                           .skip(automataPerPage * page);
      const automataList = await cursor.toArray();
      const totalNumAutomata = await automata.countDocuments(query);
      return { automataList, totalNumAutomata };
    } catch (e) {
      console.error(`Unable to get automaton: ${e}`);
      return { automataList: [], totalNumAutomata: 0 };
    }
  }

  static async getAutomatonByID(id) {
    try {
      return await automata.aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          }
        },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'movie_id',
            as: 'reviews',
        }
      }
      ]).next();
    } catch (e) {
      console.error(`Unable to get automaton by ID: ${e}`);
      throw e;
    }
  }

  static async addAutomaton(user, automaton, date) {
    try {
      const automatonDoc = {
        name: user.name,
        user_id: user._id,
        date: date,
        automaton: automaton
      }
      return await automata.insertOne(automatonDoc);
    } catch(e) {
      console.error(`Unable to create automaton: ${e}`);
      return { error: e };
    }
  }

  static async updateAutomaton(automatonId, userId, automaton, date) {
    try {
      const updateResponse = await automata.updateOne(
        { user_id: userId, _id: new ObjectId(automatonId) },
        { $set: { automaton: automaton, date: date } }
      );
      return updateResponse;
    } catch(e) {
      console.error(`Unable to update automaton: ${e}`);
      return { error: e };
    }
  }

  static async deleteAutomaton(automatonId, userId) {
    try {
      const deleteResponse = await automata.deleteOne({
        _id: new ObjectId(automatonId),
        user_id: userId,
      });
      return deleteResponse;
    } catch(e) {
      console.error(`Unable to delete automaton: ${e}`);
      return { error: e };
    }
  }
}
