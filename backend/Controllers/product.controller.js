import Product from '../models/product.schema'
import formidable from 'formidable'
import fs from 'fs'
import { deletFile, s3FileUpload } from '../services/imageUpload.js'
import Mongoose from 'mongoose'
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import config from '../config/index'


/*********************
 *  @ADD_PRODUCT
 *  @route https://localhost:5000/api/product
 *  @description Controller used for creating a new product
 *  @description only admin can create the coupon
 *  @description Uses AWS S3 Bucket for image upload
 *  @return Product Object
 * ******************/

export const addProduct = asyncHandler(async (req, res) => {
    const form = formidable({
        multiples: true,
        keepExtensions: true,
    });

    form.parse(req, async function (err, fields, files) {
        try {

            if (err) {
                throw new CustomError(err.message || 'something went wrong', 500)
            }

            let productId = new Mongoose.Types.ObjectId().toHexString();

            //check for fields
            if(!fields.name || !fields.price || !fields.description || !fields.collectionId){
                throw new CustomError('Please fill all details' , 500)
            }

            //handling the file
            let imgArrayResp = Promise.all(
                Object.keys(files).map(async (fileKey , index) => {
                    const element = files[fileKey]
                    
                    const data = fs.readFileSync(element.filepath)

                    const upload = await s3FileUpload({
                        bucketName: config.S3_BUCKET_NAME,
                        Key: `products/${productId}/photo_${index + 1}.png`,
                        body: data,
                        contentType: element.mineType
                    })
                    return {
                        secure_url : upload.Location
                    }

                })
            )

            let imgArray = await imgArrayResp;

            const product = await Product.create({
                _id: productId,
                photos: imgArray,
                ...fields
            })

            if(!product){
                throw new CustomError('Product was not created' , 400)
            }

            res.status(200).json({
                success: true,
                product
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "something went wrong"
            })
        }
    })

})

