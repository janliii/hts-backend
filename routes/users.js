const express = require("express");
const router = express.Router();
const client = require("../connection.js");
const { handleMessage } = require("../chatbot.js");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get("/", (req, res) => {
  client.query(`Select * from users`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});
client.connect();

router.get("/:id", (req, res) => {
  client.query(
    `Select * from users where id=${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
  client.end;
});
client.connect();

router.post("/", (req, res) => {
  const user = req.body;
  let insertQuery = `insert into users(id, name) 
                     values(${user.id}, '${user.name}')`;

  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});

router.delete("/:id", (req, res) => {
  let insertQuery = `delete from users where id=${req.params.id}`;

  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Deletion was successful");
    } else {
      console.log(err.message);
    }
  });
  client.end;
});

//post message from the page
router.post("/chat", (req, res) => {
  const { body } = req;
  const resp = handleMessage(body);
  console.log(resp);
  console.log(handleMessage(body));
  res.send("Message sent successfully");
  // res.send(resp);

  client.end;
});

module.exports = router;
