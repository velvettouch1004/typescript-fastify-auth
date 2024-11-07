import * as Yup from "yup";

export const emailSchema = () => {
  return Yup.string().email().max(150).required();
};

export const passwordSchema = () => {
  return Yup.string()
    .min(8)
    .max(100)
    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)
    .required();
};

export const nameSchema = () => {
  return Yup.string().max(50).required();
};

export const updateSchema = () => {
  return Yup.boolean().required();
};

export const titleSchema = () => {
  return Yup.string().max(150).required();
};

export const descriptionSchema = () => {
  return Yup.string().max(1000).required();
};

export const categorySchema = () => {
  return Yup.string().required();
};

export const difficultySchema = () => {
  return Yup.string().required();
};

export const estimationSchema = () => {
  return Yup.number()
    .test("positive", "invalid_estimation", (value) => value > 0)
    .required();
};

export const publicSchema = () => {
  return Yup.boolean();
};

export const lessonsSchema = () => {
  return Yup.array().of(Yup.object()).min(1);
};

export const unitsSchema = () => {
  return Yup.array().of(Yup.object()).min(1);
};

export const coursValidators = {
  title: titleSchema(),
  description: descriptionSchema(),
  category: categorySchema(),
  difficulty: difficultySchema(),
  estimation: estimationSchema(),
  public: publicSchema(),
};
