import jwt from "jsonwebtoken";
export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({
                success: false,
                error: "Not authorized to access this route",
            });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: "Not authorized to access this route",
        });
    }
};
export const validateApiKey = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        res.status(403).json({
            success: false,
            error: "Invalid or missing API key",
        });
        return;
    }
    next();
};
