import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import * as util from '../freet/util';

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/homepages
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
 router.get(
    '/',
    async (req: Request, res: Response) => {
      const allFreets = await FreetCollection.findAll();
      const response = allFreets.map(util.constructFreetResponse);
      res.status(200).json(response);
    },
  );

  export {router as homeRouter};