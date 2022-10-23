import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as followValidator from './middleware';
import * as util from '../freet/util';

const router = express.Router();

/**
 * Upvote a freet
 *
 * @name PUT /api/follows/:id
 *
 * @return {string} - A success message
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
 router.put(
    '/:followId?',
    [
      userValidator.isUserExists,
      followValidator.doesNotFollow,
    ],

    async (req: Request, res: Response) => {
        console.log('hello');
      const userId = (req.session.userId as string) ?? '';
      await UserCollection.findOneAndFollow(req.params.followId, userId);
      res.status(200).json({
        message: `You have successfully followed user ${req.params.followId}`,
      });
    }
  );

  export {router as followRouter};