const express = require('express');
const router = express.Router();
const connection = require('../database/index');

connection.connect();
/* GET home page. */
router.get('/', (req, res, next) => {
  connection.query('SELECT * FROM blog', (err, rows) => {
    if(err) next(err);

    res.render('list', { rows: rows });
  });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  let body = req.body;
  let id = body.id;
  let password = body.password;
  connection.query(`SELECT * FROM users WHERE id = '${id}'`, (err, rows) => {
    if(err) throw err;

    if(rows[0] == undefined) {
      res.send('<script>alert("아이디 또는 비밀번호가 다릅니다.");location.replace("/login");</script>');
    } else {
      if(rows[0].password != password) {
        res.send('<script>alert("아이디 또는 비밀번호가 다릅니다.");location.replace("/login");</script>');
      } else {
        res.send('로그인에 성공했습니다.');   // session 추가 
      }
    }
  })
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  let user = req.body.user;
  let id = req.body.id;
  let password = req.body.password;
  let password2 = req.body.password2;

  connection.query(`SELECT * FROM users WHERE id = '${id}'`, (err, rows) => {
    if(err) throw err;

    if(password != password2) {
      res.send('<script>alert("비밀번호가 틀립니다.");location.replace("/register");</script>');
    } else if(rows[0] != undefined) {
      res.send('<script>alert("아이디가 중복됩니다.");location.replace("/register");</script>');
    } else {
      connection.query(`INSERT INTO users(user, id, password) VALUES ('${user}', '${id}', '${password}')`, (err, result) => {
        if(err) throw err;

        res.send('<script>alert("계정이 생성되었습니다. 로그인 해주세요");location.replace("/");</script>');
      });
    }
  });
});

router.get('/write', (req, res, next) => {
  res.render('write');
});

module.exports = router;
