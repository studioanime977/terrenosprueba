// Supabase Database Configuration
// This file handles the connection to Supabase PostgreSQL database

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://zymqkwfplwlumbnevtbt.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your actual anon key

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database connection configurations
export const dbConfig = {
    // Direct connection (for persistent connections)
    direct: {
        host: 'db.zymqkwfplwlumbnevtbt.supabase.co',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: process.env.SUPABASE_DB_PASSWORD, // Set in environment variables
        ssl: { rejectUnauthorized: false }
    },
    
    // Transaction pooler (for serverless functions)
    transactionPooler: {
        host: 'aws-1-us-east-2.pooler.supabase.com',
        port: 6543,
        database: 'postgres',
        user: 'postgres.zymqkwfplwlumbnevtbt',
        password: process.env.SUPABASE_DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
    },
    
    // Session pooler (alternative to direct connection)
    sessionPooler: {
        host: 'aws-1-us-east-2.pooler.supabase.com',
        port: 5432,
        database: 'postgres',
        user: 'postgres.zymqkwfplwlumbnevtbt',
        password: process.env.SUPABASE_DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
    }
};

// Database helper functions
export class DatabaseService {
    constructor() {
        this.client = supabase;
    }

    // User management functions
    async createUser(userData) {
        try {
            const { data, error } = await this.client
                .from('users')
                .insert([userData])
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating user:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserByEmail(email) {
        try {
            const { data, error } = await this.client
                .from('users')
                .select('*')
                .eq('email', email)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting user:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserByUsername(username) {
        try {
            const { data, error } = await this.client
                .from('users')
                .select('*')
                .eq('username', username)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting user:', error);
            return { success: false, error: error.message };
        }
    }

    async getAllUsers() {
        try {
            const { data, error } = await this.client
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting users:', error);
            return { success: false, error: error.message };
        }
    }

    async updateUser(userId, updates) {
        try {
            const { data, error } = await this.client
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error updating user:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteUser(userId) {
        try {
            const { error } = await this.client
                .from('users')
                .delete()
                .eq('id', userId);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting user:', error);
            return { success: false, error: error.message };
        }
    }

    // Admin management functions
    async getAdminByUsername(username) {
        try {
            const { data, error } = await this.client
                .from('admin_users')
                .select('*')
                .eq('username', username)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting admin:', error);
            return { success: false, error: error.message };
        }
    }

    async updateAdminLastLogin(adminId) {
        try {
            const { error } = await this.client
                .from('admin_users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', adminId);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error updating admin login:', error);
            return { success: false, error: error.message };
        }
    }

    // Terrain management functions
    async createTerrain(terrainData) {
        try {
            const { data, error } = await this.client
                .from('terrains')
                .insert([terrainData])
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating terrain:', error);
            return { success: false, error: error.message };
        }
    }

    async getAllTerrains() {
        try {
            const { data, error } = await this.client
                .from('terrains')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting terrains:', error);
            return { success: false, error: error.message };
        }
    }

    async getEnabledTerrains() {
        try {
            const { data, error } = await this.client
                .from('terrains')
                .select('*')
                .eq('enabled', true)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting enabled terrains:', error);
            return { success: false, error: error.message };
        }
    }

    async updateTerrain(terrainId, updates) {
        try {
            const { data, error } = await this.client
                .from('terrains')
                .update(updates)
                .eq('id', terrainId)
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error updating terrain:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteTerrain(terrainId) {
        try {
            const { error } = await this.client
                .from('terrains')
                .delete()
                .eq('id', terrainId);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting terrain:', error);
            return { success: false, error: error.message };
        }
    }

    async toggleTerrainStatus(terrainId) {
        try {
            // First get current status
            const { data: terrain, error: getError } = await this.client
                .from('terrains')
                .select('enabled')
                .eq('id', terrainId)
                .single();
            
            if (getError) throw getError;
            
            // Toggle the status
            const { data, error } = await this.client
                .from('terrains')
                .update({ enabled: !terrain.enabled })
                .eq('id', terrainId)
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error toggling terrain status:', error);
            return { success: false, error: error.message };
        }
    }

    // Contact form functions
    async createContactSubmission(contactData) {
        try {
            const { data, error } = await this.client
                .from('contact_submissions')
                .insert([contactData])
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating contact submission:', error);
            return { success: false, error: error.message };
        }
    }

    // Notification functions
    async createTerrainNotification(email, terrainName) {
        try {
            const { data, error } = await this.client
                .from('terrain_notifications')
                .insert([{ email, terrain_name: terrainName }])
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating notification:', error);
            return { success: false, error: error.message };
        }
    }

    // Session management
    async createUserSession(userId, sessionToken, expiresAt, ipAddress, userAgent) {
        try {
            const { data, error } = await this.client
                .from('user_sessions')
                .insert([{
                    user_id: userId,
                    session_token: sessionToken,
                    expires_at: expiresAt,
                    ip_address: ipAddress,
                    user_agent: userAgent
                }])
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating session:', error);
            return { success: false, error: error.message };
        }
    }

    async validateUserSession(sessionToken) {
        try {
            const { data, error } = await this.client
                .from('user_sessions')
                .select(`
                    *,
                    users (*)
                `)
                .eq('session_token', sessionToken)
                .gt('expires_at', new Date().toISOString())
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error validating session:', error);
            return { success: false, error: error.message };
        }
    }
}

// Export singleton instance
export const db = new DatabaseService();
