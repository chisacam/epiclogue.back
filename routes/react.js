import express from "express";
import react from "../models/react";
import user from "../models/users";
const router = express.Router({
  mergeParams: true,
});

/* 
  This is react router.
  base url: /:screenId/boards/:boardId/react
*/

router.get("/", async (req, res, next) => {
  const boardId = req.params.boardId;
  const _ReactData = [];

  try {
    const rawReactData = await react.getByBoardId(boardId);
    for (let data of rawReactData) {
      const userData = await user.getUserInfo(data.userId);

      const tempData = {
        userId: data.userId,
        userProfileImage: userData.profile || null,
        nickname: userData.nickname,
        type: data.type,
        createdAt: data.createdAt,
      };
      _ReactData.push(tempData);
    }
    return res.status(200).json({
      result: "ok",
      data: _ReactData,
    });
  } catch (e) {
    console.error(`[Error] ${e}`);
    return res.status(500).json({
      result: "error",
      message: e.message,
    });
  }
});

module.exports = router;
