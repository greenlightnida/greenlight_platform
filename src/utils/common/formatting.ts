/**
 * Common formatting utilities
 * Consolidated formatting functions used across the application
 */

// Date formatting cache for performance
const formatDateCache = new Map<string, string>();

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };

  const cacheKey = `${date.getTime()}-${JSON.stringify(defaultOptions || {})}`;
  
  const cached = formatDateCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const result = new Intl.DateTimeFormat('en-US', defaultOptions).format(date);

  // Cache management - limit cache size
  if (formatDateCache.size > 1000) {
    const iterator = formatDateCache.keys();
    const firstKey = iterator.next().value;
    if (firstKey) {
      formatDateCache.delete(firstKey);
    }
  }

  formatDateCache.set(cacheKey, result);
  return result;
};

// export 
// };

// export 
// };

// export 
//   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//   if (diffInSeconds < 60) {
//     return 'Just now';
//   }

//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60) {
//     return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
//   }

//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24) {
//     return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
//   }

//   const diffInDays = Math.floor(diffInHours / 24);
//   if (diffInDays < 7) {
//     return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
//   }

//   return formatDate(date);
// };

// export 
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));

//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// };

// export 
// };

// export 
//   return new Intl.NumberFormat('en-US', defaultOptions).format(number);
// };

// export 
// };

// export 
//   if (cleaned.length === 10) {
//     return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
//   }
  
//   if (cleaned.length === 11 && cleaned.startsWith('1')) {
//     return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
//   }
  
//   // Return original if can't format
//   return phone;
// };

// export 
// };

// export 
//   const last = lastName.charAt(0).toUpperCase();
//   return `${first}${last}`;
// };

// export 
// };

// export 
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const remainingSeconds = seconds % 60;

//   if (hours > 0) {
//     return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
//   }
  
//   return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
// };

// export 
//   if (items.length === 1) return items[0];
//   if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
//   const last = items.pop();
//   return `${items.join(', ')}, ${conjunction} ${last}`;
// };

// export 
//   return text.slice(0, maxLength - suffix.length) + suffix;
// };

// export 
// };

// export 
// };

// export 
// };

// export 
// };

// export 
// };

// Generate unique ID
  return (
    Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9)
  );
};

// Generate unique session ID with type and context
export const generateSessionId = (type: string = 'session', context?: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const contextPart = context ? `-${context.replace(/[^a-zA-Z0-9]/g, '')}` : '';
  return `${type}-${timestamp}-${random}${contextPart}`;
};

// Generate launch session ID with enhanced labeling
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const date = new Date().toISOString().split('T')[0]?.replace(/-/g, '') || '';
  return `launch-${date}-${timestamp}-${random}`;
};

// Generate work session ID with context
  return generateSessionId('work', context);
};

// Generate audit session ID
  return generateSessionId('audit');
};

// Generate protocol session ID
  return generateSessionId('protocol', protocolName);
};

// Validate session ID format
  const sessionIdPattern = /^[a-zA-Z]+-\d+(-[a-zA-Z0-9]+)*$/;
  return sessionIdPattern.test(sessionId);
};

// Extract session type from ID
  const match = sessionId.match(/^([a-zA-Z]+)-/);
  return match?.[1] || 'unknown';
};

// Extract timestamp from session ID
  const match = sessionId.match(/-(\d+)-/);
  return match?.[1] ? parseInt(match[1], 10) : null;
}; 