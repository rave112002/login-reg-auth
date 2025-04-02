import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    const token =
        req.cookies.token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_KEY);

        if (tokenDecoded.id) {
            req.body.userId = tokenDecoded.id;
        } else {
            return res.status(401).json({ message: "Unauthorized. " });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized. Please Login" });
    }
};

export default userAuth;
