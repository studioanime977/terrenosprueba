-- Supabase Database Schema for Terrenos Premium
-- This file contains all the table structures needed for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for regular user registration
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Will be hashed
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    occupation VARCHAR(100),
    monthly_income DECIMAL(10,2),
    investment_budget DECIMAL(10,2),
    preferred_location VARCHAR(100),
    property_type VARCHAR(50),
    financing_needed BOOLEAN DEFAULT false,
    newsletter_subscription BOOLEAN DEFAULT false,
    interests TEXT[], -- Array of interests
    role VARCHAR(20) DEFAULT 'user', -- 'user' or 'admin'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Admin users table (separate from regular users for security)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Will be hashed
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    permissions TEXT[], -- Array of permissions
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Terrains/Properties table
CREATE TABLE IF NOT EXISTS terrains (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MXN',
    location VARCHAR(200) NOT NULL,
    size VARCHAR(50) NOT NULL,
    badge VARCHAR(50), -- 'Nuevo', 'Oferta', etc.
    coordinates VARCHAR(100), -- 'lat, lng'
    description TEXT,
    features TEXT[], -- Array of features
    availability VARCHAR(50) DEFAULT 'Disponible inmediatamente',
    main_image VARCHAR(255),
    thumbnails TEXT[], -- Array of image URLs
    detail_page VARCHAR(100), -- HTML page name
    enabled BOOLEAN DEFAULT true,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table for managing login sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    terrain_interest VARCHAR(200), -- Which terrain they're interested in
    status VARCHAR(20) DEFAULT 'new', -- 'new', 'contacted', 'closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    responded_by UUID REFERENCES admin_users(id)
);

-- Notification preferences for terrain availability
CREATE TABLE IF NOT EXISTS terrain_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    terrain_name VARCHAR(200),
    notified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notified_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_terrains_enabled ON terrains(enabled);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_terrains_updated_at BEFORE UPDATE ON terrains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password should be hashed in production)
INSERT INTO admin_users (username, password, email, full_name, permissions) 
VALUES (
    'admin', 
    'terrenos2024', -- This should be hashed with bcrypt in production
    'admin@terrenospremium.com',
    'Administrador Principal',
    ARRAY['manage_users', 'manage_terrains', 'view_analytics', 'manage_content']
) ON CONFLICT (username) DO NOTHING;

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE terrains ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Admins can see all users
CREATE POLICY "Admins can view all users" ON users FOR ALL USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Public can view enabled terrains
CREATE POLICY "Anyone can view enabled terrains" ON terrains FOR SELECT USING (enabled = true);

-- Admins can manage all terrains
CREATE POLICY "Admins can manage terrains" ON terrains FOR ALL USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
