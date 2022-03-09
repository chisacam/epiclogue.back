import '../env/env'
import dayjs from 'dayjs'
import { createClient } from 'redis'
import { logger } from '../configs/winston'

export const setRedisClient = async (client) => {
  await client.connect()
}

const client = createClient({
  url: process.env.NODE_ENV === 'test' ? process.env.REDIS_TEST_URL : process.env.REDIS_URL,
})

client.on('connect', () => {
  console.log(`[RedisConnect] Successfully connected cache server`)
})

client.on('error', err => {
  logger.error(`[RedisError] ${dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss Z')} ${err}`)
})

/**
 * Get/Set
 *  K: req.session.id
 *  V: JSON.stringify({ userObjectId, isMember, accessCount, accessToken })
 */
export default client