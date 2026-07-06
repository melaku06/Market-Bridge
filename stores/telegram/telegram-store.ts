import { create } from 'zustand';
import type {
  TelegramBot,
  TelegramChannel,
  TelegramGroup,
  TelegramPostTemplate,
  TelegramPost,
  TelegramActivityLog,
  PostStatus,
  TelegramTargetType,
} from '@/lib/types';

interface TelegramState {
  // Bot configuration
  bot: TelegramBot | null;
  botLoading: boolean;
  botError: string | null;

  // Channels
  channels: TelegramChannel[];
  channelsLoading: boolean;

  // Groups
  groups: TelegramGroup[];
  groupsLoading: boolean;

  // Templates
  templates: TelegramPostTemplate[];
  templatesLoading: boolean;

  // Posts
  posts: TelegramPost[];
  postsLoading: boolean;
  postsTotal: number;

  // Activity logs
  activityLogs: TelegramActivityLog[];
  activityLogsLoading: boolean;

  // Actions
  fetchBot: () => Promise<void>;
  saveBot: (data: Partial<TelegramBot>) => Promise<boolean>;
  fetchChannels: () => Promise<void>;
  createChannel: (data: Partial<TelegramChannel>) => Promise<boolean>;
  updateChannel: (id: string, data: Partial<TelegramChannel>) => Promise<boolean>;
  deleteChannel: (id: string) => Promise<boolean>;
  fetchGroups: () => Promise<void>;
  createGroup: (data: Partial<TelegramGroup>) => Promise<boolean>;
  updateGroup: (id: string, data: Partial<TelegramGroup>) => Promise<boolean>;
  deleteGroup: (id: string) => Promise<boolean>;
  fetchTemplates: () => Promise<void>;
  createTemplate: (data: Partial<TelegramPostTemplate>) => Promise<boolean>;
  updateTemplate: (id: string, data: Partial<TelegramPostTemplate>) => Promise<boolean>;
  deleteTemplate: (id: string) => Promise<boolean>;
  fetchPosts: (params?: { status?: PostStatus; limit?: number; offset?: number }) => Promise<void>;
  createPost: (data: {
    product_id: string;
    product_name: string;
    message: string;
    image_urls?: string[];
    target_type?: TelegramTargetType;
    channel_id?: string;
    group_id?: string;
    template_id?: string;
    scheduled_at?: string;
  }) => Promise<boolean>;
  updatePost: (id: string, data: Partial<TelegramPost>) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  fetchActivityLogs: (params?: { post_id?: string; action?: string; limit?: number }) => Promise<void>;
  clearError: () => void;
}

async function apiCall(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const useTelegramStore = create<TelegramState>((set, get) => ({
  bot: null,
  botLoading: false,
  botError: null,
  channels: [],
  channelsLoading: false,
  groups: [],
  groupsLoading: false,
  templates: [],
  templatesLoading: false,
  posts: [],
  postsLoading: false,
  postsTotal: 0,
  activityLogs: [],
  activityLogsLoading: false,

  fetchBot: async () => {
    set({ botLoading: true, botError: null });
    try {
      const { data } = await apiCall('/api/telegram/bot');
      set({ bot: data, botLoading: false });
    } catch (error: any) {
      set({ botError: error.message, botLoading: false });
    }
  },

  saveBot: async (data) => {
    set({ botLoading: true, botError: null });
    try {
      const existing = get().bot;
      const method = existing ? 'PUT' : 'POST';
      const { data: bot } = await apiCall('/api/telegram/bot', {
        method,
        body: JSON.stringify(data),
      });
      set({ bot, botLoading: false });
      return true;
    } catch (error: any) {
      set({ botError: error.message, botLoading: false });
      return false;
    }
  },

  fetchChannels: async () => {
    set({ channelsLoading: true });
    try {
      const { data } = await apiCall('/api/telegram/channels');
      set({ channels: data || [], channelsLoading: false });
    } catch {
      set({ channelsLoading: false });
    }
  },

  createChannel: async (data) => {
    try {
      const { data: channel } = await apiCall('/api/telegram/channels', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      set({ channels: [channel, ...get().channels] });
      return true;
    } catch {
      return false;
    }
  },

  updateChannel: async (id, data) => {
    try {
      const { data: channel } = await apiCall(`/api/telegram/channels/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      set({ channels: get().channels.map(c => c.id === id ? channel : c) });
      return true;
    } catch {
      return false;
    }
  },

  deleteChannel: async (id) => {
    try {
      await apiCall(`/api/telegram/channels/${id}`, { method: 'DELETE' });
      set({ channels: get().channels.filter(c => c.id !== id) });
      return true;
    } catch {
      return false;
    }
  },

  fetchGroups: async () => {
    set({ groupsLoading: true });
    try {
      const { data } = await apiCall('/api/telegram/groups');
      set({ groups: data || [], groupsLoading: false });
    } catch {
      set({ groupsLoading: false });
    }
  },

  createGroup: async (data) => {
    try {
      const { data: group } = await apiCall('/api/telegram/groups', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      set({ groups: [group, ...get().groups] });
      return true;
    } catch {
      return false;
    }
  },

  updateGroup: async (id, data) => {
    try {
      const { data: group } = await apiCall(`/api/telegram/groups/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      set({ groups: get().groups.map(g => g.id === id ? group : g) });
      return true;
    } catch {
      return false;
    }
  },

  deleteGroup: async (id) => {
    try {
      await apiCall(`/api/telegram/groups/${id}`, { method: 'DELETE' });
      set({ groups: get().groups.filter(g => g.id !== id) });
      return true;
    } catch {
      return false;
    }
  },

  fetchTemplates: async () => {
    set({ templatesLoading: true });
    try {
      const { data } = await apiCall('/api/telegram/templates');
      set({ templates: data || [], templatesLoading: false });
    } catch {
      set({ templatesLoading: false });
    }
  },

  createTemplate: async (data) => {
    try {
      const { data: template } = await apiCall('/api/telegram/templates', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      set({ templates: [template, ...get().templates] });
      return true;
    } catch {
      return false;
    }
  },

  updateTemplate: async (id, data) => {
    try {
      const { data: template } = await apiCall(`/api/telegram/templates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      set({ templates: get().templates.map(t => t.id === id ? template : t) });
      return true;
    } catch {
      return false;
    }
  },

  deleteTemplate: async (id) => {
    try {
      await apiCall(`/api/telegram/templates/${id}`, { method: 'DELETE' });
      set({ templates: get().templates.filter(t => t.id !== id) });
      return true;
    } catch {
      return false;
    }
  },

  fetchPosts: async (params) => {
    set({ postsLoading: true });
    try {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.offset) query.set('offset', String(params.offset));
      const { data } = await apiCall(`/api/telegram/posts?${query}`);
      set({ posts: data || [], postsLoading: false });
    } catch {
      set({ postsLoading: false });
    }
  },

  createPost: async (data) => {
    try {
      const { data: post } = await apiCall('/api/telegram/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      set({ posts: [post, ...get().posts] });
      return true;
    } catch {
      return false;
    }
  },

  updatePost: async (id, data) => {
    try {
      const { data: post } = await apiCall(`/api/telegram/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      set({ posts: get().posts.map(p => p.id === id ? post : p) });
      return true;
    } catch {
      return false;
    }
  },

  deletePost: async (id) => {
    try {
      await apiCall(`/api/telegram/posts/${id}`, { method: 'DELETE' });
      set({ posts: get().posts.filter(p => p.id !== id) });
      return true;
    } catch {
      return false;
    }
  },

  fetchActivityLogs: async (params) => {
    set({ activityLogsLoading: true });
    try {
      const query = new URLSearchParams();
      if (params?.post_id) query.set('post_id', params.post_id);
      if (params?.action) query.set('action', params.action);
      if (params?.limit) query.set('limit', String(params.limit));
      const { data } = await apiCall(`/api/telegram/activity-logs?${query}`);
      set({ activityLogs: data || [], activityLogsLoading: false });
    } catch {
      set({ activityLogsLoading: false });
    }
  },

  clearError: () => set({ botError: null }),
}));
