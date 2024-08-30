import { Router } from "express";
import express from "express";
import { Controllers } from "../controllers/controllers";

const router = express.Router();

router.post("/upload", Controllers.upload);
router.patch("/confirm", Controllers.confirm);

export { router };
