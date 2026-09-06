import NetWorthSnapshot from "../models/netWorthSnapshot.model.js";

import {
    createNetWorthSnapshot
} from "../services/netWorthSnapshot.service.js";


// ==========================================
// CREATE TODAY'S SNAPSHOT
// ==========================================

export const createSnapshot = async (req, res) => {

    const userId = req.user.id;


    const snapshot =
        await createNetWorthSnapshot(userId);


    res.status(201).json({

        success: true,

        message:
            "Net worth snapshot created successfully",

        data: snapshot

    });
};



// ==========================================
// GET SNAPSHOT HISTORY
// ==========================================

export const getSnapshotHistory = async (req, res) => {

    const userId = req.user.id;


    let months =
        Number(req.query.months) || 6;


    if (months < 1) {

        months = 1;

    }


    if (months > 24) {

        months = 24;

    }


    const startDate = new Date();


    startDate.setMonth(
        startDate.getMonth() - months
    );


    const snapshots =
        await NetWorthSnapshot.find({

            user: userId,

            snapshotDate: {
                $gte: startDate
            }

        })
        .sort({
            snapshotDate: 1
        })
        .select(
            "snapshotDate totalAssets totalLiabilities netWorth bankBalance cashBalance investmentValue creditCardBalance loanBalance currency"
        );


    res.status(200).json({

        success: true,

        months,

        count: snapshots.length,

        data: snapshots

    });
};



// ==========================================
// GET LATEST SNAPSHOT
// ==========================================

export const getLatestSnapshot = async (req, res) => {

    const userId = req.user.id;


    const snapshot =
        await NetWorthSnapshot.findOne({
            user: userId
        })
        .sort({
            snapshotDate: -1
        });


    res.status(200).json({

        success: true,

        data: snapshot

    });
};