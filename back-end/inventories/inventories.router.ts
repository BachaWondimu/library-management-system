import { Router } from "express";
import {
  delete_book_from_inventory_by_id_handler,
  get_inventories_handler,
  get_inventory_by_id_handler,
  post_inventory_handler,
  put_book_in_inventory_by_id_handler,
} from "./inventories.handler";

const inventoriesRouter = Router({ mergeParams: true });

inventoriesRouter.get("/", get_inventories_handler);
inventoriesRouter.post("/", post_inventory_handler); 
inventoriesRouter.get("/:inventory_id", get_inventory_by_id_handler);
inventoriesRouter.put("/:isbn", put_book_in_inventory_by_id_handler); 
inventoriesRouter.put("/:isbn/remove-book/:copy_id", put_book_in_inventory_by_id_handler);
inventoriesRouter.delete("/:isbn/:copy_id", delete_book_from_inventory_by_id_handler);


export default inventoriesRouter;
