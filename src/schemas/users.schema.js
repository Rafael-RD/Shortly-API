import Joi from "joi";

export const registerSchema=Joi.object({
    name: Joi.string().min(1).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(50).required(),
    confirmPassword: Joi.string().min(3).max(50).required()
});

export const loginSchema=Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(50).required()
});