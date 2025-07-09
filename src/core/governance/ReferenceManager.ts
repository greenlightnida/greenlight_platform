/**
 * Reference Manager
 * Manages references and cross-references across the system
 */

export interface ReferenceEntry {
  id: string;
  type: 'file' | 'component' | 'service' | 'documentation' | 'external';
  path: string;
  title: string;
  description?: string;
  tags: string[];
  lastModified: Date;
  references: string[]; // IDs of other entries this references
  referencedBy: string[]; // IDs of entries that reference this
}

class ReferenceManager {
  private references: Map<string, ReferenceEntry> = new Map();

  /**
   * Add a new reference entry
   */
  addReference(entry: Omit<ReferenceEntry, 'id' | 'lastModified' | 'referencedBy'>): string {
    const id = this.generateId(entry.path);
    const referenceEntry: ReferenceEntry = {
      ...entry,
      id,
      lastModified: new Date(),
      referencedBy: []
    };

    this.references.set(id, referenceEntry);
    return id;
  }

  /**
   * Get a reference entry by ID
   */
  getReference(id: string): ReferenceEntry | undefined {
    return this.references.get(id);
  }

  /**
   * Get all references
   */
  getAllReferences(): ReferenceEntry[] {
    return Array.from(this.references.values());
  }

  /**
   * Get references by type
   */
  getReferencesByType(type: ReferenceEntry['type']): ReferenceEntry[] {
    return Array.from(this.references.values()).filter(ref => ref.type === type);
  }

  /**
   * Get references by tag
   */
  getReferencesByTag(tag: string): ReferenceEntry[] {
    return Array.from(this.references.values()).filter(ref => ref.tags.includes(tag));
  }

  /**
   * Add a reference relationship
   */
  addReferenceRelationship(fromId: string, toId: string): boolean {
    const fromRef = this.references.get(fromId);
    const toRef = this.references.get(toId);

    if (!fromRef || !toRef) {
      return false;
    }

    // Add to references array if not already present
    if (!fromRef.references.includes(toId)) {
      fromRef.references.push(toId);
    }

    // Add to referencedBy array if not already present
    if (!toRef.referencedBy.includes(fromId)) {
      toRef.referencedBy.push(fromId);
    }

    return true;
  }

  /**
   * Remove a reference relationship
   */
  removeReferenceRelationship(fromId: string, toId: string): boolean {
    const fromRef = this.references.get(fromId);
    const toRef = this.references.get(toId);

    if (!fromRef || !toRef) {
      return false;
    }

    // Remove from references array
    fromRef.references = fromRef.references.filter(id => id !== toId);

    // Remove from referencedBy array
    toRef.referencedBy = toRef.referencedBy.filter(id => id !== fromId);

    return true;
  }

  /**
   * Get all references that reference a specific entry
   */
  getReferencedBy(id: string): ReferenceEntry[] {
    const entry = this.references.get(id);
    if (!entry) return [];

    return entry.referencedBy
      .map(refId => this.references.get(refId))
      .filter((ref): ref is ReferenceEntry => ref !== undefined);
  }

  /**
   * Get all references that are referenced by a specific entry
   */
  getReferences(id: string): ReferenceEntry[] {
    const entry = this.references.get(id);
    if (!entry) return [];

    return entry.references
      .map(refId => this.references.get(refId))
      .filter((ref): ref is ReferenceEntry => ref !== undefined);
  }

  /**
   * Update a reference entry
   */
  updateReference(id: string, updates: Partial<Omit<ReferenceEntry, 'id' | 'lastModified'>>): boolean {
    const entry = this.references.get(id);
    if (!entry) return false;

    const updatedEntry: ReferenceEntry = {
      ...entry,
      ...updates,
      lastModified: new Date()
    };

    this.references.set(id, updatedEntry);
    return true;
  }

  /**
   * Remove a reference entry
   */
  removeReference(id: string): boolean {
    const entry = this.references.get(id);
    if (!entry) return false;

    // Remove all reference relationships
    entry.referencedBy.forEach(refId => {
      const ref = this.references.get(refId);
      if (ref) {
        ref.references = ref.references.filter(r => r !== id);
      }
    });

    this.references.delete(id);
    return true;
  }

  /**
   * Generate a unique ID for a reference
   */
  private generateId(path: string): string {
    const timestamp = Date.now();
    const hash = this.simpleHash(path);
    return `${hash}-${timestamp}`;
  }

  /**
   * Simple hash function for generating IDs
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Export all references to JSON
   */
  exportToJSON(): string {
    return JSON.stringify(Array.from(this.references.values()), null, 2);
  }

  /**
   * Import references from JSON
   */
  importFromJSON(json: string): void {
    try {
      const references = JSON.parse(json) as ReferenceEntry[];
      references.forEach(ref => {
        this.references.set(ref.id, ref);
      });
    } catch (error) {
      console.error('Failed to import references from JSON:', error);
    }
  }
}
