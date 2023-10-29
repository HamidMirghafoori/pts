import express from "express";
import { purchaseItem } from "../controllers/shop-controller";

const router = express.Router();
const {
  isAuthenticated,
  isBuyer,
} = require("../middlewares/auth-middleware");

router.post("/purchase", isAuthenticated, isBuyer, purchaseItem);

module.exports = router;
