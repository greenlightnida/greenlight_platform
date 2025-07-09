export interface TokenValue {
  value: string | number;
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'border-radius';
  description?: string;
  category?: string;
}

export interface TokenExport {
  version: string;
  tokens: Record<string, TokenValue>;
  metadata: {
    generatedAt: Date;
    system: string;
  };
}

export class DesignTokens {
  private tokens: Map<string, TokenValue> = new Map();
  private categories: Map<string, string[]> = new Map();

  constructor() {
    this.initializeDefaultTokens();
  }

  private initializeDefaultTokens(): void {
    // Professional Color Palette
    this.setToken('color.primary', { value: '#1a365d', type: 'color', description: 'Deep blue primary color', category: 'colors' });
    this.setToken('color.accent', { value: '#f6ad55', type: 'color', description: 'Warm amber accent color', category: 'colors' });
    this.setToken('color.neutral', { value: '#718096', type: 'color', description: 'Cool gray neutral color', category: 'colors' });
    
    // 8px Grid System
    this.setToken('space.xs', { value: '4px', type: 'spacing', description: 'Extra small spacing', category: 'spacing' });
    this.setToken('space.sm', { value: '8px', type: 'spacing', description: 'Small spacing', category: 'spacing' });
    this.setToken('space.md', { value: '16px', type: 'spacing', description: 'Medium spacing', category: 'spacing' });
    this.setToken('space.lg', { value: '32px', type: 'spacing', description: 'Large spacing', category: 'spacing' });
    this.setToken('space.xl', { value: '64px', type: 'spacing', description: 'Extra large spacing', category: 'spacing' });
    
    // Typography
    this.setToken('font.family', { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", type: 'typography', description: 'Primary font family', category: 'typography' });
    this.setToken('font.weight.regular', { value: '400', type: 'typography', description: 'Regular font weight', category: 'typography' });
    this.setToken('font.weight.bold', { value: '700', type: 'typography', description: 'Bold font weight', category: 'typography' });
    
    // Shadows
    this.setToken('shadow.sm', { value: '0 1px 2px rgba(0, 0, 0, 0.05)', type: 'shadow', description: 'Small shadow', category: 'shadows' });
    this.setToken('shadow.md', { value: '0 4px 6px rgba(0, 0, 0, 0.1)', type: 'shadow', description: 'Medium shadow', category: 'shadows' });
    this.setToken('shadow.lg', { value: '0 10px 15px rgba(0, 0, 0, 0.1)', type: 'shadow', description: 'Large shadow', category: 'shadows' });
    
    // Border Radius
    this.setToken('radius.sm', { value: '4px', type: 'border-radius', description: 'Small border radius', category: 'border-radius' });
    this.setToken('radius.md', { value: '8px', type: 'border-radius', description: 'Medium border radius', category: 'border-radius' });
    this.setToken('radius.lg', { value: '12px', type: 'border-radius', description: 'Large border radius', category: 'border-radius' });
  }

  public setToken(key: string, value: TokenValue): void {
    this.tokens.set(key, value);
    
    // Update category index
    if (value.category) {
      if (!this.categories.has(value.category)) {
        this.categories.set(value.category, []);
      }
      this.categories.get(value.category)!.push(key);
    }
  }

  public getToken(key: string): TokenValue | undefined {
    return this.tokens.get(key);
  }

  public getTokensByCategory(category: string): TokenValue[] {
    const tokenKeys = this.categories.get(category) || [];
    return tokenKeys.map(key => this.tokens.get(key)!);
  }

  public getAllTokens(): Record<string, TokenValue> {
    const result: Record<string, TokenValue> = {};
    this.tokens.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  public getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  public exportTokens(): TokenExport {
    return {
      version: '1.0.0',
      tokens: this.getAllTokens(),
      metadata: {
        generatedAt: new Date(),
        system: 'DesignSystemManager'
      }
    };
  }

  public importTokens(tokens: TokenExport): void {
    Object.entries(tokens.tokens).forEach(([key, value]) => {
      this.setToken(key, value);
    });
  }

  public generateCSS(): string {
    let css = ':root {\n';
    
    this.tokens.forEach((token, key) => {
      const cssKey = key.replace(/\./g, '-');
      css += `  --${cssKey}: ${token.value};\n`;
    });
    
    css += '}\n';
    return css;
  }

  public generateSCSS(): string {
    let scss = '';
    
    this.tokens.forEach((token, key) => {
      const scssKey = key.replace(/\./g, '-');
      scss += `$${scssKey}: ${token.value};\n`;
    });
    
    return scss;
  }
} 