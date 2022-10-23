import type {Request, Response, NextFunction} from 'express';
import UserCollection from '../user/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const doesNotFollow = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.params.followId);
  const followers = user.followers;
  if (followers.includes(req.session.userId)) {
    res.status(404).json({
      error: {
        hasUpvoted: `you have already followed this user`
      }
    });
    return;
  }

  next();
};

const doesFollow = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUserId(req.params.followId);
    const followers = user.followers;
    if (!followers.includes(req.session.userId)) {
      res.status(404).json({
        error: {
          hasUpvoted: `you have not yet followed this user`
        }
      });
      return;
    }
  
    next();
  };

export {doesNotFollow, doesFollow};