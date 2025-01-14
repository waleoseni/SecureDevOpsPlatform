"use strict";
/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feedback_1 = require("../models/feedback");
const complaint_1 = require("../models/complaint");
const sequelize_1 = require("sequelize");
const challengeUtils = require("../lib/challengeUtils");
const config_1 = __importDefault(require("config"));
const jws_1 = __importDefault(require("jws"));
const utils = __importStar(require("../lib/utils"));
const security = require('../lib/insecurity');
const jwt = require('jsonwebtoken');
const cache = require('../data/datacache');
const challenges = cache.challenges;
const products = cache.products;
exports.emptyUserRegistration = () => (req, res, next) => {
    challengeUtils.solveIf(challenges.emptyUserRegistration, () => {
        return req.body && req.body.email === '' && req.body.password === '';
    });
    next();
};
exports.forgedFeedbackChallenge = () => (req, res, next) => {
    challengeUtils.solveIf(challenges.forgedFeedbackChallenge, () => {
        const user = security.authenticatedUsers.from(req);
        const userId = user?.data ? user.data.id : undefined;
        return req.body?.UserId && req.body.UserId != userId; // eslint-disable-line eqeqeq
    });
    next();
};
exports.captchaBypassChallenge = () => (req, res, next) => {
    if (challengeUtils.notSolved(challenges.captchaBypassChallenge)) {
        if (req.app.locals.captchaReqId >= 10) {
            if ((new Date().getTime() - req.app.locals.captchaBypassReqTimes[req.app.locals.captchaReqId - 10]) <= 20000) {
                challengeUtils.solve(challenges.captchaBypassChallenge);
            }
        }
        req.app.locals.captchaBypassReqTimes[req.app.locals.captchaReqId - 1] = new Date().getTime();
        req.app.locals.captchaReqId++;
    }
    next();
};
exports.registerAdminChallenge = () => (req, res, next) => {
    challengeUtils.solveIf(challenges.registerAdminChallenge, () => {
        return req.body && req.body.role === security.roles.admin;
    });
    next();
};
exports.passwordRepeatChallenge = () => (req, res, next) => {
    challengeUtils.solveIf(challenges.passwordRepeatChallenge, () => { return req.body && req.body.passwordRepeat !== req.body.password; });
    next();
};
exports.accessControlChallenges = () => ({ url }, res, next) => {
    challengeUtils.solveIf(challenges.scoreBoardChallenge, () => { return utils.endsWith(url, '/1px.png'); });
    challengeUtils.solveIf(challenges.web3SandboxChallenge, () => { return utils.endsWith(url, '/11px.png'); });
    challengeUtils.solveIf(challenges.adminSectionChallenge, () => { return utils.endsWith(url, '/19px.png'); });
    challengeUtils.solveIf(challenges.tokenSaleChallenge, () => { return utils.endsWith(url, '/56px.png'); });
    challengeUtils.solveIf(challenges.privacyPolicyChallenge, () => { return utils.endsWith(url, '/81px.png'); });
    challengeUtils.solveIf(challenges.extraLanguageChallenge, () => { return utils.endsWith(url, '/tlh_AA.json'); });
    challengeUtils.solveIf(challenges.retrieveBlueprintChallenge, () => { return utils.endsWith(url, cache.retrieveBlueprintChallengeFile); });
    challengeUtils.solveIf(challenges.securityPolicyChallenge, () => { return utils.endsWith(url, '/security.txt'); });
    challengeUtils.solveIf(challenges.missingEncodingChallenge, () => { return utils.endsWith(url.toLowerCase(), '%f0%9f%98%bc-%23zatschi-%23whoneedsfourlegs-1572600969477.jpg'); });
    challengeUtils.solveIf(challenges.accessLogDisclosureChallenge, () => { return url.match(/access\.log(0-9-)*/); });
    next();
};
exports.errorHandlingChallenge = () => (err, req, { statusCode }, next) => {
    challengeUtils.solveIf(challenges.errorHandlingChallenge, () => { return err && (statusCode === 200 || statusCode > 401); });
    next(err);
};
exports.jwtChallenges = () => (req, res, next) => {
    if (challengeUtils.notSolved(challenges.jwtUnsignedChallenge)) {
        jwtChallenge(challenges.jwtUnsignedChallenge, req, 'none', /jwtn3d@/);
    }
    if (utils.isChallengeEnabled(challenges.jwtForgedChallenge) && challengeUtils.notSolved(challenges.jwtForgedChallenge)) {
        jwtChallenge(challenges.jwtForgedChallenge, req, 'HS256', /rsa_lord@/);
    }
    next();
};
exports.serverSideChallenges = () => (req, res, next) => {
    if (req.query.key === 'tRy_H4rd3r_n0thIng_iS_Imp0ssibl3') {
        if (challengeUtils.notSolved(challenges.sstiChallenge) && req.app.locals.abused_ssti_bug === true) {
            challengeUtils.solve(challenges.sstiChallenge);
            res.status(204).send();
            return;
        }
        if (challengeUtils.notSolved(challenges.ssrfChallenge) && req.app.locals.abused_ssrf_bug === true) {
            challengeUtils.solve(challenges.ssrfChallenge);
            res.status(204).send();
            return;
        }
    }
    next();
};
function jwtChallenge(challenge, req, algorithm, email) {
    const token = utils.jwtFrom(req);
    if (token) {
        const decoded = jws_1.default.decode(token) ? jwt.decode(token) : null;
        jwt.verify(token, security.publicKey, (err, verified) => {
            if (err === null) {
                challengeUtils.solveIf(challenge, () => { return hasAlgorithm(token, algorithm) && hasEmail(decoded, email); });
            }
        });
    }
}
function hasAlgorithm(token, algorithm) {
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
    return token && header && header.alg === algorithm;
}
function hasEmail(token, email) {
    return token?.data?.email?.match(email);
}
exports.databaseRelatedChallenges = () => (req, res, next) => {
    if (challengeUtils.notSolved(challenges.changeProductChallenge) && products.osaft) {
        changeProductChallenge(products.osaft);
    }
    if (challengeUtils.notSolved(challenges.feedbackChallenge)) {
        feedbackChallenge();
    }
    if (challengeUtils.notSolved(challenges.knownVulnerableComponentChallenge)) {
        knownVulnerableComponentChallenge();
    }
    if (challengeUtils.notSolved(challenges.weirdCryptoChallenge)) {
        weirdCryptoChallenge();
    }
    if (challengeUtils.notSolved(challenges.typosquattingNpmChallenge)) {
        typosquattingNpmChallenge();
    }
    if (challengeUtils.notSolved(challenges.typosquattingAngularChallenge)) {
        typosquattingAngularChallenge();
    }
    if (challengeUtils.notSolved(challenges.hiddenImageChallenge)) {
        hiddenImageChallenge();
    }
    if (challengeUtils.notSolved(challenges.supplyChainAttackChallenge)) {
        supplyChainAttackChallenge();
    }
    if (challengeUtils.notSolved(challenges.dlpPastebinDataLeakChallenge)) {
        dlpPastebinDataLeakChallenge();
    }
    if (challengeUtils.notSolved(challenges.csafChallenge)) {
        csafChallenge();
    }
    next();
};
function changeProductChallenge(osaft) {
    let urlForProductTamperingChallenge = null;
    void osaft.reload().then(() => {
        for (const product of config_1.default.get('products')) {
            if (product.urlForProductTamperingChallenge !== undefined) {
                urlForProductTamperingChallenge = product.urlForProductTamperingChallenge;
                break;
            }
        }
        if (urlForProductTamperingChallenge) {
            if (!utils.contains(osaft.description, `${urlForProductTamperingChallenge}`)) {
                if (utils.contains(osaft.description, `<a href="${config_1.default.get('challenges.overwriteUrlForProductTamperingChallenge')}" target="_blank">More...</a>`)) {
                    challengeUtils.solve(challenges.changeProductChallenge);
                }
            }
        }
    });
}
function feedbackChallenge() {
    feedback_1.FeedbackModel.findAndCountAll({ where: { rating: 5 } }).then(({ count }) => {
        if (count === 0) {
            challengeUtils.solve(challenges.feedbackChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to retrieve feedback details. Please try again');
    });
}
function knownVulnerableComponentChallenge() {
    feedback_1.FeedbackModel.findAndCountAll({
        where: {
            comment: {
                [sequelize_1.Op.or]: knownVulnerableComponents()
            }
        }
    }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.knownVulnerableComponentChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
    complaint_1.ComplaintModel.findAndCountAll({
        where: {
            message: {
                [sequelize_1.Op.or]: knownVulnerableComponents()
            }
        }
    }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.knownVulnerableComponentChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
}
function knownVulnerableComponents() {
    return [
        {
            [sequelize_1.Op.and]: [
                { [sequelize_1.Op.like]: '%sanitize-html%' },
                { [sequelize_1.Op.like]: '%1.4.2%' }
            ]
        },
        {
            [sequelize_1.Op.and]: [
                { [sequelize_1.Op.like]: '%express-jwt%' },
                { [sequelize_1.Op.like]: '%0.1.3%' }
            ]
        }
    ];
}
function weirdCryptoChallenge() {
    feedback_1.FeedbackModel.findAndCountAll({
        where: {
            comment: {
                [sequelize_1.Op.or]: weirdCryptos()
            }
        }
    }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.weirdCryptoChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
    complaint_1.ComplaintModel.findAndCountAll({
        where: {
            message: {
                [sequelize_1.Op.or]: weirdCryptos()
            }
        }
    }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.weirdCryptoChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
}
function weirdCryptos() {
    return [
        { [sequelize_1.Op.like]: '%z85%' },
        { [sequelize_1.Op.like]: '%base85%' },
        { [sequelize_1.Op.like]: '%hashids%' },
        { [sequelize_1.Op.like]: '%md5%' },
        { [sequelize_1.Op.like]: '%base64%' }
    ];
}
function typosquattingNpmChallenge() {
    feedback_1.FeedbackModel.findAndCountAll({ where: { comment: { [sequelize_1.Op.like]: '%epilogue-js%' } } }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.typosquattingNpmChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
    complaint_1.ComplaintModel.findAndCountAll({ where: { message: { [sequelize_1.Op.like]: '%epilogue-js%' } } }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.typosquattingNpmChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
}
function typosquattingAngularChallenge() {
    feedback_1.FeedbackModel.findAndCountAll({ where: { comment: { [sequelize_1.Op.like]: '%anuglar2-qrcode%' } } }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.typosquattingAngularChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
    complaint_1.ComplaintModel.findAndCountAll({ where: { message: { [sequelize_1.Op.like]: '%anuglar2-qrcode%' } } }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.typosquattingAngularChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
}
function hiddenImageChallenge() {
    feedback_1.FeedbackModel.findAndCountAll({ where: { comment: { [sequelize_1.Op.like]: '%pickle rick%' } } }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.hiddenImageChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
    complaint_1.ComplaintModel.findAndCountAll({ where: { message: { [sequelize_1.Op.like]: '%pickle rick%' } } }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.hiddenImageChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
}
function supplyChainAttackChallenge() {
    feedback_1.FeedbackModel.findAndCountAll({ where: { comment: { [sequelize_1.Op.or]: eslintScopeVulnIds() } } }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.supplyChainAttackChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
    complaint_1.ComplaintModel.findAndCountAll({ where: { message: { [sequelize_1.Op.or]: eslintScopeVulnIds() } } }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.supplyChainAttackChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
}
function eslintScopeVulnIds() {
    return [
        { [sequelize_1.Op.like]: '%eslint-scope/issues/39%' },
        { [sequelize_1.Op.like]: '%npm:eslint-scope:20180712%' }
    ];
}
function dlpPastebinDataLeakChallenge() {
    feedback_1.FeedbackModel.findAndCountAll({
        where: {
            comment: { [sequelize_1.Op.and]: dangerousIngredients() }
        }
    }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.dlpPastebinDataLeakChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
    complaint_1.ComplaintModel.findAndCountAll({
        where: {
            message: { [sequelize_1.Op.and]: dangerousIngredients() }
        }
    }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.dlpPastebinDataLeakChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
}
function csafChallenge() {
    feedback_1.FeedbackModel.findAndCountAll({ where: { comment: { [sequelize_1.Op.like]: '%' + config_1.default.get('challenges.csafHashValue') + '%' } } }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.csafChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
    complaint_1.ComplaintModel.findAndCountAll({ where: { message: { [sequelize_1.Op.like]: '%' + config_1.default.get('challenges.csafHashValue') + '%' } } }).then(({ count }) => {
        if (count > 0) {
            challengeUtils.solve(challenges.csafChallenge);
        }
    }).catch(() => {
        throw new Error('Unable to get data for known vulnerabilities. Please try again');
    });
}
function dangerousIngredients() {
    return config_1.default.get('products')
        .flatMap((product) => product.keywordsForPastebinDataLeakChallenge)
        .filter(Boolean)
        .map((keyword) => {
        return { [sequelize_1.Op.like]: `%${keyword}%` };
    });
}
//# sourceMappingURL=verify.js.map