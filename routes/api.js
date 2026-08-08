const express = require('express');
const router = express.Router();
const { checkTokenCache } = require('../middleware/authCache');

router.get('/protected-resource', checkTokenCache, (req, res) => {
    res.json({ 
        status: 'success',
        message: 'Access granted!', 
        userData: req.tokenData 
    });
});

module.exports = router;