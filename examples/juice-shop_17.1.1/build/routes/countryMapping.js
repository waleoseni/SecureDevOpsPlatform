"use strict";
/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../lib/logger"));
module.exports = function countryMapping(config = require('config')) {
    return (req, res) => {
        try {
            const countryMapping = config.get('ctf.countryMapping');
            if (!countryMapping) {
                throw new Error('No country mapping found!');
            }
            else {
                res.send(countryMapping);
            }
        }
        catch (err) {
            logger_1.default.warn('Country mapping was requested but was not found in the selected config file. Take a look at the fbctf.yml config file to find out how to configure the country mappings required by FBCTF.');
            res.status(500).send();
        }
    };
};
//# sourceMappingURL=countryMapping.js.map