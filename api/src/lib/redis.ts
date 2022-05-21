import Redis from 'ioredis';
export default function useRedis() {
	return new Redis(process.env.REDIS_URL, {
		tls: {
			rejectUnauthorized: false
		}
	});
}
