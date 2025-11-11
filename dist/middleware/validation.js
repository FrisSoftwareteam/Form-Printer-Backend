import { body, query, validationResult } from "express-validator";
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    next();
};
export const loginValidation = [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
];
export const searchValidation = [
    query("query").optional().isString().trim().escape(),
    query("name").optional().isString().trim().escape(),
    query("value").optional().isString().trim().escape(),
    query("collection").optional().isString().trim(),
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage("Limit must be between 1 and 1000"),
    validate,
];
