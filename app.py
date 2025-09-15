from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
import bcrypt
from dotenv import load_dotenv
from supabase import create_client, Client
import uuid
from datetime import datetime, timedelta
import secrets

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')

# Supabase configuration
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_ANON_KEY')
supabase: Client = create_client(supabase_url, supabase_key)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Get all users (admin only)
@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    try:
        # Verify admin session (simplified for demo)
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'success': False, 'message': 'Authorization required'}), 401
        
        result = supabase.table('users').select('*').order('created_at', desc=True).execute()
        
        # Remove passwords from response
        users = result.data
        for user in users:
            user.pop('password', None)
        
        return jsonify({
            'success': True,
            'users': users
        })
        
    except Exception as e:
        print(f"Get users error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

# Delete user (admin only)
@app.route('/api/admin/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # Verify admin session (simplified for demo)
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'success': False, 'message': 'Authorization required'}), 401
        
        result = supabase.table('users').delete().eq('id', user_id).execute()
        
        return jsonify({
            'success': True,
            'message': 'User deleted successfully'
        })
        
    except Exception as e:
        print(f"Delete user error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

# Get terrains data
@app.route('/api/terrains', methods=['GET'])
def get_terrains():
    try:
        # Get enabled terrains only for public access
        enabled_only = request.args.get('enabled_only', 'true').lower() == 'true'
        
        if enabled_only:
            result = supabase.table('terrains').select('*').eq('enabled', True).order('created_at', desc=True).execute()
        else:
            result = supabase.table('terrains').select('*').order('created_at', desc=True).execute()
        
        return jsonify({
            'success': True,
            'terrains': result.data
        })
        
    except Exception as e:
        print(f"Get terrains error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

# Create new terrain (admin only)
@app.route('/api/admin/terrains', methods=['POST'])
def create_terrain():
    try:
        # Verify admin session (simplified for demo)
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'success': False, 'message': 'Authorization required'}), 401
        
        data = request.get_json()
        
        # Create terrain data
        terrain_data = {
            'name': data.get('name'),
            'price': float(data.get('price', 0)),
            'currency': data.get('currency', 'MXN'),
            'location': data.get('location'),
            'size': data.get('size'),
            'badge': data.get('badge'),
            'coordinates': data.get('coordinates'),
            'description': data.get('description'),
            'features': data.get('features', []),
            'availability': data.get('availability', 'Disponible inmediatamente'),
            'main_image': data.get('mainImage'),
            'thumbnails': data.get('thumbnails', []),
            'detail_page': data.get('detailPage'),
            'enabled': data.get('enabled', True)
        }
        
        result = supabase.table('terrains').insert(terrain_data).execute()
        
        return jsonify({
            'success': True,
            'message': 'Terrain created successfully',
            'terrain': result.data[0]
        })
        
    except Exception as e:
        print(f"Create terrain error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

# Update terrain (admin only)
@app.route('/api/admin/terrains/<terrain_id>', methods=['PUT'])
def update_terrain(terrain_id):
    try:
        # Verify admin session (simplified for demo)
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'success': False, 'message': 'Authorization required'}), 401
        
        data = request.get_json()
        
        result = supabase.table('terrains').update(data).eq('id', terrain_id).execute()
        
        return jsonify({
            'success': True,
            'message': 'Terrain updated successfully',
            'terrain': result.data[0] if result.data else None
        })
        
    except Exception as e:
        print(f"Update terrain error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

# Toggle terrain status (admin only)
@app.route('/api/admin/terrains/<terrain_id>/toggle', methods=['POST'])
def toggle_terrain_status(terrain_id):
    try:
        # Verify admin session (simplified for demo)
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'success': False, 'message': 'Authorization required'}), 401
        
        # Get current terrain
        terrain_result = supabase.table('terrains').select('enabled').eq('id', terrain_id).execute()
        
        if not terrain_result.data:
            return jsonify({'success': False, 'message': 'Terrain not found'}), 404
        
        current_status = terrain_result.data[0]['enabled']
        new_status = not current_status
        
        # Update terrain status
        result = supabase.table('terrains').update({'enabled': new_status}).eq('id', terrain_id).execute()
        
        return jsonify({
            'success': True,
            'message': f'Terrain {"enabled" if new_status else "disabled"} successfully',
            'terrain': result.data[0] if result.data else None
        })
        
    except Exception as e:
        print(f"Toggle terrain error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

# Delete terrain (admin only)
@app.route('/api/admin/terrains/<terrain_id>', methods=['DELETE'])
def delete_terrain(terrain_id):
    try:
        # Verify admin session (simplified for demo)
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'success': False, 'message': 'Authorization required'}), 401
        
        result = supabase.table('terrains').delete().eq('id', terrain_id).execute()
        
        return jsonify({
            'success': True,
            'message': 'Terrain deleted successfully'
        })
        
    except Exception as e:
        print(f"Delete terrain error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.route('/api/terrains', methods=['POST'])
def create_terrain():
    """Create a new terrain"""
    try:
        terrains = load_terrains()
        terrain_data = request.json
        
        # Generate new ID
        max_id = max([t['id'] for t in terrains]) if terrains else 0
        terrain_data['id'] = max_id + 1
        
        # Add default values
        terrain_data.setdefault('availability', 'Disponible inmediatamente')
        terrain_data.setdefault('coordinates', '19.4326, -99.1332')
        terrain_data.setdefault('detailPage', f'terreno{terrain_data["id"]}.html')
        terrain_data.setdefault('mainImage', '../img/default.jpg')
        terrain_data.setdefault('thumbnails', ['../img/default.jpg'])
        terrain_data.setdefault('features', [])
        
        terrains.append(terrain_data)
        save_terrains(terrains)
        
        return jsonify({'success': True, 'message': 'Terreno creado correctamente', 'terrain': terrain_data})
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Contact form endpoint
@app.route('/api/contact', methods=['POST'])
def contact_form():
    try:
        data = request.get_json()
        
        # Save contact submission to database
        contact_data = {
            'name': data.get('name'),
            'email': data.get('email'),
            'phone': data.get('phone'),
            'message': data.get('message'),
            'terrain_interest': data.get('terrainInterest'),
            'status': 'new'
        }
        
        result = supabase.table('contact_submissions').insert(contact_data).execute()
        
        return jsonify({
            'success': True,
            'message': 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.',
            'submission': result.data[0] if result.data else None
        })
        
    except Exception as e:
        print(f"Contact form error: {e}")
        return jsonify({
            'success': False,
            'message': 'Error al enviar el mensaje. Por favor intenta de nuevo.'
        }), 500

# Terrain notification signup
@app.route('/api/notifications/terrain', methods=['POST'])
def terrain_notification_signup():
    try:
        data = request.get_json()
        
        notification_data = {
            'email': data.get('email'),
            'terrain_name': data.get('terrainName', 'Nuevo terreno')
        }
        
        result = supabase.table('terrain_notifications').insert(notification_data).execute()
        
        return jsonify({
            'success': True,
            'message': 'Te notificaremos cuando el terreno esté disponible.',
            'notification': result.data[0] if result.data else None
        })
        
    except Exception as e:
        print(f"Notification signup error: {e}")
        return jsonify({
            'success': False,
            'message': 'Error al registrar notificación. Por favor intenta de nuevo.'
        }), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload image files"""
    try:
        if 'files' not in request.files:
            return jsonify({'success': False, 'message': 'No se encontraron archivos'}), 400
        
        files = request.files.getlist('files')
        uploaded_files = []
        
        for file in files:
            if file and file.filename and allowed_file(file.filename):
                # Generate unique filename
                filename = secure_filename(file.filename)
                name, ext = os.path.splitext(filename)
                unique_filename = f"{name}_{uuid.uuid4().hex[:8]}{ext}"
                
                # Save file
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(file_path)
                
                uploaded_files.append({
                    'original_name': filename,
                    'saved_name': unique_filename,
                    'path': f'uploads/{unique_filename}'
                })
        
        return jsonify({
            'success': True, 
            'message': f'{len(uploaded_files)} archivo(s) subido(s) correctamente',
            'files': uploaded_files
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Simple login endpoint"""
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        # Simple authentication (in production, use proper authentication)
        if username == 'admin' and password == 'terrenos2024':
            return jsonify({'success': True, 'message': 'Login exitoso'})
        else:
            return jsonify({'success': False, 'message': 'Credenciales incorrectas'}), 401
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# Hash password helper
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# Generate session token
def generate_session_token():
    return secrets.token_urlsafe(32)

# User registration endpoint
@app.route('/api/users/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'fullName']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field} is required'}), 400
        
        # Check if user already exists
        existing_user = supabase.table('users').select('*').eq('email', data['email']).execute()
        if existing_user.data:
            return jsonify({'success': False, 'message': 'Email already registered'}), 400
        
        existing_username = supabase.table('users').select('*').eq('username', data['username']).execute()
        if existing_username.data:
            return jsonify({'success': False, 'message': 'Username already taken'}), 400
        
        # Create user data
        user_data = {
            'username': data['username'],
            'email': data['email'],
            'password': hash_password(data['password']),
            'full_name': data['fullName'],
            'phone': data.get('phone'),
            'birth_date': data.get('birthDate'),
            'occupation': data.get('occupation'),
            'monthly_income': float(data.get('monthlyIncome', 0)) if data.get('monthlyIncome') else None,
            'investment_budget': float(data.get('investmentBudget', 0)) if data.get('investmentBudget') else None,
            'preferred_location': data.get('preferredLocation'),
            'property_type': data.get('propertyType'),
            'financing_needed': data.get('financingNeeded', False),
            'newsletter_subscription': data.get('newsletterSubscription', False),
            'interests': data.get('interests', []),
            'role': 'user'
        }
        
        # Insert user into database
        result = supabase.table('users').insert(user_data).execute()
        
        if result.data:
            user = result.data[0]
            # Remove password from response
            user.pop('password', None)
            return jsonify({
                'success': True,
                'message': 'User registered successfully',
                'user': user
            })
        else:
            return jsonify({'success': False, 'message': 'Registration failed'}), 500
            
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

# User login endpoint
@app.route('/api/users/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'success': False, 'message': 'Username and password required'}), 400
        
        # Get user from database
        result = supabase.table('users').select('*').eq('username', username).execute()
        
        if not result.data:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        user = result.data[0]
        
        # Verify password
        if not verify_password(password, user['password']):
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Create session token
        session_token = generate_session_token()
        expires_at = datetime.now() + timedelta(days=7)  # 7 days expiry
        
        # Store session in database
        session_data = {
            'user_id': user['id'],
            'session_token': session_token,
            'expires_at': expires_at.isoformat(),
            'ip_address': request.remote_addr,
            'user_agent': request.headers.get('User-Agent')
        }
        
        supabase.table('user_sessions').insert(session_data).execute()
        
        # Update last login
        supabase.table('users').update({
            'last_login': datetime.now().isoformat()
        }).eq('id', user['id']).execute()
        
        # Remove password from response
        user.pop('password', None)
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user,
            'session_token': session_token
        })
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

# Admin login endpoint
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'success': False, 'message': 'Username and password required'}), 400
        
        # Get admin from database
        result = supabase.table('admin_users').select('*').eq('username', username).execute()
        
        if not result.data:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        admin = result.data[0]
        
        # For initial setup, check plain text password
        # In production, this should be hashed
        if password != admin['password'] and not verify_password(password, admin['password']):
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Create session token
        session_token = generate_session_token()
        expires_at = datetime.now() + timedelta(hours=8)  # 8 hours expiry for admin
        
        # Store admin session
        session_data = {
            'admin_id': admin['id'],
            'session_token': session_token,
            'expires_at': expires_at.isoformat(),
            'ip_address': request.remote_addr,
            'user_agent': request.headers.get('User-Agent')
        }
        
        supabase.table('admin_sessions').insert(session_data).execute()
        
        # Update last login
        supabase.table('admin_users').update({
            'last_login': datetime.now().isoformat()
        }).eq('id', admin['id']).execute()
        
        # Remove password from response
        admin.pop('password', None)
        
        return jsonify({
            'success': True,
            'message': 'Admin login successful',
            'admin': admin,
            'session_token': session_token
        })
        
    except Exception as e:
        print(f"Admin login error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.errorhandler(413)
def too_large(e):
    return jsonify({'success': False, 'message': 'Archivo demasiado grande'}), 413

@app.errorhandler(404)
def not_found(e):
    return jsonify({'success': False, 'message': 'Recurso no encontrado'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500

# Session validation endpoint
@app.route('/api/validate-session', methods=['POST'])
def validate_session():
    try:
        data = request.get_json()
        session_token = data.get('session_token')
        
        if not session_token:
            return jsonify({'success': False, 'message': 'Session token required'}), 400
        
        # Check user session
        user_session = supabase.table('user_sessions').select('*, users(*)').eq('session_token', session_token).gt('expires_at', datetime.now().isoformat()).execute()
        
        if user_session.data:
            user = user_session.data[0]['users']
            user.pop('password', None)
            return jsonify({
                'success': True,
                'user': user,
                'type': 'user'
            })
        
        # Check admin session
        admin_session = supabase.table('admin_sessions').select('*, admin_users(*)').eq('session_token', session_token).gt('expires_at', datetime.now().isoformat()).execute()
        
        if admin_session.data:
            admin = admin_session.data[0]['admin_users']
            admin.pop('password', None)
            return jsonify({
                'success': True,
                'user': admin,
                'type': 'admin'
            })
        
        return jsonify({'success': False, 'message': 'Invalid or expired session'}), 401
        
    except Exception as e:
        print(f"Session validation error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

# Sync terrains to JSON file (for real-time updates)
@app.route('/api/admin/sync-terrains', methods=['POST'])
def sync_terrains():
    try:
        # Get all enabled terrains from database
        result = supabase.table('terrains').select('*').eq('enabled', True).order('created_at', desc=True).execute()
        
        if result.data:
            # Update the JSON file
            with open('public/terrains.json', 'w', encoding='utf-8') as f:
                json.dump(result.data, f, ensure_ascii=False, indent=2)
            
            return jsonify({
                'success': True,
                'message': 'Terrains synced successfully',
                'count': len(result.data)
            })
        else:
            return jsonify({'success': False, 'message': 'No terrains found'}), 404
            
    except Exception as e:
        print(f"Sync terrains error: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

# Auto Git push endpoint
@app.route('/api/admin/git-push', methods=['POST'])
def git_push():
    try:
        data = request.get_json()
        commit_message = data.get('message', 'Auto-commit from admin panel')
        
        # Execute git commands
        import subprocess
        
        # Add all changes
        subprocess.run(['git', 'add', '.'], cwd=os.getcwd(), check=True)
        
        # Commit changes
        subprocess.run(['git', 'commit', '-m', commit_message], cwd=os.getcwd(), check=True)
        
        # Push to remote
        subprocess.run(['git', 'push'], cwd=os.getcwd(), check=True)
        
        return jsonify({
            'success': True,
            'message': 'Changes pushed to Git successfully'
        })
        
    except subprocess.CalledProcessError as e:
        print(f"Git command error: {e}")
        return jsonify({
            'success': False,
            'message': f'Git command failed: {e}'
        }), 500
    except FileNotFoundError:
        return jsonify({
            'success': False,
            'message': 'Git not found. Please install Git or configure PATH.'
        }), 500
    except Exception as e:
        print(f"Git push error: {e}")
        return jsonify({
            'success': False,
            'message': 'Git push failed'
        }), 500

if __name__ == '__main__':
    # Create upload directory if it doesn't exist
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
