import { body , validationResult } from "express-validator";


async function validate(req,res,next) {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }

    next()
}



export const registerUserValidationRules = [
    body('email').isEmail().withMessage('Inavalid email address'),
    body('password').isLength({min:6}).withMessage('password must be at least 6 characters long'),
    body('fullName.firstName').notEmpty().withMessage('Firstname is required'),
    body('fullName.lastName').notEmpty().withMessage('Lastname is required'),

    validate
]

export const loginUserValidationRules = [ 
    body('email').isEmail().withMessage('Inavlid email address'),
    body('password').isLength().withMessage('password must be at least 6 characters long')
]