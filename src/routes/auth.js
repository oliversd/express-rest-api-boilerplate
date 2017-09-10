import express from 'express';
import * as oauth2 from '../authentication/oauth2-server';

const router = express.Router(); // eslint-disable-line new-cap

/**
 * @api {post} /api/auth/oauth user login
 * @apiVersion 0.0.1
 * @apiName oauthToken
 * @apiGroup auth
 * @apiPermission none
 *
 * @apiParam {Object} body object with auth info
 * @apiParam {String} body.username users email
 * @apiParam {String} body.password users password
 * @apiParam {String} body.grant_type refresh or password
 * @apiParam {String} body.client_id clients unique id
 * @apiParam {String} body.client_secret clients secret
 *
 * @apiSuccess {Object} body response object
 * @apiSuccess {Object} body.refresh_token token to make refresh grant type request
 * @apiSuccess {Object} body.access_token token to do every request
 * @apiSuccess {Object} body.token_type type of token usually bearer
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       access_token: '80794e408fd1b9386c5ac9f0b7b3c86318dc8d4f6440525573cb64c4ee57d652',
 *       refresh_token: 'd3744dba196cead45c807df068f04d6751be6f22e40560f728656cd13fe59533',
 *       token_type: 'Bearer'
 *     }
 */
router.post('/oauth', oauth2.token);

export default router;
