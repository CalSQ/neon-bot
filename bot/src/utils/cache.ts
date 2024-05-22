export function deleteRequireCache(includes: string) {
  for (const key in require.cache) {
    if (key.includes(includes)) {
      delete require.cache[key]
    }
  }
}
