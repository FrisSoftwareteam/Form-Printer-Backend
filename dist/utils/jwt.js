import jwt from "jsonwebtoken";
export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
        expiresIn: process.env.JWT_EXPIRE || "7d",
    });
};
