import { User, Board } from '../../models'

/* 
  This is search router.
  base url: /search
  OPTIONS: [ GET ]
*/

/* 검색 전 미리보기 기능 */
export const searchPreview = async (req, res, next) => {
  const queryString = req.query.q

  try {
    if (queryString[0] === '#') {
      // tag searching
      // const _query = queryString.slice(1, queryString.length)

      /* 태그 검색 쿼리 필요 */
    } else if (queryString[0] === '@') {
      // user searching
      const _query = queryString.slice(1, queryString.length)
      const userData = await User.getByQuery(_query)
      res.status(200).json(userData)
    } else {
      // title searching
      const boardData = await Board.getTitlesByQuery(queryString)
      res.status(200).json(boardData)
    }
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
}

/* 검색 화면 렌더링을 가정한 데이터 API */
export const searchResult = async (req, res, next) => {
  const queryString = req.query.q

  try {
    const boardData = await Board.getByQuery(queryString)
    console.log(`[INFO] 유저 ${res.locals.uid} 가 ${queryString} 을 검색했습니다.`)
    return res.status(200).json(boardData)
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
}
