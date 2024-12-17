"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapTokens = exports.transferToken = exports.mintTokenTo = exports.mintToken = exports.launchToken = exports.getTokenMarketData = void 0;
const getTokenMarketData = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getTokenMarketData = getTokenMarketData;
const launchToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.launchToken = launchToken;
const mintToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.mintToken = mintToken;
const mintTokenTo = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.mintTokenTo = mintTokenTo;
const transferToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.transferToken = transferToken;
const swapTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.swapTokens = swapTokens;
