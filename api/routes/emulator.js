const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  return res.send('Emulator: Received a GET HTTP method');
});

module.exports = router;