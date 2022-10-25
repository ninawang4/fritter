import type {HydratedDocument, Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import CommentModel from './model';

class CommentCollection {
/**
   * comment on a freet with given freetId.
   *
   * @param {string} commenterId - The userId of the commenter
   * @param {string} content - The content of the comment
   * @param {Types.ObjectId | string} freetId - The id of the freet being commented on
   * @return {Promise<HydratedDocument<Freet>>} - true if the freet has been upvoted, false otherwise
   */
 static async addComment(commenterId: Types.ObjectId | string, content: string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
    const parentFreet = await FreetCollection.findOne(freetId);
    const date = new Date();
    const comment = new CommentModel({
      commenterId,
      content,
      dateCreated: date,
    });
    await comment.save();
    const commentId = comment._id;
    parentFreet.comment.push(comment);
    parentFreet.engagement = parentFreet.engagement.valueOf() + 1;
    await parentFreet.save();
    return CommentModel.findOne({_id:commentId});
  }
}

export default CommentCollection;

