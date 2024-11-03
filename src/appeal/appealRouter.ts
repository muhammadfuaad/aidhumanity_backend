import express from 'express'
import { allAppeals, allCampaigns, createAppeal, deleteAppeal, updateAppeal, getSingleAppeal } from './appealController';
import multer from 'multer';
import path from 'node:path'
import authenticate from '../middlewares/authenticate';

const appealRouter = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../../public/data/uploads')); // Set the destination
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique suffix
    const ext = path.extname(file.originalname); // Extract the file extension
    console.log('ext:', ext);
    console.log('path:', path);
    
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Set the filename (e.g., appealImage-1627319123723.jpg)
  }
});

const upload = multer({
  // dest: path.resolve(__dirname, '../../public/data/uploads'),
  storage: storage,
  limits: {fileSize: 3e7}
})

appealRouter.post('/', authenticate, upload.fields([{name: 'appealImage', maxCount: 3}]), createAppeal)
appealRouter.delete('/delete/:id', authenticate, deleteAppeal)
appealRouter.put('/update/:id', authenticate, upload.fields([{name: 'appealImage', maxCount: 3}]), updateAppeal)
appealRouter.get('/', allAppeals)
appealRouter.get('/campaigns', allCampaigns)
appealRouter.get('/:appealId', getSingleAppeal)

export default appealRouter;