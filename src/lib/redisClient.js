import '../env/env'
import dayjs from 'dayjs'
import { createClient } from 'redis'
import { logger } from '../configs/winston'

const setRedisClient = async () => {
  console.log(process.env.REDIS_URL)
  const client = createClient({
    url: process.env.NODE_ENV === 'test' ? process.env.REDIS_TEST_URL : process.env.REDIS_URL,
  })

  await client.connect()

  client.on('connect', () => {
    console.log(`[RedisConnect] Successfully connected cache server`)
  })
  
  client.on('error', err => {
    logger.error(`[RedisError] ${dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss Z')} ${err}`)
  })

  return client
}

const redisClient = setRedisClient().then(client => client).catch(err => {
  console.log(err)
})

/**
 * Get/Set
 *  K: req.session.id
 *  V: JSON.stringify({ userObjectId, isMember, accessCount, accessToken })
 */
export default redisClient