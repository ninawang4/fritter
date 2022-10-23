import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const hasNotUpvoted = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const upvoters = freet.upvoters;
  if (upvoters.includes(req.session.userId)) {
    res.status(404).json({
      error: {
        hasUpvoted: `you have already upvoted this freet`
      }
    });
    return;
  }

  next();
};

export {hasNotUpvoted};