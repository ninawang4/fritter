import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import FreetSchema from '../freet/model';



export type Comment = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  parentFreet: Types.ObjectId;
  content: Freet;
};

const CommentSchema = new Schema<Comment>({
    parentFreet: {
    type: Schema.Types.ObjectId,
    required: true
    },

    content: {
    type: FreetSchema
    }

});

const CommentModel = model<Comment>('Freet', CommentSchema);
export default CommentModel;
