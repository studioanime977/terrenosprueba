#!/usr/bin/env python3
"""
Chatbot Backend for Terrenos Premium
Advanced AI-powered chatbot with natural language processing
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import sqlite3
import os

class TerrenosChatbotBackend:
    def __init__(self, db_path: str = "chatbot/chatbot.db"):
        self.db_path = db_path
        self.knowledge_base = self._load_knowledge_base()
        self.conversation_history = []
        self._init_database()
    
    def _init_database(self):
        """Initialize SQLite database for conversation storage"""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create conversations table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                user_message TEXT,
                bot_response TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_ip TEXT,
                page_url TEXT
            )
        ''')
        
        # Create leads table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                phone TEXT,
                property_interest TEXT,
                message TEXT,
                source TEXT DEFAULT 'chatbot',
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'new'
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def _load_knowledge_base(self) -> Dict:
        """Load comprehensive knowledge base"""
        return {
            "properties": [
                {
                    "id": "terreno1",
                    "name": "Terreno Residencial Las Flores",
                    "price": 85000,
                    "price_text": "$85,000 USD",
                    "area": 500,
                    "area_text": "500 m²",
                    "location": "Zona Norte, Ciudad",
                    "type": "residencial",
                    "status": "disponible",
                    "features": [
                        "Agua potable", "Electricidad", "Drenaje", 
                        "Pavimentación", "Seguridad 24/7", "Cerca de escuelas",
                        "Transporte público", "Centros comerciales cercanos"
                    ],
                    "description": "Excelente terreno en zona residencial con todos los servicios disponibles.",
                    "coordinates": "19.4326, -99.1332",
                    "financing_options": ["Crédito bancario", "Pago directo", "INFONAVIT"],
                    "legal_status": "Escrituras en regla"
                },
                {
                    "id": "terreno2", 
                    "name": "Terreno Comercial Centro",
                    "price": 150000,
                    "price_text": "$150,000 USD",
                    "area": 800,
                    "area_text": "800 m²",
                    "location": "Centro Comercial",
                    "type": "comercial",
                    "status": "disponible",
                    "features": [
                        "Ubicación estratégica", "Alto tráfico peatonal",
                        "Transporte público", "Zonificación comercial",
                        "Servicios completos", "Estacionamiento cercano"
                    ],
                    "description": "Ideal para desarrollo comercial con alta afluencia de personas.",
                    "coordinates": "19.4285, -99.1277",
                    "financing_options": ["Crédito comercial", "Pago directo"],
                    "legal_status": "Uso de suelo comercial"
                },
                {
                    "id": "terreno3",
                    "name": "Terreno Industrial El Progreso", 
                    "price": 120000,
                    "price_text": "$120,000 USD",
                    "area": 1200,
                    "area_text": "1,200 m²",
                    "location": "Zona Industrial",
                    "type": "industrial",
                    "status": "disponible",
                    "features": [
                        "Acceso a carreteras principales", "Servicios industriales",
                        "Zonificación industrial", "Amplio espacio",
                        "Energía trifásica", "Agua industrial"
                    ],
                    "description": "Perfecto para desarrollo industrial con acceso a carreteras principales.",
                    "coordinates": "19.3910, -99.2837",
                    "financing_options": ["Crédito industrial", "Leasing"],
                    "legal_status": "Zonificación industrial aprobada"
                },
                {
                    "id": "terreno4",
                    "name": "Terreno Campestre Vista Hermosa",
                    "price": 65000,
                    "price_text": "$65,000 USD", 
                    "area": 2000,
                    "area_text": "2,000 m²",
                    "location": "Zona Rural",
                    "type": "campestre",
                    "status": "disponible",
                    "features": [
                        "Vista panorámica", "Ambiente natural", "Aire puro",
                        "Tranquilidad", "Ideal para casa de campo",
                        "Acceso por camino rural", "Pozo de agua"
                    ],
                    "description": "Hermoso terreno campestre con vista panorámica y ambiente natural.",
                    "coordinates": "19.5126, -99.0532",
                    "financing_options": ["Pago directo", "Planes flexibles"],
                    "legal_status": "Escrituras en orden"
                }
            ],
            "company_info": {
                "name": "Terrenos Premium",
                "phone": "+1 234 567 8900",
                "email": "info@terrenospremium.com",
                "address": "Av. Principal 123, Centro, Ciudad",
                "hours": "Lunes - Viernes: 9:00 AM - 6:00 PM, Sábados: 9:00 AM - 2:00 PM",
                "whatsapp": "1234567890",
                "social_media": {
                    "facebook": "Terrenos Premium",
                    "instagram": "@terrenospremium"
                }
            },
            "services": [
                {
                    "name": "Búsqueda Personalizada",
                    "description": "Te ayudamos a encontrar el terreno perfecto según tus necesidades"
                },
                {
                    "name": "Asesoría Legal",
                    "description": "Acompañamiento completo en trámites y documentación"
                },
                {
                    "name": "Financiamiento",
                    "description": "Opciones flexibles adaptadas a tu presupuesto"
                },
                {
                    "name": "Topografía",
                    "description": "Levantamientos topográficos profesionales"
                },
                {
                    "name": "Gestión de Permisos",
                    "description": "Tramitación de permisos de construcción"
                }
            ],
            "financing": {
                "down_payment_min": 20,
                "interest_rates": {
                    "residential": 8.5,
                    "commercial": 9.5,
                    "industrial": 10.0
                },
                "terms": [12, 24, 36, 48, 60],
                "banks": ["Banco Nacional", "Banco Comercial", "Banco Industrial"]
            }
        }
    
    def process_message(self, message: str, session_id: str = None, 
                       user_ip: str = None, page_url: str = None) -> str:
        """Process user message and generate intelligent response"""
        
        # Clean and normalize message
        clean_message = self._clean_message(message)
        
        # Analyze intent
        intent, entities = self._analyze_intent(clean_message)
        
        # Generate response based on intent
        response = self._generate_response(intent, entities, clean_message)
        
        # Store conversation
        self._store_conversation(session_id, message, response, user_ip, page_url)
        
        return response
    
    def _clean_message(self, message: str) -> str:
        """Clean and normalize user message"""
        # Remove extra whitespace
        message = re.sub(r'\s+', ' ', message.strip())
        
        # Convert to lowercase for processing
        return message.lower()
    
    def _analyze_intent(self, message: str) -> Tuple[str, Dict]:
        """Analyze user intent and extract entities"""
        
        # Intent patterns
        intents = {
            "property_inquiry": [
                r"propiedad|terreno|disponible|venta|comprar",
                r"residencial|comercial|industrial|campestre",
                r"casa|negocio|empresa|campo"
            ],
            "price_inquiry": [
                r"precio|costo|cuanto|vale|valor",
                r"pagar|dinero|inversión"
            ],
            "location_inquiry": [
                r"ubicación|donde|dirección|lugar",
                r"zona|área|región"
            ],
            "visit_request": [
                r"visita|ver|conocer|agendar|cita",
                r"mostrar|enseñar"
            ],
            "financing_inquiry": [
                r"financiamiento|crédito|préstamo",
                r"pago|mensualidad|enganche",
                r"banco|hipoteca"
            ],
            "contact_request": [
                r"contacto|teléfono|email|llamar",
                r"comunicar|hablar"
            ],
            "services_inquiry": [
                r"servicio|asesoría|ayuda|apoyo",
                r"legal|topografía|permiso"
            ],
            "greeting": [
                r"hola|buenos|buenas|saludos",
                r"qué tal|cómo está"
            ],
            "thanks": [
                r"gracias|thank|agradezco"
            ]
        }
        
        # Find matching intent
        detected_intent = "general"
        confidence = 0
        
        for intent, patterns in intents.items():
            for pattern in patterns:
                if re.search(pattern, message):
                    detected_intent = intent
                    confidence += 1
        
        # Extract entities
        entities = self._extract_entities(message)
        
        return detected_intent, entities
    
    def _extract_entities(self, message: str) -> Dict:
        """Extract entities from message"""
        entities = {}
        
        # Property types
        property_types = {
            "residencial": ["residencial", "casa", "hogar", "vivienda"],
            "comercial": ["comercial", "negocio", "tienda", "oficina"],
            "industrial": ["industrial", "fábrica", "bodega", "almacén"],
            "campestre": ["campestre", "campo", "rural", "naturaleza"]
        }
        
        for prop_type, keywords in property_types.items():
            for keyword in keywords:
                if keyword in message:
                    entities["property_type"] = prop_type
                    break
        
        # Price ranges
        if re.search(r"barato|económico|bajo", message):
            entities["price_range"] = "low"
        elif re.search(r"medio|promedio", message):
            entities["price_range"] = "medium"
        elif re.search(r"alto|premium|lujo", message):
            entities["price_range"] = "high"
        
        # Area preferences
        area_match = re.search(r"(\d+)\s*(m²|metros|metro)", message)
        if area_match:
            entities["desired_area"] = int(area_match.group(1))
        
        return entities
    
    def _generate_response(self, intent: str, entities: Dict, message: str) -> str:
        """Generate appropriate response based on intent and entities"""
        
        if intent == "greeting":
            return self._get_greeting_response()
        
        elif intent == "property_inquiry":
            return self._get_property_response(entities)
        
        elif intent == "price_inquiry":
            return self._get_price_response(entities)
        
        elif intent == "location_inquiry":
            return self._get_location_response()
        
        elif intent == "visit_request":
            return self._get_visit_response()
        
        elif intent == "financing_inquiry":
            return self._get_financing_response(entities)
        
        elif intent == "contact_request":
            return self._get_contact_response()
        
        elif intent == "services_inquiry":
            return self._get_services_response()
        
        elif intent == "thanks":
            return self._get_thanks_response()
        
        else:
            return self._get_default_response()
    
    def _get_greeting_response(self) -> str:
        greetings = [
            "¡Hola! Bienvenido a Terrenos Premium. Soy tu asistente virtual y estoy aquí para ayudarte a encontrar el terreno perfecto. ¿En qué puedo asistirte?",
            "¡Hola! Es un placer saludarte. Soy el asistente de Terrenos Premium. ¿Te interesa conocer nuestras propiedades disponibles?",
            "¡Buenos días! Gracias por contactar Terrenos Premium. ¿Cómo puedo ayudarte con tu búsqueda de terrenos?"
        ]
        import random
        return random.choice(greetings)
    
    def _get_property_response(self, entities: Dict) -> str:
        properties = self.knowledge_base["properties"]
        
        # Filter by property type if specified
        if "property_type" in entities:
            prop_type = entities["property_type"]
            filtered_props = [p for p in properties if p["type"] == prop_type]
            
            if filtered_props:
                prop = filtered_props[0]
                return f"""Tenemos el **{prop['name']}** disponible:

📍 **Ubicación**: {prop['location']}
📐 **Área**: {prop['area_text']}
💰 **Precio**: {prop['price_text']}

**Características principales:**
{chr(10).join([f"✅ {feature}" for feature in prop['features'][:4]])}

{prop['description']}

¿Te gustaría más información sobre esta propiedad o agendar una visita?"""
        
        # Show all properties
        response = "🏆 **Nuestras Propiedades Disponibles:**\n\n"
        
        for prop in properties:
            response += f"🏠 **{prop['name']}**\n"
            response += f"   📍 {prop['location']} | 📐 {prop['area_text']} | 💰 {prop['price_text']}\n\n"
        
        response += "¿Cuál de estas propiedades te interesa más? Puedo darte información detallada de cualquiera."
        
        return response
    
    def _get_price_response(self, entities: Dict) -> str:
        properties = self.knowledge_base["properties"]
        
        response = "💰 **Lista de Precios Actualizada:**\n\n"
        
        # Sort by price
        sorted_props = sorted(properties, key=lambda x: x["price"])
        
        for prop in sorted_props:
            response += f"• **{prop['name']}**: {prop['price_text']} ({prop['area_text']})\n"
        
        response += "\n📋 **Todos los precios incluyen:**\n"
        response += "✅ Escrituración\n"
        response += "✅ Asesoría legal\n"
        response += "✅ Gestión de trámites\n\n"
        response += "💳 Ofrecemos opciones de financiamiento desde 20% de enganche. ¿Te interesa conocer las opciones de pago?"
        
        return response
    
    def _get_location_response(self) -> str:
        properties = self.knowledge_base["properties"]
        company = self.knowledge_base["company_info"]
        
        response = "📍 **Ubicaciones de Nuestras Propiedades:**\n\n"
        
        for prop in properties:
            response += f"🏠 **{prop['name']}**: {prop['location']}\n"
        
        response += f"\n🏢 **Nuestra Oficina:**\n"
        response += f"📍 {company['address']}\n"
        response += f"🕒 {company['hours']}\n\n"
        response += "¿Te gustaría que te envíe la ubicación exacta de alguna propiedad o agendar una visita?"
        
        return response
    
    def _get_visit_response(self) -> str:
        company = self.knowledge_base["company_info"]
        
        return f"""📅 **¡Excelente! Agenda tu visita:**

Para programar una visita a cualquiera de nuestras propiedades, puedes contactarnos por:

📞 **Teléfono**: {company['phone']}
📱 **WhatsApp**: https://wa.me/{company['whatsapp']}
📧 **Email**: {company['email']}

🕒 **Horarios de visita:**
{company['hours']}

**¿Qué incluye la visita?**
✅ Recorrido completo del terreno
✅ Asesor especializado
✅ Información técnica detallada
✅ Análisis de opciones de financiamiento
✅ Sin compromiso

¿Qué propiedad te gustaría visitar?"""
    
    def _get_financing_response(self, entities: Dict) -> str:
        financing = self.knowledge_base["financing"]
        
        response = "💳 **Opciones de Financiamiento Disponibles:**\n\n"
        response += f"💰 **Enganche mínimo**: {financing['down_payment_min']}%\n"
        response += f"📅 **Plazos disponibles**: {', '.join(map(str, financing['terms']))} meses\n\n"
        
        response += "🏦 **Instituciones financieras aliadas:**\n"
        for bank in financing["banks"]:
            response += f"• {bank}\n"
        
        response += "\n📊 **Tasas de interés aproximadas:**\n"
        for prop_type, rate in financing["interest_rates"].items():
            response += f"• {prop_type.title()}: {rate}% anual\n"
        
        response += "\n✅ **Beneficios adicionales:**\n"
        response += "• Asesoría financiera gratuita\n"
        response += "• Gestión completa de trámites\n"
        response += "• Seguros opcionales\n"
        response += "• Sin penalización por pago anticipado\n\n"
        response += "¿Te gustaría una cotización personalizada?"
        
        return response
    
    def _get_contact_response(self) -> str:
        company = self.knowledge_base["company_info"]
        
        return f"""📞 **Información de Contacto:**

**📱 Teléfono**: {company['phone']}
**📧 Email**: {company['email']}
**📍 Dirección**: {company['address']}
**🕒 Horarios**: {company['hours']}

**💬 Contacto Rápido:**
• WhatsApp: https://wa.me/{company['whatsapp']}
• Facebook: {company['social_media']['facebook']}
• Instagram: {company['social_media']['instagram']}

**🎯 ¿Cómo prefieres que te contactemos?**
Podemos llamarte, enviarte información por email, o agendar una cita presencial."""
    
    def _get_services_response(self) -> str:
        services = self.knowledge_base["services"]
        
        response = "🏆 **Nuestros Servicios Profesionales:**\n\n"
        
        for service in services:
            response += f"🔹 **{service['name']}**\n"
            response += f"   {service['description']}\n\n"
        
        response += "✨ **Servicios adicionales:**\n"
        response += "• Valuación profesional\n"
        response += "• Estudios de factibilidad\n"
        response += "• Acompañamiento post-venta\n"
        response += "• Referidos de constructores\n\n"
        response += "¿Qué servicio te interesa más?"
        
        return response
    
    def _get_thanks_response(self) -> str:
        responses = [
            "¡De nada! Es un placer ayudarte. ¿Hay algo más en lo que pueda asistirte?",
            "¡Con mucho gusto! Estoy aquí para resolver todas tus dudas sobre nuestros terrenos.",
            "¡Para eso estoy! ¿Te gustaría conocer más detalles de alguna propiedad en particular?"
        ]
        import random
        return random.choice(responses)
    
    def _get_default_response(self) -> str:
        responses = [
            "Interesante pregunta. Para darte la mejor respuesta, ¿podrías ser más específico? Puedo ayudarte con información sobre propiedades, precios, ubicaciones, financiamiento o servicios.",
            "Me gustaría ayudarte mejor. ¿Estás buscando información sobre alguna propiedad en particular, precios, o tal vez quieres agendar una visita?",
            "¡Buena pregunta! Para asistirte de la mejor manera, ¿te interesa conocer sobre nuestras propiedades disponibles, opciones de financiamiento, o nuestros servicios?"
        ]
        import random
        return random.choice(responses)
    
    def _store_conversation(self, session_id: str, user_message: str, 
                          bot_response: str, user_ip: str = None, 
                          page_url: str = None):
        """Store conversation in database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO conversations 
                (session_id, user_message, bot_response, user_ip, page_url)
                VALUES (?, ?, ?, ?, ?)
            ''', (session_id, user_message, bot_response, user_ip, page_url))
            
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Error storing conversation: {e}")
    
    def save_lead(self, name: str, email: str, phone: str = None, 
                  property_interest: str = None, message: str = None) -> bool:
        """Save potential lead information"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO leads 
                (name, email, phone, property_interest, message)
                VALUES (?, ?, ?, ?, ?)
            ''', (name, email, phone, property_interest, message))
            
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error saving lead: {e}")
            return False
    
    def get_conversation_history(self, session_id: str) -> List[Dict]:
        """Get conversation history for a session"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT user_message, bot_response, timestamp
                FROM conversations 
                WHERE session_id = ?
                ORDER BY timestamp ASC
            ''', (session_id,))
            
            results = cursor.fetchall()
            conn.close()
            
            history = []
            for row in results:
                history.append({
                    "user_message": row[0],
                    "bot_response": row[1],
                    "timestamp": row[2]
                })
            
            return history
        except Exception as e:
            print(f"Error getting conversation history: {e}")
            return []

# Example usage and testing
if __name__ == "__main__":
    chatbot = TerrenosChatbotBackend()
    
    # Test conversations
    test_messages = [
        "Hola, ¿qué propiedades tienen disponibles?",
        "¿Cuánto cuesta el terreno residencial?",
        "¿Dónde está ubicado?",
        "Quiero agendar una visita",
        "¿Qué opciones de financiamiento tienen?",
        "Gracias por la información"
    ]
    
    print("=== Probando Chatbot Backend ===\n")
    
    for message in test_messages:
        print(f"Usuario: {message}")
        response = chatbot.process_message(message, session_id="test_session")
        print(f"Bot: {response}\n")
        print("-" * 50 + "\n")
