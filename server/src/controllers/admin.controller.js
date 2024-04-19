import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asynchandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

// 
const generateAccessAndRefreshToken = async (Admin) => {
    try {
      const accessToken = jwt.sign({ id: Admin.id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
      })
      const refreshToken=jwt.sign({
        id: Admin.id,
        jti
      }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '8h',
      });
      return { accessToken, refreshToken };
    } catch (error) {
      console.log("error: ", error);
      throw new apiError(
        500,
        "Something went wrong while generating access and refresh token"
      );
    }
  };


//Admin login
const loginAdmin = asynchandler(async (req, res) => {
    const { id, password } = req.body;
    // check if all fields are filled
    if (!id) {
        throw new apiError(400, "id  required");
      }
    if (!password) {
      throw new apiError(400, "password  required");
    }
    // check if user exists
    const Admin = await prisma.Admin.findUnique({
        where: {
        id: id,
        },
      })
    if (!Admin) {
      throw new apiError(404, "User not found");
    }
    // check if password is correct
    if(Admin.password !== password) {
        throw new apiError(401, "Incorrect password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      Admin
    );
    await db.Admin.update({
        where: { 
            id,
            }, 
            data: { refreshToken } 
        });
    //cookies ke liya hai , options for which cookie to be sent
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new apiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  });