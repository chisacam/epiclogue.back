import { Board } from '../../models'

const checkSecondaryAllow = async (req, res, next) => {
  const { boardId } = req.body;

  const isAllowing = await Board.findOne({ _id: boardId }, { allowSecondaryCreation: 1 })

  if (isAllowing.allowSecondaryCreation == 1) {
    next()
  } else {
    console.log(`[INFO] 2차창작을 허용하지 않는 게시물 ${boardId} 에 대해 유저 ${res.locals.uid} 가 2차창작을 시도했습니다.`)
    return next(createError(400, '2차창작을 허용하지 않는 게시물입니다.'))
  }
}

export default checkSecondaryAllow