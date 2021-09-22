import Express from "express";
const Router = Express.Router();
import * as Controller from "./Controllers";
import CatchError from "../../../Utils/CatchError";
import ProtectedRoutes from "../../../Utils/ProtectedRoute";


Router.post("/register", CatchError(Controller.Register));

Router.post("/login", CatchError(Controller.Login));

Router.post("/renewToken", ProtectedRoutes, CatchError(Controller.RenewToken));



export default Router
