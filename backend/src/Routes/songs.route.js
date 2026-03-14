const {Router} = require ('express');
const songCntroller = require('../controller/song.controller')
const upload = require('../middleware/upload.middleware')

const router = Router();

// post api/song/

router.post('/',upload.single('song'),songCntroller.uploadSongs)




module.exports = router