import Express from "express";
const Router = Express.Router()

import * as Controller from './Controllers';
import CatchError from "../../../Utils/CatchError";
import ProtectedRoute from "../../../Utils/ProtectedRoute";

Router.post("/create", ProtectedRoute, CatchError(Controller.Create))
Router.delete("/delete", ProtectedRoute, CatchError(Controller.Delete))
Router.post("/edit", ProtectedRoute, CatchError(Controller.Edit))
Router.get("/:post_id", ProtectedRoute, CatchError(Controller.Get))
Router.get("/:user_id/:round", ProtectedRoute, CatchError(Controller.GetProgilePictures))












export default Router