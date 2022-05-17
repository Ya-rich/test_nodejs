import express from "express"
import path from 'path'
import bodyParser from 'body-parser'
import * as user from './models/user'
import jwt from 'jsonwebtoken'
import {check, validationResult} from 'express-validator'
import {validateAuthToken} from "./middleware/authMiddleware";

const jwtSecredKey = 'Dmitry\'s secret corporation';
const PORT = 3000;

const app = express();

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server has been started on port: ${PORT}...`)
});

app.use('/', express.static(path.resolve("./static")));


app.post(
  '/register',
  [
    check('email', 'Некоректный email').isEmail(),
    check('password', 'Минимальная длинна пароля 6 символов ').isLength({min: 6}),
    check('firstName', 'Некоректный firstName').notEmpty().isLength({min: 2}),
    check('lastName', 'Некоректный lastName').notEmpty().isLength({min: 2})
  ],
  (req, res) => {

    try {
      const {email, password, firstName, lastName} = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()[0].msg
        })
      }

      const userList = user.ReadUserFile();
      if (userList.find((candidate) => candidate.email === email)) {
        return res.status(400).json({message: 'Пользователь с таким email уже существует'})
      }

      let id = userList.length;

      const newUser = {...req.body, id: id};
      userList.push(newUser);
      user.SaveUser(userList)

    } catch (e) {
      res.status(500).json({
        errors: e.message,
        message: "что-то пошло не так"
      })
    }
    res.send({success: true})
  });


app.post(
  '/login',
  [
    check('email', 'Введите корктный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль ').exists()
  ],
  (req, res) => {

    try {
      const {email, password} = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Некоректные данные при входе в систему'
        })
      }

      const userList = user.ReadUserFile();
      const loginMan = userList.find((candidate) => candidate.email === email && candidate.password === password);
      if (loginMan) {
        loginMan.token = jwt.sign(
          {userId: loginMan.id},
          jwtSecredKey,
          {expiresIn: '24h'}
        );
        delete loginMan.password;

        return res.send(loginMan);
      } else {
        return res.status(400).json({
          message: 'Пользователь не найден'
        })
      }

    } catch (e) {

      res.status(500).json({
        errors: e.message,
        message: "что-то пошло не так"
      })
    }
  });


//update profile
app.get('/user/:userId/profile',
  [
    validateAuthToken
  ],
  (req, res) => {
    const urlUserId = req.params.userId;
    const tokenUserId = req.user.userId;

    if (urlUserId === tokenUserId) {
      const userList = user.ReadUserFile();
      const loginMan = userList.find((candidate) => candidate.id === urlUserId);

      if (!loginMan) return res.status(404).json({
        message: "Пользователь не найден"
      });

      delete loginMan.password;
      return res.send(loginMan)
    }
    res.status(404).json({
      message: "Пользователь не авторизирован"
    });
  });

//profile
app.get('/profile', (req, res) => {

});





