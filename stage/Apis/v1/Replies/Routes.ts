import Express from "express";
const Router = Express.Router()

import * as Controller from './Controllers';
import CommentMiddleWare from "../../../Utils/Comments";
import CatchError from "../../../Utils/CatchError";
import ProtectedRoute from "../../../Utils/ProtectedRoute";

Router.post("/create", ProtectedRoute, CommentMiddleWare.CommentExist, CatchError(Controller.Create) )
Router.post("/edit", ProtectedRoute, CatchError(Controller.Edit) )
Router.delete("/delete", ProtectedRoute, CatchError(Controller.Delete) )


export default Router