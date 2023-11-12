import express from "express";
import {
  addRevenue,
  getPurchases,
  getSales,
  getShopReport,
  purchaseItem,
  ratePurchase,
} from "../controllers/shop-controller";

const router = express.Router();
const {
  isAuthenticated,
  isCustomer,
  isAdminOrOfficer,
  isBusinessOrOfficer
} = require("../middlewares/auth-middleware");

router.post("/purchase", isAuthenticated, isCustomer, purchaseItem);
router.post("/add-revenue", isAuthenticated, isCustomer, addRevenue);
router.post("/purchases-list", isAuthenticated, isCustomer, getPurchases);
router.get("/sales-list", isAuthenticated, isAdminOrOfficer, getSales);
router.post("/rate-purchase", isAuthenticated, isCustomer, ratePurchase);
router.post("/shop-report", isAuthenticated, isBusinessOrOfficer, getShopReport);

module.exports = router;
