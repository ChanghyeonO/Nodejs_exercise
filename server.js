const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require('mongodb').MongoClient;
const port = 8080;

let db;
MongoClient.connect('mongodb+srv://colajelly:Jimin2448@cluster0.2knbyz0.mongodb.net/?retryWrites=true&w=majority', function (err, client) {
    //연결되면 할일
    if (err) {
        return console.log(err)
    };

    db = client.db('todoapp');

    db.collection('post').insertOne({ name: "changhyeon", age: 25 }, function (err, result) {
        console.log('저장완료');
    });

    app.listen(port, function () {
        console.log(`listening on ${port}`)
    });


    app.post('/add', function (req, res) {
        res.send('전송완료!')
        db.collection('post').insertOne({ name: req.body.title, date: req.body.date }, function (err, result) {
            console.log('저장완료!')
        })
    });


})


app.get('/pet', function (req, res) {
    res.send("펫 용품 쇼핑할 수 있는 페이지입니다.")
});

app.get('/beauty', function (req, res) {
    res.send("뷰티 용품 쇼핑할 수 있는 페이지입니다.")
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html")
});

app.get('/write', function (req, res) {
    res.sendFile(__dirname + "/write.html")
});

