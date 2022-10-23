import type {HydratedDocument, ObjectId} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet} from '../freet/model';

// Update this if you add a property to the Freet type!
type FreetResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  scheduledTime: string;
  upvoters: string[];
  upvotes: Number;
  engagement: Number;
  content: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetResponse = (freet: HydratedDocument<Freet>): FreetResponse => {
  const freetCopy: PopulatedFreet = {
    ...freet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = freetCopy.authorId;
 
  delete freetCopy.authorId;


  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    author: username,
    upvoters: freet.upvoters.map(upvoter => upvoter.toString()),
    upvotes: freet.upvotes,
    engagement: freet.engagement,
    scheduledTime: formatDate(freet.scheduledTime),
    dateCreated: formatDate(freet.dateCreated),
    dateModified: formatDate(freet.dateModified)
  };
};

export {
  constructFreetResponse
};
