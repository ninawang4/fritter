import {HydratedDocument, Types} from 'mongoose';
import type {Freet} from '../freet/model';
import FreetModel from '../freet/model';
import UserCollection from '../user/collection';
import CommentModel from './model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class CommentSection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @param {Types.ObjectId} parentFreetId - The parent freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, parentFreetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const parentFreet = await FreetModel.findOne({_id: parentFreetId});
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date
    });
    const comment = new CommentModel({
        parentFreet: parentFreetId,
        content: freet
    })

    await comment.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

}

export default CommentSection;
