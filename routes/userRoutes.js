const express = require('express');
const { register, login, getUsers, updateUserRole } = require('../controllers/userController');
const authenticate = require('../middlewares/auth'); // Import authenticate middleware
const roleMiddleware = require('../middlewares/role'); // Import roleMiddleware

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', authenticate, roleMiddleware('Special User'), getUsers);
router.put('/:id', authenticate, roleMiddleware('Special User'), updateUserRole);

module.exports = router;
