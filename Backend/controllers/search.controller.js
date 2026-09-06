import {
    searchAll
} from "../services/search.service.js";


export const search = async (
    req,
    res
) => {

    const userId =
        req.user.id;


    const data =
        await searchAll(
            userId,
            req.query
        );


    res.status(200).json({

        success: true,

        message:
            "Search results fetched successfully",

        data
    });
};