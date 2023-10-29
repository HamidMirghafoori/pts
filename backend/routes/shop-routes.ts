import express from "express";
import { getPurchases, getSales, purchaseItem, ratePurchase } from "../controllers/shop-controller";

const router = express.Router();
const {
  isAuthenticated,
  isBuyer,
  isAdminOrOfficer
} = require("../middlewares/auth-middleware");

router.post("/purchase", isAuthenticated, isBuyer, purchaseItem);
router.get("/purchases-list", isAuthenticated, isBuyer, getPurchases);
router.get("/sales-list", isAuthenticated, isAdminOrOfficer, getSales);
router.post("/rate-purchase", isAuthenticated, isBuyer, ratePurchase);

module.exports = router;
