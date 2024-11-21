import mongoose, { Schema, Document } from 'mongoose';

export enum TeamRole {
  LEADER = 'LEADER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER'
}

export interface ITeamMember extends Document {
  teamId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: TeamRole;
  joinedAt: Date;
  invitedBy: mongoose.Types.ObjectId;
}

const teamMemberSchema = new Schema<ITeamMember>({
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: Object.values(TeamRole),
    default: TeamRole.MEMBER,
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Create a compound unique index to prevent duplicate team memberships
teamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
