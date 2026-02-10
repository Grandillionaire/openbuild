/**
 * Collaboration Service
 * Handles real-time collaborative editing features with mock WebSocket connection.
 * Provides cursor positions, presence indicators, and shared editing state.
 */

import { ref, computed, readonly } from 'vue';
import { nanoid } from 'nanoid';

export interface CollaboratorCursor {
  id: string;
  userId: string;
  userName: string;
  color: string;
  x: number;
  y: number;
  selectedComponentId: string | null;
  lastActive: number;
}

export interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  isOnline: boolean;
  lastSeen: Date;
  currentPage?: string;
}

export interface CollaborationState {
  isConnected: boolean;
  sessionId: string | null;
  shareLink: string | null;
  collaborators: Collaborator[];
  cursors: CollaboratorCursor[];
  isHost: boolean;
}

// Predefined colors for collaborators
const COLLABORATOR_COLORS = [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

// Mock collaborator names for demo
const MOCK_NAMES = [
  'Alex Chen',
  'Sarah Wilson',
  'Marcus Johnson',
  'Emily Davis',
  'Jordan Lee',
  'Taylor Smith',
];

class CollaborationService {
  private state = ref<CollaborationState>({
    isConnected: false,
    sessionId: null,
    shareLink: null,
    collaborators: [],
    cursors: [],
    isHost: false,
  });

  private mockSocket: ReturnType<typeof setTimeout> | null = null;
  private cursorUpdateInterval: ReturnType<typeof setInterval> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Reactive state accessors
  get isConnected() {
    return computed(() => this.state.value.isConnected);
  }

  get sessionId() {
    return computed(() => this.state.value.sessionId);
  }

  get shareLink() {
    return computed(() => this.state.value.shareLink);
  }

  get collaborators() {
    return computed(() => this.state.value.collaborators);
  }

  get cursors() {
    return computed(() => this.state.value.cursors);
  }

  get onlineCount() {
    return computed(() => 
      this.state.value.collaborators.filter(c => c.isOnline).length + 1 // +1 for current user
    );
  }

  get isHost() {
    return computed(() => this.state.value.isHost);
  }

  /**
   * Create a new collaboration session
   */
  async createSession(): Promise<string> {
    const sessionId = nanoid(12);
    const shareLink = `${window.location.origin}/collab/${sessionId}`;

    this.state.value = {
      ...this.state.value,
      isConnected: true,
      sessionId,
      shareLink,
      isHost: true,
      collaborators: [],
      cursors: [],
    };

    // Start mock WebSocket simulation
    this.startMockConnection();

    return shareLink;
  }

  /**
   * Join an existing collaboration session
   */
  async joinSession(sessionId: string): Promise<boolean> {
    // Simulate connection delay
    await this.delay(500);

    // Mock validation - in real implementation, validate session exists
    if (!sessionId || sessionId.length < 8) {
      throw new Error('Invalid session ID');
    }

    this.state.value = {
      ...this.state.value,
      isConnected: true,
      sessionId,
      shareLink: `${window.location.origin}/collab/${sessionId}`,
      isHost: false,
    };

    this.startMockConnection();
    return true;
  }

  /**
   * Leave the current collaboration session
   */
  async leaveSession(): Promise<void> {
    this.stopMockConnection();

    this.state.value = {
      isConnected: false,
      sessionId: null,
      shareLink: null,
      collaborators: [],
      cursors: [],
      isHost: false,
    };
  }

  /**
   * Send cursor position update
   */
  sendCursorUpdate(x: number, y: number, selectedComponentId: string | null = null): void {
    if (!this.state.value.isConnected) return;

    // In real implementation, this would send via WebSocket
    // For mock, we just update local state for demo purposes
  }

  /**
   * Send component selection update
   */
  sendSelectionUpdate(componentId: string | null): void {
    if (!this.state.value.isConnected) return;

    // Would broadcast selection to other collaborators
  }

  /**
   * Send component update to sync changes
   */
  sendComponentUpdate(componentId: string, changes: Record<string, any>): void {
    if (!this.state.value.isConnected) return;

    // Would broadcast component changes for real-time sync
  }

  /**
   * Copy share link to clipboard
   */
  async copyShareLink(): Promise<boolean> {
    if (!this.state.value.shareLink) return false;

    try {
      await navigator.clipboard.writeText(this.state.value.shareLink);
      return true;
    } catch {
      return false;
    }
  }

  // Private methods

  private startMockConnection(): void {
    // Simulate other collaborators joining
    this.mockSocket = setTimeout(() => {
      this.addMockCollaborators();
      this.startCursorSimulation();
    }, 1000);
  }

  private stopMockConnection(): void {
    if (this.mockSocket) {
      clearTimeout(this.mockSocket);
      this.mockSocket = null;
    }
    if (this.cursorUpdateInterval) {
      clearInterval(this.cursorUpdateInterval);
      this.cursorUpdateInterval = null;
    }
  }

  private addMockCollaborators(): void {
    // Add 2-3 mock collaborators
    const numCollaborators = 2 + Math.floor(Math.random() * 2);
    const shuffledNames = [...MOCK_NAMES].sort(() => Math.random() - 0.5);

    const collaborators: Collaborator[] = [];
    const cursors: CollaboratorCursor[] = [];

    for (let i = 0; i < numCollaborators; i++) {
      const id = nanoid(8);
      const color = COLLABORATOR_COLORS[i % COLLABORATOR_COLORS.length];

      collaborators.push({
        id,
        name: shuffledNames[i],
        color,
        isOnline: true,
        lastSeen: new Date(),
        currentPage: 'index',
      });

      cursors.push({
        id: nanoid(6),
        userId: id,
        userName: shuffledNames[i],
        color,
        x: 200 + Math.random() * 600,
        y: 150 + Math.random() * 400,
        selectedComponentId: null,
        lastActive: Date.now(),
      });
    }

    this.state.value = {
      ...this.state.value,
      collaborators,
      cursors,
    };
  }

  private startCursorSimulation(): void {
    // Simulate cursor movements
    this.cursorUpdateInterval = setInterval(() => {
      if (!this.state.value.isConnected) return;

      this.state.value.cursors = this.state.value.cursors.map(cursor => ({
        ...cursor,
        x: Math.max(100, Math.min(1200, cursor.x + (Math.random() - 0.5) * 50)),
        y: Math.max(100, Math.min(700, cursor.y + (Math.random() - 0.5) * 50)),
        lastActive: Date.now(),
      }));

      // Occasionally simulate component selection
      if (Math.random() < 0.1) {
        const cursorIndex = Math.floor(Math.random() * this.state.value.cursors.length);
        this.state.value.cursors[cursorIndex] = {
          ...this.state.value.cursors[cursorIndex],
          selectedComponentId: Math.random() < 0.5 ? `comp-${Math.floor(Math.random() * 10)}` : null,
        };
      }

      // Occasionally toggle collaborator online status
      if (Math.random() < 0.02) {
        const collabIndex = Math.floor(Math.random() * this.state.value.collaborators.length);
        this.state.value.collaborators[collabIndex] = {
          ...this.state.value.collaborators[collabIndex],
          isOnline: !this.state.value.collaborators[collabIndex].isOnline,
          lastSeen: new Date(),
        };
      }
    }, 2000);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const collaborationService = new CollaborationService();

// Export composable for Vue components
export function useCollaboration() {
  return {
    isConnected: collaborationService.isConnected,
    sessionId: collaborationService.sessionId,
    shareLink: collaborationService.shareLink,
    collaborators: collaborationService.collaborators,
    cursors: collaborationService.cursors,
    onlineCount: collaborationService.onlineCount,
    isHost: collaborationService.isHost,
    createSession: () => collaborationService.createSession(),
    joinSession: (id: string) => collaborationService.joinSession(id),
    leaveSession: () => collaborationService.leaveSession(),
    copyShareLink: () => collaborationService.copyShareLink(),
    sendCursorUpdate: (x: number, y: number, selectedId?: string | null) => 
      collaborationService.sendCursorUpdate(x, y, selectedId),
    sendSelectionUpdate: (componentId: string | null) =>
      collaborationService.sendSelectionUpdate(componentId),
    sendComponentUpdate: (componentId: string, changes: Record<string, any>) =>
      collaborationService.sendComponentUpdate(componentId, changes),
  };
}
