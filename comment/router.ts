import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as commentValidator from './middleware';
// import * as util from '../freet/util';

const router = express.Router();

/**
 * Comment on a Freet
 *
 * @name PUT /api/freets
 *
 * @param {string} content - The content of the freet
 * @param {Types.ObjectId} parentFreetId - The parent freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
 router.put(
    '/:freetId?',
    [
      userValidator.isUserLoggedIn,
      freetValidator.isValidFreetContent,
      commentValidator.isFreetParentExists,
    ],
    async (req: Request, res: Response) => {
      const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
      const comment = await CommentCollection.addComment(userId, req.body.content, req.params.freetId);
    
      res.status(200).json({
        message: 'Your comment was created successfully.',
        comment: comment,
      });
    }
  );
export {router as commentRouter};
  