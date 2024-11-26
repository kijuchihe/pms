import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../auth/auth.entity';
import { populate } from 'dotenv';

export interface ITeam extends Document {
  name: string;
  description?: string;
  leaderId: mongoose.Types.ObjectId;
  projects: mongoose.Types.ObjectId[];
  memberIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  leaderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project',
  }],
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Virtual for team members through TeamMember model
teamSchema.virtual('members', {
  ref: 'TeamMember',
  localField: '_id',
  foreignField: 'teamId'
});

// Virtual for team leader details
teamSchema.virtual('leader', {
  ref: 'User',
  localField: 'leaderId',
  foreignField: '_id',
  justOne: true
});



export const Team = mongoose.model<ITeam>('Team', teamSchema);
