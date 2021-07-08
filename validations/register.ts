import { body } from "express-validator";

export const registerValidations = [
  body("email", "Введите email").isEmail().withMessage("Неверный email"),
  body("fullname", "Введите имя")
    .isString()
    .isLength({
      min: 2,
      max: 30,
    })
    .withMessage("Допустимое длина от 2 до 30"),
  body("username", "Введите логин")
    .isString()
    .isLength({
      min: 2,
      max: 30,
    })
    .withMessage("Допустимое длина от 2 до 30"),
  body("password", "Введите пароль")
    .isString()
    .isLength({
      min: 6,
    })
    .withMessage("Минимальная длина 6"),
];
