import Express from "express";
const Router = Express.Router()



import * as Controller from './Controllers';
import CatchError from "../../../Utils/CatchError";
import ProtectedRoute from "../../../Utils/ProtectedRoute";
import PostMiddleWare from "../../../Utils/Post";

Router.post("/", ProtectedRoute, PostMiddleWare.IsPostExist, CatchError(Controller.Create))
Router.patch("/", ProtectedRoute, CatchError(Controller.Edit))
Router.delete("/", ProtectedRoute, CatchError(Controller.Delete))
Router.get("/post_comments/:post_id/:round", ProtectedRoute,  PostMiddleWare.IsPostExist, CatchError(Controller.GetPostComments))



export default Router