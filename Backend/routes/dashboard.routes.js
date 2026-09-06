import express from "express";

import getDashboard from "../controllers/dashboard.controller.js";

import verificationToken from "../middleware/verifyToken.middle.js";


const dashboardRoute = express.Router();


/*
|--------------------------------------------------------------------------
| Protected Dashboard Routes
|--------------------------------------------------------------------------
*/

dashboardRoute.use(verificationToken);


/*
|--------------------------------------------------------------------------
| GET DASHBOARD
|--------------------------------------------------------------------------
|
| GET /api/v1/dashboard
|
*/

dashboardRoute.get("/", getDashboard);


export default dashboardRoute;