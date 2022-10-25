import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Comment = {
    _id: Types.ObjectId,
    commenterId: Types.ObjectId,
    content: string,
    dateCreated: Date,
};

export type PopulatedComment = {
    _id: Types.ObjectId,
    commenterId: Types.ObjectId,
    content: string,
    dateCreated: Date,
};

const CommentSchema = new Schema<Comment> ({
    commenterId: {
        // Use Types.ObjectId outside of the schema
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },

      content: {
        type: String,
        required: true
      },

      dateCreated: {
        type: Date,
        required: true
      },
});

const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;