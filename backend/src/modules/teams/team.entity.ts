import { Schema, model } from 'mongoose';
import { BaseEntity } from '../../shared/utils/base.entity';

export interface ITeam extends BaseEntity {
  name: string;
  description: string;
  leaderId: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
  projects: Schema.Types.ObjectId[];
}

const teamSchema = new Schema<ITeam>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    description: { 
      type: String, 
      required: true 
    },
    leaderId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    members: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    projects: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Project' 
    }]
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

// Indexes for faster queries
teamSchema.index({ name: 1 });
teamSchema.index({ leaderId: 1 });

// Virtual populate for leader
teamSchema.virtual('leader', {
  ref: 'User',
  localField: 'leaderId',
  foreignField: '_id',
  justOne: true
});

export const Team = model<ITeam>('Team', teamSchema);
