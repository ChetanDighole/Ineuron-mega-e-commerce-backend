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
        //fields/formidable.fields = form data
        //files/formidable.files = images , videos
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
                //object.keys will make array of images
                Object.keys(files).map(async (fileKey , index) => {
                    //filekeys are nothing but the element of array
                    const element = files[fileKey]

                    /************
                     // image details
                     element = {
                        filePath: ""
                        fileExtention: ""
                        .
                        .
                     }
                     **************/
                    

                     //to get all the data of a image not just name we use fs - file system of node js

                    const data = fs.readFileSync(element.filepath)
                    //when user browse image the image path is also gets in

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

            // saving to database
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

/*********************
 *  @GET_ALL_PRODUCT
 *  @route https://localhost:5000/api/product
 *  @description Controller used for all products
 *  @description user and admin all can create the coupon
 *  @return Product Object
 * ******************/

export const getAllProducts = asyncHandler(async (req , res) => {
    const products = await Product.find({})

    if(!products){
        throw new CustomError('No products was found' , 404)
    }

    res.status(200).json({
        success: true,
        products
    })

})

/*********************
 *  @GET_PRODUCT_BY_ID
 *  @route https://localhost:5000/api/product
 *  @description Controller used for getting single product
 *  @description user and admin all can create the coupon
 *  @return Product Object
 * ******************/

export const getProduct = asyncHandler(async (req , res) => {

    const {id: productId} = req.params

    const product = await Product.findById(productId)

    if(!product){
        throw new CustomError('No product was found' , 404)
    }

    res.status(200).json({
        success: true,
        product
    })

})
