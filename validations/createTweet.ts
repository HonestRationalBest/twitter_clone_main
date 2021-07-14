import { body } from "express-validator";

export const createTweetValidations = [
  body("text", "Введите text").isString().withMessage("Неверный тип данных"),
];
