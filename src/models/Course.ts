import mongoose, { Schema } from "mongoose";
import { ICourse } from "../interfaces/course";

const CourseSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    estimation: { type: Number, required: true },
    public: { type: Boolean, required: true },
    thumbnail: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    lessons: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    units: [{ title: { type: String, required: true } }],
    quiz: [{ question: { type: String, required: true } }],
    contents: [
      {
        title: { type: String, required: true },
        link: {
          id: { type: String, required: true },
          url: { type: String, required: true },
        },
      },
    ],
    prerequisties: [
      { courseId: { type: Schema.Types.ObjectId, ref: "Course" } },
    ],
    enableUnitProgressRequirement: { type: Boolean, default: false },
    awardCompletionCertificate: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
