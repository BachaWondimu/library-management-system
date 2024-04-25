import { Router } from "express";
import { get_copies_handler, post_copy_handler, get_copy_by_id_handler, put_copy_by_id_handler, delete_copy_by_id_handler } from "./copies.handlers";

const copiesRouter = Router({ mergeParams: true});

copiesRouter.get("/", get_copies_handler);
copiesRouter.post("/", post_copy_handler);
copiesRouter.get("/:copy_id", get_copy_by_id_handler);
copiesRouter.put("/:copy_id", put_copy_by_id_handler);
copiesRouter.delete("/:copy_id", delete_copy_by_id_handler);

export default copiesRouter;
