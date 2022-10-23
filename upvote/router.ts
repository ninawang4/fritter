import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import * as freetValidator from '../freet/middleware';
import * as upvoteValidator from './middleware';


const router = express.Router();

/**
 * Upvote a freet
 *
 * @name PUT /api/upvotes/:id
 *
 * @return {string} - A success message
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
 router.put(
    '/:freetId?',
    [
    //   userValidator.isUserLoggedIn,
      freetValidator.isFreetExists,
      upvoteValidator.hasNotUpvoted,
    ],

    async (req: Request, res: Response) => {
        console.log("congrats");
      const userId = (req.session.userId as string) ?? '';
      const freet = await FreetCollection.upvoteOne(req.params.freetId, userId);
      res.status(200).json({
        message: 'The freet was upvoted successfully.',
      });
    }
  );

  export {router as upvoteRouter};