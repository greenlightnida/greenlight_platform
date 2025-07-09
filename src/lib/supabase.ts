import { createClient } from '@supabase/supabase-js';

import { configManager } from '../config/ConfigManager';

const config = configManager.getConfig();

export const supabase = createClient(
  config.database.url,
  config.auth.secret
);

export type SupabaseClient = typeof supabase; 