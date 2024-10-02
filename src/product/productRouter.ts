import express from 'express'
import { allProducts, createProduct, deleteProduct, updateProduct, getSingleProduct } from './productController';
import multer from 'multer';
import path from 'node:path'
import authenticate from '../middlewares/authenticate';

const productRouter = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../../public/data/uploads')); // Set the destination
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique suffix
    const ext = path.extname(file.originalname); // Extract the file extension
    console.log('ext:', ext);
    console.log('path:', path);
    
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Set the filename (e.g., productImage-1627319123723.jpg)
  }
});

const upload = multer({
  // dest: path.resolve(__dirname, '../../public/data/uploads'),
  storage: storage,
  limits: {fileSize: 3e7}
})

productRouter.post('/', authenticate, upload.fields([{name: 'productImage', maxCount: 3}]), createProduct)
productRouter.delete('/delete/:id', authenticate, deleteProduct)
productRouter.put('/update/:id', authenticate, upload.fields([{name: 'productImage', maxCount: 3}]), updateProduct)
productRouter.get('/', allProducts)
productRouter.get('/:productId', getSingleProduct)

export default productRouter;