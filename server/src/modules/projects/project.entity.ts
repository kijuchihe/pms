import { Schema, model } from 'mongoose';
import { BaseEntity, BaseEntityClass } from '../../shared/utils/base.entity';

export interface IProject extends BaseEntity {
  name: string;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate: Date;
  endDate: Date;
  ownerId: Schema.Types.ObjectId;
  memberIds: Schema.Types.ObjectId[];
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'],
      default: 'NOT_STARTED',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      default: 'MEDIUM',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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
    toObject: {
      virtuals: true,
    }
  }
);

// Virtual populate for tasks
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'projectId',

});

projectSchema.virtual('owner', {
  ref: 'User',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});

projectSchema.virtual('members', {
  ref: 'User',
  localField: 'memberIds',
  foreignField: '_id',
});

export const Project = model<IProject>('Project', projectSchema);
