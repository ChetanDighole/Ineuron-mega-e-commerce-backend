import Collection from "../models/collection.schema";
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"

/***************************************
 * @Create_Collection
 * @route http://localhost:4000/api//collection
 * @description User signup controller for creating a new user
 * @parameter name, email, password
 * @return User Object
 **************************************/

export const createCollection = asyncHandler(async(req , res) => {
    //taking name from frontend
    const { name } = req.body

    if(!name){
        throw new CustomError("Collection name is required" , 400)
    }

    const collection = await Collection.create({
        name
    })

    //send to front end
    res.status(200).json({
        success: true,
        message: "Collection created with success",
        collection
    })

})

export const updateCollection = asyncHandler(async(req , res) => {
    //get existing value to be update
    const {id: collectionId} = req.params

    //new value to get updated
    const { name } = req.body

    if(!name){
        throw new CustomError("Collection name is required" , 400)
    }

    let updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        {
            name
        },
        {
            new: true,
            runValidators: true
        }
    )

    if(!updatedCollection){
        throw new CustomError("Collection not found" , 400) 
    }

    //send res to front-end
    res.status(200).json({
        success:true,
        message: "collection update successfully",
        updatedCollection
        //################################### mistake in hitesh choudhry code updatedCollection not updatecollection ###############
    })
})

export const deleteCollection = asyncHandler(async(req , res) => {

    const {id: collectionId} = req.params

    const collectionTodelete = await Collection.findByIdAndDelete(collectionId)

    if(!collectionTodelete){
        throw new CustomError("Collection not found" , 400) 
    }

    res.status(200).json({
        success:true,
        message: "collection deleted successfully",
        collectionTodelete
    })

})

export const getAllCollection = asyncHandler(async(req,res) => {
    const collection = await Collection.find()

    if(!collection){
        throw new CustomError("No Collection found")
    }

    res.status(200).json({
        success: true,
        collection
    })

})
