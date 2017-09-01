import express from 'express';
import passport from 'passport';
import clientController from '../controllers/client-controller';

const router = express.Router(); // eslint-disable-line new-cap
const requireAuth = passport.authenticate('bearer', {
  session: false
});

router.get('/', requireAuth, clientController.list);
router.post('/', requireAuth, clientController.create);

router.get('/:clientId', requireAuth, clientController.get);


/** Load client when API with client_Id route parameter is hit */
router.param('clientId', clientController.load);

export default router;
