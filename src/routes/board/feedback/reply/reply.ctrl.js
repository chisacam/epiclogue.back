import { Reply, Feedback } from '../../../../models'
/* 
  This is reply router.
  base url: /:userId/boards/:boardId/reply
*/

// 대댓글 생성
export const postReply = async (req, res, next) => {
  const replyForm = {
    writer: res.locals.uid,
    boardId: req.params.boardId,
    parentId: req.params.feedbackId,
    replyBody: req.body.replyBody,
  }

  try {
    const replyData = await Reply.create(replyForm)
    console.log(`[INFO] 유저 ${res.locals.uid} 가 댓글 ${replyData._id} 를 작성했습니다.`)
    await Feedback.getReply(req.params.feedbackId, replyData._id)
    const newerReplyData = await Reply.getByParentId(replyForm.parentId)
    return res.status(201).json({
      result: 'ok',
      data: newerReplyData,
    })
  } catch (e) {
    console.error(`[Error] ${e}`)
    return res.status(500).json({
      result: 'error',
      message: e.message,
    })
  }
}

// 댓글 하위의 대댓글 뷰
export const getReplys = async (req, res, next) => {
  const feedbackId = req.params.feedbackId

  try {
    const replyData = await Reply.getByParentId(feedbackId)
    console.log(`[INFO] 유저 ${res.locals.uid} 가 피드백 ${feedbackId} 하위의 댓글(들)을 열람합니다.`)
    return res.status(200).json({
      result: 'ok',
      data: replyData,
    })
  } catch (e) {
    console.error(`[Error] ${e}`)
    return res.status(500).json({
      result: 'error',
      message: e.message,
    })
  }
}

export const editReply = async (req, res, next) => {
  const newForm = {
    replyId: req.params.replyId,
    newReplyBody: req.body.newReplyBody,
  }

  try {
    const patch = await Reply.update(newForm)
    if (patch.ok === 1) {
      if (patch.n === 1 && patch.n === patch.nModified) {
        console.log(`[INFO] 유저 ${res.locals.uid} 가 댓글 ${req.params.replyId} 을 수정했습니다.`)
      } else if (patch.n === 0) {
        return res.status(404).json({
          result: 'error',
          message: '존재하지 않는 데이터에 접근했습니다.',
        })
      }
      const newerData = await Reply.getByParentId(req.params.feedbackId)
      return res.status(200).json({
        result: 'ok',
        data: newerData,
      })
    } else {
      console.warn(`[WARN] 유저 ${res.locals.uid}가 댓글 ${req.params.replyId} 의 수정을 시도했으나 실패했습니다.`)
      return res.status(500).json({
        result: 'error',
        message: '예기치 않은 오류가 발생했습니다.',
      })
    }
  } catch (e) {
    console.error(`[Error] ${e}`)
    return res.status(500).json({
      result: 'error',
      message: e.message,
    })
  }
}

export const deleteReply = async (req, res, next) => {
  try {
    const deletion = await Reply.delete(req.params.replyId, { parentId: 1 })
    if (deletion.ok === 1) {
      console.log(`[INFO] 유저 ${res.locals.uid} 가 댓글 ${req.params.replyId} 을 삭제했습니다.`)  
      if (deletion.n !== 1) {
        return res.status(404).json({
          result: 'error',
          message: '존재하지 않는 데이터에 접근하려 했습니다.',
        })
      }
      const newerReplyData = await Reply.getByParentId(req.params.feedbackId)
      return res.status(200).json({
        result: 'ok',
        data: newerReplyData,
      })
    }
  } catch (e) {
    console.error(`[Error] ${e}`)
    return res.status(500).json({
      result: 'error',
      message: e.message,
    })
  }
}