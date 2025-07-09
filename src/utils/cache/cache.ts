interface CacheItem<T> {
  value: T
  timestamp: number
  ttl: number
  accessCount: number
  lastAccessed: number
}

interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of items
  cleanupInterval?: number // Cleanup interval in milliseconds
}

class Cache<T = unknown> {
  private cache = new Map<string, CacheItem<T>>()
  private options: Required<CacheOptions>
  private cleanupTimer?: NodeJS.Timeout

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize ?? 100,
      cleanupInterval: options.cleanupInterval ?? 60 * 1000 // 1 minute
    }
    
    this.startCleanup()
  }

  set(key: string, value: T, ttl?: number): void {
    const item: CacheItem<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl ?? this.options.ttl,
      accessCount: 0,
      lastAccessed: Date.now()
    }

    // Remove oldest item if cache is full
    if (this.cache.size >= this.options.maxSize) {
      const oldestKey = this.getOldestKey()
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, item)
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    // Update access statistics
    item.accessCount++
    item.lastAccessed = Date.now()

    return item.value
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  // Get cache statistics
  getStats(): {
    size: number;
    maxSize: number;
    totalAccessCount: number;
    averageAccessCount: number;
    expiredItems: number;
  } {
    const items = Array.from(this.cache.values())
    const now = Date.now()
    
    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      totalAccessCount: items.reduce((sum, item) => sum + item.accessCount, 0),
      averageAccessCount: items.length > 0 ? items.reduce((sum, item) => sum + item.accessCount, 0) / items.length : 0,
      expiredItems: items.filter(item => now - item.timestamp > item.ttl).length
    }
  }

  private getOldestKey(): string | null {
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed
        oldestKey = key
      }
    }

    return oldestKey
  }

  private cleanup(): void {
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.options.cleanupInterval)
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }
    this.cache.clear()
  }
}

// Specialized caches for different use cases
  ttl: 10 * 60 * 1000, // 10 minutes for API responses
  maxSize: 50
})

  ttl: 60 * 60 * 1000, // 1 hour for AI detection results
  maxSize: 100
})

  ttl: 24 * 60 * 60 * 1000, // 24 hours for user preferences
  maxSize: 20
})

// Cache decorator for functions
/**
 * Decorator that caches function results
 * @param cache - The cache instance to use for storing results
 * @param keyGenerator - Optional function to generate cache keys from function arguments
 * @returns Decorator function that wraps the original method with caching
 */
export function cached<T extends (...args: unknown[]) => unknown>(
  cache: Cache,
  keyGenerator?: (...args: Parameters<T>) => string
) {
  return function (target: unknown, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = function (...args: Parameters<T>) {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
      const cached = cache.get(key)
      
      if (cached !== null) {
        return cached
      }

      const result = method.apply(this, args)
      
      // Handle promises
      if (result instanceof Promise) {
        return result.then(value => {
          cache.set(key, value)
          return value
        })
      }

      cache.set(key, result)
      return result
    }
  }
} 