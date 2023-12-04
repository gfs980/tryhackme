import { Document, Schema, model } from 'mongoose';

interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  priority: string;
  createdBy: Schema.Types.ObjectId;
}

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const TaskModel = model<ITask>('Task', TaskSchema);

export default TaskModel;
