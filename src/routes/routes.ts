import { Router } from "express";
import express from "express";
import { Controllers } from "../controllers/controllers";

const router = express.Router();

router.post("/upload", Controllers.upload);

export { router };
