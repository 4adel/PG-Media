import Express from "express";
const Router = Express.Router()

import Path from "path";



import * as Controller from './Controllers';
import CatchError from "../../../Utils/CatchError";
import ProtectedRoute from "../../../Utils/ProtectedRoute";
import PostMiddleWare from "../../../Utils/Post";

Router.post("/create", ProtectedRoute, PostMiddleWare.IsPostExist, CatchError(Controller.Create))
Router.post("/edit", ProtectedRoute, CatchError(Controller.Edit))
Router.delete("/delete", ProtectedRoute, CatchError(Controller.Delete))
Router.get("/post_comments/:post_id/:round", ProtectedRoute,  PostMiddleWare.IsPostExist, CatchError(Controller.GetPostComments))



export default Router