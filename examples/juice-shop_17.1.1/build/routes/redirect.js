"use strict";
/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../lib/utils");
const challengeUtils = require("../lib/challengeUtils");
const datacache_1 = require("../data/datacache");
const security = require('../lib/insecurity');
module.exports = function performRedirect() {
    return ({ query }, res, next) => {
        const toUrl = query.to;
        if (security.isRedirectAllowed(toUrl)) {
            challengeUtils.solveIf(datacache_1.challenges.redirectCryptoCurrencyChallenge, () => { return toUrl === 'https://explorer.dash.org/address/Xr556RzuwX6hg5EGpkybbv5RanJoZN17kW' || toUrl === 'https://blockchain.info/address/1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm' || toUrl === 'https://etherscan.io/address/0x0f933ab9fcaaa782d0279c300d73750e1311eae6'; });
            challengeUtils.solveIf(datacache_1.challenges.redirectChallenge, () => { return isUnintendedRedirect(toUrl); });
            res.redirect(toUrl);
        }
        else {
            res.status(406);
            next(new Error('Unrecognized target URL for redirect: ' + toUrl));
        }
    };
};
function isUnintendedRedirect(toUrl) {
    let unintended = true;
    for (const allowedUrl of security.redirectAllowlist) {
        unintended = unintended && !utils.startsWith(toUrl, allowedUrl);
    }
    return unintended;
}
//# sourceMappingURL=redirect.js.map