const express = require("express");
const app = express();

const port = 8080;

app.listen(port, function () {
    console.log(`listening on ${port}`)
});

app.get('/pet', function (req, res) {
    res.send("펫 용품 쇼핑할 수 있는 페이지입니다.")
});

app.get('/beauty', function (req, res) {
    res.send("뷰티 용품 쇼핑할 수 있는 페이지입니다.")
});