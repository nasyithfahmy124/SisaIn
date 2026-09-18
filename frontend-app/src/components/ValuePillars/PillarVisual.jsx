import React from "react";

import AIVisual from "./visuals/AIVisual";
import MapVisual from "./visuals/MapVisual";
import RewardVisual from "./visuals/RewardVisual";

export default function PillarVisual({
    pillar,
    mobile = false,
}) {
    const props = {
        pillar,
        mobile,
    };

    switch (pillar.key) {
        case "ai-valuasi":
            return <AIVisual {...props} />;

        case "peta-realtime":
            return <MapVisual {...props} />;

        case "reward-tier":
            return <RewardVisual {...props} />;

        default:
            return null;
    }
}