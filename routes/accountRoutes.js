const express = require('express');
const { listAccounts, addAccount, updateAccount, toggleAccountActive } = require('../controllers/accountController');
const authenticate = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/role');

const router = express.Router();

router.use(authenticate, roleMiddleware('Special User'));

router.get('/', listAccounts);
router.post('/', addAccount);
router.put('/:id', updateAccount);
router.patch('/:id/activate', toggleAccountActive);

module.exports = router; 