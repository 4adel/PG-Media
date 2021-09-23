import Express from "express";
const Router = Express.Router()
import * as Controller from './Controllers';
import CatchError from "../../../Utils/CatchError";
import ProtectedRoute from "../../../Utils/ProtectedRoute";

Router.post("/", ProtectedRoute, CatchError(Controller.Send))
Router.delete("/", ProtectedRoute, CatchError(Controller.Delete))
Router.patch("/", ProtectedRoute, CatchError(Controller.Edit))



export default Router