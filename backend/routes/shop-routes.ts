import express from "express";
import { getPurchases, getSales, purchaseItem, ratePurchase } from "../controllers/shop-controller";

const router = express.Router();
const {
  isAuthenticated,
  isCustomer,
  isAdminOrOfficer
} = require("../middlewares/auth-middleware");

router.post("/purchase", isAuthenticated, isCustomer, purchaseItem);
router.get("/purchases-list", isAuthenticated, isCustomer, getPurchases);
router.get("/sales-list", isAuthenticated, isAdminOrOfficer, getSales);
router.post("/rate-purchase", isAuthenticated, isCustomer, ratePurchase);

module.exports = router;
