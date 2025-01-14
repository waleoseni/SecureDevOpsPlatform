"use strict";
/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
module.exports = function serveLogFiles() {
    return ({ params }, res, next) => {
        const file = params.file;
        if (!file.includes('/')) {
            res.sendFile(path.resolve('logs/', file));
        }
        else {
            res.status(403);
            next(new Error('File names cannot contain forward slashes!'));
        }
    };
};
//# sourceMappingURL=logfileServer.js.map