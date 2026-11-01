import { neon, types } from '@neondatabase/serverless'

// Global parsers — neon()'s per-client `types` option is ignored by the HTTP driver.
// bigint → number (amounts fit easily), timestamptz → ISO string (matches lib/types)
const parseTimestamptz = types.getTypeParser(1184)
types.setTypeParser(20, Number)
types.setTypeParser(1184, (v: string) => parseTimestamptz(v).toISOString())

export function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set in .env.local')
  return neon(url)
}
