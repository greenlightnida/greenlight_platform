import React from 'react';

// Icon mapping for different feature types and systems
export const IconMapping = {
  // System Icons
  'design-system': '🎨',
  'features': '⚡',
  'product': '📋',
  'governance': '🛡️',
  'monitoring': '📊',
  'analytics': '📈',
  'security': '🔒',
  'performance': '⚡',
  'accessibility': '♿',
  'testing': '🧪',
  
  // Feature Categories
  'ui': '🎨',
  'business': '💼',
  'infrastructure': '🏗️',
  'integration': '🔗',
  'utility': '🛠️',
  'authentication': '🔐',
  'dashboard': '📊',
  'reporting': '📋',
  'communication': '💬',
  'workflow': '🔄',
  'data': '💾',
  'api': '🔌',
  'mobile': '📱',
  'web': '🌐',
  'desktop': '💻',
  
  // Component Types
  'react': '⚛️',
  'typescript': '📘',
  'css': '🎨',
  'javascript': '📗',
  'html': '🌐',
  'node': '🟢',
  'database': '🗄️',
  'service': '⚙️',
  
  // Status Icons
  'healthy': '✅',
  'warning': '⚠️',
  'error': '❌',
  'loading': '⏳',
  'success': '🎉',
  'info': 'ℹ️',
  
  // Priority Icons
  'critical': '🚨',
  'high': '🔴',
  'medium': '🟡',
  'low': '🟢',
  
  // Action Icons
  'create': '➕',
  'edit': '✏️',
  'delete': '🗑️',
  'view': '👁️',
  'download': '⬇️',
  'upload': '⬆️',
  'search': '🔍',
  'filter': '🔧',
  'sort': '↕️',
  'refresh': '🔄',
  'settings': '⚙️',
  'help': '❓',
  'close': '✖️',
  'back': '⬅️',
  'forward': '➡️',
  'play': '▶️',
  'pause': '⏸️',
  'stop': '⏹️',
  
  // Technology Icons
  'python': '🐍',
  'java': '☕',
  'csharp': '🔷',
  'php': '🐘',
  'ruby': '💎',
  'go': '🔵',
  'rust': '🦀',
  'swift': '🍎',
  'kotlin': '🔶',
  'docker': '🐳',
  'kubernetes': '☸️',
  'aws': '☁️',
  'azure': '🔵',
  'gcp': '🌐',
  'firebase': '🔥',
  'mongodb': '🍃',
  'postgresql': '🐘',
  'mysql': '🐬',
  'redis': '🔴',
  'elasticsearch': '🔍',
  'graphql': '🟣',
  'rest': '🌐',
  'websocket': '🔌',
  'grpc': '🔵',
  
  // Business Icons
  'user': '👤',
  'users': '👥',
  'team': '👨‍👩‍👧‍👦',
  'organization': '🏢',
  'project': '📁',
  'task': '📝',
  'goal': '🎯',
  'target': '🎯',
  'budget': '💰',
  'revenue': '💵',
  'cost': '💸',
  'profit': '📈',
  'loss': '📉',
  'growth': '📈',
  'decline': '📉',
  'market': '🏪',
  'competition': '🥊',
  'partnership': '🤝',
  'contract': '📄',
  'legal': '⚖️',
  'compliance': '✅',
  'audit': '🔍',
  'risk': '⚠️',
  'privacy': '🔐',
  'insights': '💡',
  'strategy': '🎯',
  'planning': '📋',
  'execution': '⚡',
  'delivery': '🚚',
  'support': '🆘',
  'maintenance': '🔧',
  'upgrade': '⬆️',
  'migration': '🔄',
  'deployment': '🚀',
  'release': '🎉',
  'version': '🏷️',
  'backup': '💾',
  'restore': '🔄',
  'sync': '🔄',
  'export': '📤',
  'import': '📥',
  
  // Default fallback
  'default': '📄'
};

export interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  title?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md', 
  className = '', 
  title 
}) => {
  const icon = IconMapping[name as keyof typeof IconMapping] ?? IconMapping.default;
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <span 
      className={`inline-block ${sizeClasses[size]} ${className}`}
      title={title ?? name}
      role="img"
      aria-label={title ?? name}
    >
      {icon}
    </span>
  );
};

// Feature Icon Component with automatic mapping
export interface FeatureIconProps {
  featureType: string;
  category?: string;
  system?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  title?: string;
}

export const FeatureIcon: React.FC<FeatureIconProps> = ({
  featureType,
  category,
  system,
  size = 'md',
  className = '',
  title
}) => {
  // Priority order: featureType > category > system > default
  const iconName = featureType ?? category ?? system ?? 'default';
  
  return (
    <Icon 
      name={iconName}
      size={size}
      className={className}
      title={title ?? `${featureType} feature`}
    />
  );
};

// System Icon Component
export interface SystemIconProps {
  system: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  title?: string;
}

export const SystemIcon: React.FC<SystemIconProps> = ({
  system,
  size = 'md',
  className = '',
  title
}) => {
  return (
    <Icon 
      name={system}
      size={size}
      className={className}
      title={title ?? `${system} system`}
    />
  );
};

// Status Icon Component
export interface StatusIconProps {
  status: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  title?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = 'md',
  className = '',
  title
}) => {
  return (
    <Icon 
      name={status}
      size={size}
      className={className}
      title={title ?? `${status} status`}
    />
  );
};

// Priority Icon Component
export interface PriorityIconProps {
  priority: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  title?: string;
}

export const PriorityIcon: React.FC<PriorityIconProps> = ({
  priority,
  size = 'md',
  className = '',
  title
}) => {
  return (
    <Icon 
      name={priority}
      size={size}
      className={className}
      title={title ?? `${priority} priority`}
    />
  );
};

export default Icon; 