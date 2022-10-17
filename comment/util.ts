import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet} from '../freet/model';
import type {Comment} from './model';
import FreetCollection from '../freet/collection';


// Update this if you add a property to the Freet type!
type CommentResponse = {
    parentFreet: string | null;
    content: Freet;
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
 const constructFreetResponse = (freet: HydratedDocument<Freet>): CommentResponse => {
   const freetCopy: Comment = {
     ...freet.toObject({
       versionKey: false // Cosmetics; prevents returning of __v property
     })
   };
     return {
     ...freetCopy,
     
     parentFreet: freetCopy.parentFreet.toString(),
     content: freet
   };
 };
 
 export {
   constructFreetResponse
 };
 