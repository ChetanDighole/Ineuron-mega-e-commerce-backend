const asyncHandler = (fn) => async (req, res, next) => {
    try {
        
        await fn(req, res, next)

    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}
export default asyncHandler


// we took function as a input and passed it to another async function inside it
// const asyncHandler = () => {}
// const asyncHandler = (function) => {}
// const asyncHandler = (function) => () => {}
// const asyncHandler = (function) => async () => {}

// function asyncHandler(fn){
//     return async function (req, res, next){
//         try {
//             await fn(req, res, next)
//         } catch (error) {
            
//         }
//     }
// }
