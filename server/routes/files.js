const filesController = require('../controllers/files');
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// create post route
router.post('/upload', upload.single('file'), requireAuth,  filesController.upload);


module.exports = router;