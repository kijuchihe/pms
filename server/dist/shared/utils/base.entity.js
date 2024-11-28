"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntityClass = void 0;
class BaseEntityClass {
    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
exports.BaseEntityClass = BaseEntityClass;
