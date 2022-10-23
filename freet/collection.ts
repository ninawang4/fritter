import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
// import CommentModel from '../comment/model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @param {date} scheduled - the time the tweet is scheduled to be posted (if any)
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, scheduled: Date): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    let newscheduled = scheduled;
    if (!scheduled.valueOf()) {
      newscheduled = new Date();
    }
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      scheduledTime: newscheduled,
      content,
      dateModified: date
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('authorId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    const date = new Date();
    let freets = FreetModel.find({scheduledTime : {$lte : date} }).sort({dateModified: -1}).populate('authorId');
    
    return freets;
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    const date = new Date();
    return FreetModel.find({
      authorId: author._id,
      scheduledTime : {$lte : date}
    }).populate('authorId');
  }

    /**
   * Get all the freets by authors that user follows
   *
   * @param {[string]} usernames - The array of usernames that a user follows
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets in the home page
   */
     static async findHomeFreets(usernames: [String]): Promise<Array<HydratedDocument<Freet>>> {
      const date = new Date();
      let userIds = [];
      for (let user of usernames) {
        
        let author = await UserCollection.findOneByUsername(user.toString());
        userIds.push(author._id);
      }

      let freets = await FreetModel.find({
        authorId : {$in : userIds},
        scheduledTime : {$lte : date}
      }).populate('authorId');

      return freets;
    }

    /**
   * Get all the freets by order of engagement
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets in the home page
   */
     static async findTrendingFreets(): Promise<Array<HydratedDocument<Freet>>> {
      const date = new Date();
      const freets = await FreetModel.find({scheduledTime : {$lte : date}}).sort({engagement: -1}).populate('authorId');
      return freets;
    }


  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.content = content;
    freet.dateModified = new Date();
    await freet.save();
    return freet.populate('authorId');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }


/**
   * Upvote a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to upvote
   * @param {Types.ObjectId | string} upvoterId - The id of the upvoter
   * @return {Promise<HydratedDocument<Freet>>} - true if the freet has been upvoted, false otherwise
   */
 static async upvoteOne(freetId: Types.ObjectId | string, upvoterId:  Types.ObjectId | string): Promise<boolean> {
  const freet = await FreetModel.findOne({_id: freetId});
  freet.upvoters.push(upvoterId);
  await FreetModel.findOneAndUpdate({_id: freetId}, {
    $inc : {upvotes : 1, engagement : 1}
  });
  await freet.save();
  return freet.populate('authorId');
  }

  /**
   * Upvote a freet with given freetId.
   *
   * @param {string} commenterId - The userId of the commenter
   * @param {string} content - The content of the comment
   * @param {Types.ObjectId | string} freetId - The id of the freet being commented on
   * @return {Promise<HydratedDocument<Freet>>} - true if the freet has been upvoted, false otherwise
   */
  static async addComment(commenterId: Types.ObjectId | string, content: string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const parentFreet = await FreetModel.findOne({_id: freetId});
    const date = new Date();
    const comment = ({
      commenterId,
      content,
      dateCreated: date,
    });
    parentFreet.comment.push(comment);
    parentFreet.engagement = parentFreet.engagement.valueOf() + 1;
    // FreetModel.findOneAndUpdate({_id: freetId}, {$inc : {engagement : 1}});
    await parentFreet.save();
    return parentFreet.populate('authorId');
  }
}


export default FreetCollection;
