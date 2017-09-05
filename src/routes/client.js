import express from 'express';
import passport from 'passport';
import clientController from '../controllers/client';

const router = express.Router(); // eslint-disable-line new-cap
const requireAuth = passport.authenticate('bearer', {
  session: false
});

router.get('/', requireAuth, clientController.listClients);
router.post('/', requireAuth, clientController.createClient);

router.get('/:id', requireAuth, clientController.getClient);

export default router;
