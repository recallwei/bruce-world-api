import express, { Router, Request, Response } from "express";
import { dbPool } from "../../../db/index";

const router: Router = express.Router();

router.get("/", async (request: Request, response: Response) => {
  try {
    const { rows } = await dbPool.query(
      "SELECT * FROM docs.menus ORDER BY indexs"
    );
    response.status(200).json(rows);
  } catch (err) {
    response.status(404).json("Server Error");
  }
});

export default router;
