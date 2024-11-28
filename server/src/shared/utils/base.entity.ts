import { Document } from 'mongoose';

export interface BaseEntity extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export class BaseEntityClass {
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
