"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
exports.api = express_1.Router();
exports.api.all("/", (req, res) => {
    res.send("OK");
});
exports.default = exports.api;
