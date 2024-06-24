const express = require("express");
const { tokenCheck } = require("../midlleware/tokenCheack");
const { cheackIsAdmin } = require("../midlleware/adminCheack");
const router = express.Router();
const {
  allOrders,
  ordersToday,
  singleOrders,
  deliveryStatusChange,
  userOrders,
  GetSingleUsersOrders,
  allOrdersDate,
  ordersTodayData,
} = require("../controller/orders");

router.get("/allOrders", tokenCheck, cheackIsAdmin, allOrders);
router.get("/todayOrders", tokenCheck, cheackIsAdmin, ordersToday);
router.get("/singleOrder/:id", tokenCheck, cheackIsAdmin, singleOrders);
router.put(
  "/deliveryStatusChange/:id",
  tokenCheck,
  cheackIsAdmin,
  deliveryStatusChange
);
router.get("/userOrders", tokenCheck, userOrders);
router.get(
  "/GetSingleUsersOrders/:id",
  tokenCheck,
  cheackIsAdmin,
  GetSingleUsersOrders
);

router.get("/allOrdersDate", allOrdersDate);
router.get("/ordersTodayData", ordersTodayData);

module.exports = router;
