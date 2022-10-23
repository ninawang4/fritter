import {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

// Type definition for Freet on the backend
export type Freet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  comment: [
    {commenterId: Types.ObjectId | string,
    content: string,
    dateCreated: Date,}
  ];
  scheduledTime: Date;
  upvoters: [Types.ObjectId | string];
  upvotes: Number;
  engagement: Number;
  content: string;
  dateModified: Date;
};

export type PopulatedFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  comment: [
    {commenterId: Types.ObjectId | string,
    content: string,
    dateCreated: Date,}
  ];
  scheduledTime: Date;
  upvoters: [Types.ObjectId | string];
  upvotes: Number;
  engagement: Number;
  content: string;
  dateModified: Date;
};



// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FreetSchema = new Schema<Freet>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },

  scheduledTime: {
    type: Date,
    required: false
  },

  comment: [],
  upvoters: [Schema.Types.ObjectId,],

  upvotes: {
    type: Number,
    default: 0,
    required: true
  },

  engagement: {
    type: Number,
    default: 0,
    required: true
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  }
});


const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;

