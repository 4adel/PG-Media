import JWT, { Secret } from "jsonwebtoken";
import { Request ,Response, NextFunction } from 'express'




export default function  ProtectedRoute(req: any, res: Response, next: NextFunction)  {

    


    if(!req.cookies.token) {
        res.cookie("token", null, {
            httpOnly: process.env.NODE_ENV === "production"? true: false,
            secure: process.env.NODE_ENV === "production"? true: false ,
            path: "/"
          })
          res.cookie("auth", false, {
            httpOnly: false,
            secure: false,
            path: "/"
          })
        res.status(401)
        res.send("token is missing")
        res.end();
        return
    }
    
       

    const JWT_SECRET_TYPE : any = process!.env!.JWT_SECRET
    JWT.verify(req.cookies.token, JWT_SECRET_TYPE , (error: any, decoded: any) => {
        if (error) {
            res.cookie("token", "", {
                httpOnly: process.env.NODE_ENV === "production"? true: false,
                secure: process.env.NODE_ENV === "production"? true: false ,
                path: "/"
              })
              res.cookie("auth", false, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production"? true: false ,
                path: "/"
              })
            res.status(401)
            res.send("Invalid authorization token")
            res.end();
            return
        }
        req!.user = decoded;
        return next();
    });
};
