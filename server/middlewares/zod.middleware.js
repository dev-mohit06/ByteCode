import ApiResponse from "../utils/api.util.js";

// Purpose: Middleware to validate request body using zod schema.
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            res.status(400).json(new ApiResponse(false, error.errors[0].message, null))
        }
    }
}

export default validate;