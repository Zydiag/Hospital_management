import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const hashToken = async (token) => {
    return crypto.createHash('sha512').update(token).digest('hex');
}
export { hashToken };