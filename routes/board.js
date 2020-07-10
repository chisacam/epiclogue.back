const express = require("express");
const router = express.Router();
const { verifyToken } = require("./authorization");
require("dotenv").config();
const Board = require("../models/board");
const Reply = require('../models/reply');
const User = require('../models/users');
const upload = require('./multer');

router.get('/posting', (req, res) => {
  res.status(200).json({
    msg: "Server is on work"
  })
})

router.post("/posting", verifyToken, async function (req, res, next) {
  // console.log(sessionStorage.getItem('uid'));
  const uid = res.locals.uid;
  const boardTitle = req.body.boardTitle;
  const boardBody = req.body.boardBody;
  let boardImg = [];
  // for (let i = 0; i < req.files.length; i++) {
  //   boardImg.push(req.files[i].location);
  // }
  const category = req.body.category;
  const pub = req.body.pub;
  const writeDate = req.body.writeDate;
  const language = req.body.language;

  const result = await Board.create({
    uid,
    boardTitle,
    boardBody,
    boardImg,
    category,
    pub,
    writeDate,
    language,
    likeCount: 0
  });
  console.log(result)
  if (result) {
    res.status(201).json({
      result: 'ok',
      data: result
    })
  } else {
    // 서버, DB, 요청 데이터 이상 등 에러 상세화 필요
    res.status(401).json({
      result: 'error'
    })
  }
});

router.get('/deleteBoard/:buid', verifyToken, async function(req, res, next) {
  const buid = req.params.buid;
  const result = await Board.removeArticle(buid);
  res.status(201).json({
    result:'ok'
  })
})

router.get('/editBoard/:buid', verifyToken, async function (req, res, next) {
  const buid = req.params.buid;
  const result = await Board.getArticle(buid);
  console.log(result)

  res.status(201).json({
    result:'ok',
    data: result
  })
})

router.post("/editBoard", verifyToken, async function (req, res, next) {
  const updateData = {
    uid: res.locals.uid,
    boardId: req.body.boardId,
    boardTitle: req.body.boardTitle,
    boardBody: req.body.boardBody,  
    // boardImg: req.files.boardImg,
    category: req.body.category,
    pub: req.body.pub,
    // writeDate: req.body.writeDate,
    language: req.body.language
  }

  const query = await Board.updateArticle(updateData);
  console.log(JSON.stringify(query))
  if (true) {
    res.status(201).json({
      result: 'ok'
    });
  } else {
    res.status(401).json({
      result: 'error',
      reason: query.reason
    })
  }
});

/* API 미정의 */
router.post("/translate", verifyToken, async function (req, res, next) {
  
});

router.post("/comment", verifyToken, async function (req, res, next) {
  const commentData = {
    replyBody: req.body.replyBody,
    boardUid: req.body.boardUid,
    replyWriteDate: Date.now
  }

  const result = Reply.create(commentData);
  if (result) {
    res.status(201).json({
      result: 'ok'
    })
  } else {
    /* 댓글 상황에 따라 다르게 처리
    1. 원문 삭제
    2. 서버 오류
    3. DB 오류
    4. 클라이언트 통신 불가
     */
    res.status(401).json({
      result: 'error',
      reason: '코드 재작성 필요'
    })
  }
  
});

/* 유저마다 다르게 받아야 함 */
router.get("/postlist", verifyToken, async function (req, res, next) {
  const boardList = await Board.findAll();
  const result = new Array();
  for(const data of boardList) {
    let userInfo = await User.getUserInfo(data.uid);
    result.push({
      boardUid:data._id,
      thumbPath:data.boardImg[0],
      userNick: userInfo.nickname,
      pub:data.pub,
      category:data.category
    });
  }
  if(result) {
    res.status(201).json({
      result:'ok',
      data: result
    });
  } else {
    res.status(401).json({
      result:'error',
      reason: 'something is wrong'
    })
  }
});

router.get("/view/:buid", verifyToken, async (req, res, next) => {
  const buid = req.params.buid;
  const boardData = await Board.getArticle(buid);
  console.log(boardData)
  res.status(201).json({
    result: 'ok',
    data: boardData
  });
})

module.exports = router;
