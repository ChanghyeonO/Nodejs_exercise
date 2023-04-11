const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient;
const port = 8080;
app.set('view engine', 'ejs');


app.use('/public', express.static('public'));


let db;
MongoClient.connect('mongodb+srv://colajelly:Jimin2448@cluster0.2knbyz0.mongodb.net/?retryWrites=true&w=majority', function (err, client) {
    //연결되면 할일
    if (err) {
        return console.log(err)
    };

    db = client.db('todoapp');

    // db.collection('post').insertOne({ name: "changhyeon", age: 25 }, function (err, result) {
    //     console.log('저장완료');
});

app.listen(port, function () {
    console.log(`listening on ${port}`)
});

app.post('/add', function (req, res) {
    //누가 폼에서 /add로 POST 요청하면 (req.body에 게시물 데이터 담겨옴)
    res.send('전송완료!')
    db.collection('counter').findOne({ name: "게시물갯수" }, function (err, result) {
        //DB.counter 내의 총 게시물 갯수를 찾음
        console.log(result.totalPost);
        let countPost = result.totalPost;
        //총 게시물 갯수를 변수에 저장

        db.collection('post').insertOne({ _id: countPost + 1, name: req.body.title, date: req.body.date }, function (err, result) {
            //DB.post에 새게시물 기록함( id는 countPost에다가 1 더한 걸 발행, 제목 저장 ,날짜 저장 )
            console.log('저장완료!');
            //counter라는 컬렉션에 있는 totalPost 라는 항목도 1 증가시켜야 한다. 
            db.collection('counter').updateOne({ name: '게시물갯수' }, { $inc: { totalPost: 1 } }, function (err, result) {
                if (err) {
                    return console.log(err)
                }
            })
            //완료되면 DB.counter 내의 총 게시물 갯수 + 1('counter'라는 컬렉션에 있던 이름이 '게시물갯수'인 것을 찾아 1을 inc해주는 코드.) 
        });
        //$set은 totalPost 값을 바꿀 때 사용한다.
        //$inc는 totalPost 값에 값을 추가할 때 사용한다.
        //ex> {$set : {totalPost : 바꿀값}}
        //ex> {$inc : {totalPost : 기존 값에 더해줄 값}}
    });

});


app.get('/pet', function (req, res) {
    res.send("펫 용품 쇼핑할 수 있는 페이지입니다.")
});

app.get('/beauty', function (req, res) {
    res.send("뷰티 용품 쇼핑할 수 있는 페이지입니다.")
});

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + "/views/index.ejs")
// });

// app.get('/write', function (req, res) {
//     res.sendFile(__dirname + "/views/write.ejs")
// });

app.get('/', function (req, res) {
    res.render("index.ejs")
});

app.get('/write', function (req, res) {
    res.render("write.ejs")
});

app.get('/list', function (req, res) {
    //몽고디비 post라는 collection 안의 모든 데이터를 가지고 오게 함
    db.collection('post').find().toArray(function (err, result) {
        console.log(result);
        res.render('list.ejs', { posts: result });
    });

});

app.delete('/delete', function (req, res) {
    console.log(req.body)
    req.body._id = parseInt(req.body._id);
    //요청.body에 담겨온 게시물 번호를 가진 글을 db에서 찾아서 삭제하기.
    db.collection('post').deleteOne(req.body, function (err, result) {
        console.log("삭제완료");
        res.status(200).send({ message: "성공했습니다" });
        //응답코드를 보내주세용 (200)은 요청이 성공했다는 뜻.
        //(400)은 요청이 실패했다는 뜻.
    })
})

app.get('/detail/:id', function (req, res) {
    //누군가 detail/~로 접속하면
    db.collection('post').findOne({ _id: parseInt(req.params.id) }, function (err, result) {
        //DB에서 {_id: ~} 인 게시물을 찾는다.
        console.log(result)
        res.render('detail.ejs', { data: result })
        //찾은 결과를 detail.ejs로 보낸다.
    })
})