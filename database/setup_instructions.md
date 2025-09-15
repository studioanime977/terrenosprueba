# Supabase Database Setup Instructions

## 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project name: "terrenos-premium"
6. Enter database password (save this securely)
7. Choose region closest to your users
8. Click "Create new project"

## 2. Get Your Credentials
After project creation, go to Settings > API:
- **Project URL**: `https://zymqkwfplwlumbnevtbt.supabase.co` (already configured)
- **anon public key**: Copy this to your `.env` file as `SUPABASE_ANON_KEY`
- **service_role secret**: Copy this to your `.env` file as `SUPABASE_SERVICE_ROLE_KEY`

## 3. Set Up Database Schema
1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the left sidebar
3. Copy the entire contents of `database/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create all necessary tables:
- `users` - Regular user accounts
- `admin_users` - Admin accounts
- `terrains` - Property listings
- `user_sessions` - User login sessions
- `admin_sessions` - Admin login sessions
- `contact_submissions` - Contact form data
- `terrain_notifications` - Email notifications for new terrains

## 4. Configure Environment Variables
1. Copy `.env.example` to `.env`
2. Update the following values in `.env`:
   ```
   SUPABASE_ANON_KEY=your_actual_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   SUPABASE_DB_PASSWORD=your_database_password_here
   ```

## 5. Install Python Dependencies
```bash
pip install -r requirements.txt
```

## 6. Run the Application
```bash
python app.py
```

## 7. Test the Setup
1. Open your browser to `http://localhost:5000`
2. Try registering a new user
3. Try logging in as admin (username: `admin`, password: `terrenos2024`)
4. Check your Supabase dashboard to see the data being stored

## Database Connection Details
Your Supabase project provides three connection options:

### Direct Connection (Recommended for development)
- Host: `db.zymqkwfplwlumbnevtbt.supabase.co`
- Port: `5432`
- Database: `postgres`
- User: `postgres`

### Transaction Pooler (For serverless/production)
- Host: `aws-1-us-east-2.pooler.supabase.com`
- Port: `6543`
- User: `postgres.zymqkwfplwlumbnevtbt`

### Session Pooler (Alternative to direct)
- Host: `aws-1-us-east-2.pooler.supabase.com`
- Port: `5432`
- User: `postgres.zymqkwfplwlumbnevtbt`

## Security Notes
1. **Never commit your `.env` file** - it contains sensitive credentials
2. The default admin password should be changed in production
3. Enable Row Level Security (RLS) policies are already configured
4. User passwords are automatically hashed with bcrypt

## Troubleshooting
1. **Connection errors**: Check your internet connection and Supabase project status
2. **Authentication errors**: Verify your API keys in the `.env` file
3. **Permission errors**: Ensure RLS policies are properly configured
4. **Missing tables**: Re-run the schema.sql file in the SQL Editor

## Next Steps
1. Customize the database schema as needed
2. Add additional security policies
3. Configure email notifications (optional)
4. Set up automated backups
5. Configure production environment variables
