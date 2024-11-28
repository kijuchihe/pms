"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'],
        default: 'TODO',
        required: true
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM',
        required: true,
    },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    assigneeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
// Add index for faster queries
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assigneeId: 1 });
exports.Task = (0, mongoose_1.model)('Task', taskSchema);
