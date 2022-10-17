import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as freetParentValidator from './middleware';
import * as util from '../freet/util';
import CommentSection from './collection';

const router = express.Router();

/**
 * Comment on a Freet
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @param {Types.ObjectId} parentFreetId - The parent freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
 router.post(
    '/:freetId?',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isValidFreetContent,
      freetParentValidator.isFreetParentExists,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const freet = await CommentSection.addOne(userId, req.params.freetId, req.body.content);
      console.log('at least youre getting there')
    
      res.status(201).json({
        message: 'Your comment was created successfully.',
        freet: util.constructFreetResponse(freet)
      });
    }
  );
export {router as commentRouter};
  
//   router.put(
//     '/:freetId?',
//     [
//       userValidator.isUserLoggedIn,
//       freetValidator.isFreetExists,
//       freetValidator.isValidFreetModifier,
//       freetValidator.isValidFreetContent
//     ],
//     async (req: Request, res: Response) => {
//       const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
//       res.status(200).json({
//         message: 'Your freet was updated successfully.',
//         freet: util.constructFreetResponse(freet)
//       });
//     }
//   );


// export {router as commentRouter};