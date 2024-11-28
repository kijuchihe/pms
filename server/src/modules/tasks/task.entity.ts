import { Schema, model } from 'mongoose';
import { BaseEntity } from '../../shared/utils/base.entity';

export interface ITask extends BaseEntity {
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: Date;
  assigneeId?: Schema.Types.ObjectId;
  projectId: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
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
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  {
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
  }
);

// Add index for faster queries
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assigneeId: 1 });

export const Task = model<ITask>('Task', taskSchema);
