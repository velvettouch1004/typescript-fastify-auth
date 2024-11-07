import { FastifyReply } from "fastify";
import mongoose from "mongoose";
import { MultipartFile } from "@fastify/multipart";
import * as Yup from "yup";
import CourseModel from "../models/Course";
import { uploadFile, streamToBuffer } from "../utils/fileUpload";
import { FastifyRequestWithUserId } from "../interfaces/user";
import * as response from "../utils/responses";
import * as Validator from "../utils/validators";

const createValidator = Yup.object({
  title: Validator.titleSchema(),
  description: Validator.descriptionSchema(),
  category: Validator.categorySchema(),
  difficulty: Validator.difficultySchema(),
  estimation: Validator.estimationSchema(),
  public: Validator.publicSchema(),
});

interface UploadRequest extends FastifyRequestWithUserId {
  parts: () => AsyncIterableIterator<MultipartFile>;
}

export const createCourse = async (req: UploadRequest, res: FastifyReply) => {
  const userId = req.userId;
  const parts = req.parts();
  let fileResponse = null;
  const formData: Record<string, any> = {};
  for await (const part of parts) {
    if (part.file) {
      if (part.fieldname !== "thumbnail") {
        return res.code(400).send({ error: response.INVALID_INPUTS });
      }
      try {
        const fileName = part.filename;
        const extPos = fileName.lastIndexOf(".");
        const ext = extPos < 0 ? "" : fileName.slice(extPos);
        const newFileName = `${Date.now()}${ext}`;
        const buffer = await streamToBuffer(part.file);
        fileResponse = await uploadFile(newFileName, buffer);
      } catch (err) {
        console.log(err);
      }
    } else {
      formData[part.fieldname] = (part as MultipartFile & { value: any }).value;
    }
  }
  if (!createValidator.isValidSync(formData) || !fileResponse) {
    return res.code(400).send({ error: response.INVALID_INPUTS });
  }

  const course = new CourseModel({
    ...formData,
    userId,
    thumbnail: fileResponse,
  });
  try {
    await course.save();
    return res.code(201).send({ courseId: course.id });
  } catch (error) {
    req.log.error(error);
    console.log(error);
    return res.code(500).send({ error: response.INTERNAL_SERVER_ERROR });
  }
};

interface CourseRequest extends FastifyRequestWithUserId {
  params: { courseId: string };
}

export const getCourse = async (req: CourseRequest, res: FastifyReply) => {
  try {
    const userId = req.userId;
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.code(404).send({ error: response.NOT_FOUND });
    }
    const course = await CourseModel.findById(courseId).populate({
      path: "prerequisties.courseId",
      select: "title",
    });
    if (!course || course.userId.toString() !== userId) {
      res.code(404).send({ error: response.NOT_FOUND });
    }
    res.send({ data: course });
  } catch (err) {
    console.log(err);
    res.code(500).send({ error: response.INTERNAL_SERVER_ERROR });
  }
};

export const getCourses = async (
  req: FastifyRequestWithUserId,
  res: FastifyReply
) => {
  try {
    const userId = req.userId;
    const courses = await CourseModel.find(
      { userId },
      "title description category difficulty estimation public thumbnail published"
    );
    res.send({ courses });
  } catch (err) {
    console.log(err);
    res.code(500).send({ error: response.INTERNAL_SERVER_ERROR });
  }
};

interface EditRequest extends UploadRequest {
  params: { courseId: string };
}

export const editCourse = async (req: EditRequest, res: FastifyReply) => {
  try {
    const { courseId } = req.params;
    const parts = req.parts();
    const existingCourse = await CourseModel.findById(courseId);
    if (!existingCourse) {
      return res.code(404).send({ error: response.NOT_FOUND });
    }

    const files = [];
    const formData: Record<string, any> = {};
    for await (const part of parts) {
      if (part.file) {
        try {
          const fileName = part.filename;
          const extPos = fileName.lastIndexOf(".");
          const ext = extPos < 0 ? "" : fileName.slice(extPos);
          const newFileName = `${Date.now()}${ext}`;
          const buffer = await streamToBuffer(part.file);
          const file = await uploadFile(newFileName, buffer);
        } catch (err) {
          console.log(err);
        }
      } else {
        formData[part.fieldname] = (
          part as MultipartFile & { value: any }
        ).value;
      }
    }
  } catch (err) {
    console.log(err);
    res.code(500).send({ error: response.INTERNAL_SERVER_ERROR });
  }
};

interface RemoveRequest extends UploadRequest {
  params: { courseId: string };
}

export const removeCourse = async (req: RemoveRequest, res: FastifyReply) => {
  try {
    const userId = req.userId;
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.code(404).send({ error: response.NOT_FOUND });
    }
    await CourseModel.findOneAndDelete({
      _id: userId,
      courseId: courseId,
    });

    res.send({ data: "Successfully Deleted" });
  } catch (err) {
    console.log(err);
    res.code(500).send({ error: response.INTERNAL_SERVER_ERROR });
  }
};
