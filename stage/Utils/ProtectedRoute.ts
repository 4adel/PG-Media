import JWT, { Secret } from "jsonwebtoken";
import { Request ,Response, NextFunction } from 'express'




export default function  ProtectedRoute(req: any, res: Response, next: NextFunction)  {

    const cookies: any = { token: "", auth: "" }
    
    req!.headers!.cookie!.split('; ').forEach((tok: any) => {
        const TOKEN = tok.split("=")
        cookies[TOKEN[0]] = TOKEN[1]
    });

    
    try {
        if (!cookies) {
            throw "Missing authorization headers";
        }
        if (!cookies.token) {
            throw "Missing Authrization token";
        }
    } catch (error) {
        res.status(401)
        res.send(error)
        res.end();
        return
    }


    
       

    const JWT_SECRET_TYPE : any = process!.env!.JWT_SECRET
    JWT.verify(cookies.token, JWT_SECRET_TYPE , (error: any, decoded: any) => {
        if (error) {
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
            res.send("Invalid authorization token")
            res.end();
            return
        }
        req!.user = decoded;
        return next();
    });
};
