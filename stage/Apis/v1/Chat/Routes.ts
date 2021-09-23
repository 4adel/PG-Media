import Express from "express";
const Router = Express.Router()
import * as Controller from './controllers';
import ProtectedRoute from "../../../Utils/ProtectedRoute";
import CatchError from "../../../Utils/CatchError";


Router.post("/", ProtectedRoute, CatchError(Controller.Create))
Router.delete("/", ProtectedRoute, CatchError(Controller.Delete))










export default Router