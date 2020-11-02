import { CachedValue, Storage } from '@josephuspaye/stash';
import devalue from 'devalue';
import fs from 'fs';

/**
 * Deserialize the given cache data stored as a string
 */
function deserialize(cacheDataString: string) {
  return (0, eval)('(' + cacheDataString + ')');
}

/**
 * Serialize the given cache data to a string
 */
function serialize(cacheDataString: any) {
  return devalue(cacheDataString);
}

/**
 * Simple file-based cache storage for Stash.
 */
export class FileStorage<K, V> implements Storage<K, V> {
  private filePath: string;
  private bufferInMemory: boolean;
  private map?: Map<K, CachedValue<V>>;

  /**
   * Create a new file-based storage backend.
   */
  constructor({
    filePath,
    bufferInMemory,
  }: {
    filePath: string;
    bufferInMemory: boolean;
  }) {
    this.filePath = filePath;
    this.bufferInMemory = bufferInMemory;
  }

  private async getCache() {
    if (this.bufferInMemory && this.map) {
      return this.map;
    }

    let cacheDataString: string | undefined;

    try {
      const fd = await fs.promises.open(this.filePath, 'r');
      cacheDataString = await fd.readFile('utf-8');
      fd.close();
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    const cacheData: Map<K, CachedValue<V>> = cacheDataString
      ? deserialize(cacheDataString)
      : new Map<K, V>();

    if (this.bufferInMemory) {
      this.map = cacheData;
    }

    return cacheData;
  }

  async size() {
    return (await this.getCache()).size;
  }

  async has(key: K) {
    return (await this.getCache()).has(key);
  }

  async get(key: K) {
    return (await this.getCache()).get(key);
  }

  async set(key: K, cached: CachedValue<V>) {
    const cache = await this.getCache();
    cache.set(key, cached);
    return fs.promises.writeFile(this.filePath, serialize(cache));
  }

  async delete(key: K) {
    const cache = await this.getCache();
    const deleted = cache.delete(key);
    await fs.promises.writeFile(this.filePath, serialize(cache));
    return deleted;
  }

  async clearMatching(matcher: (key: K, cached: CachedValue<V>) => boolean) {
    const cache = await this.getCache();

    for (const [key, cached] of cache.entries()) {
      if (matcher(key, cached)) {
        cache.delete(key);
      }
    }

    return fs.promises.writeFile(this.filePath, serialize(cache));
  }

  async clear() {
    const cache = await this.getCache();
    cache.clear();
    return fs.promises.writeFile(this.filePath, serialize(cache));
  }
}
