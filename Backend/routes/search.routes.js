import express from "express";

import {
    search
} from "../controllers/search.controller.js";

import verificationToken
    from "../middleware/verifyToken.middle.js";

import {
    validateSearchQuery
} from "../validators/search.validator.js";


const router =
    express.Router();


/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(
    verificationToken
);


/*
|--------------------------------------------------------------------------
| Unified Search
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    validateSearchQuery,
    search
);


export default router;