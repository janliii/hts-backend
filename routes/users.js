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
router.post("/chat", async (req, res) => {
  const { body } = req;
  const chatResp = await handleMessage(body);
  res.send(chatResp);
  client.end;
});

module.exports = router;
