// Chatbot System for Terrenos Premium

class TerrenosChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.init();
    }

    // Initialize the chatbot
    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    // Create chatbot HTML structure
    createChatbotHTML() {
        const chatbotContainer = document.getElementById('chatbot-container');
        
        chatbotContainer.innerHTML = `
            <button class="chatbot-button" id="chatbotButton">
                <i class="fas fa-comments"></i>
            </button>
            
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <i class="fas fa-robot"></i>
                        <span>Asistente Virtual</span>
                    </div>
                    <button class="chatbot-close" id="chatbotClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chatbot-messages" id="chatbotMessages">
                    <!-- Messages will be added here -->
                </div>
                
                <div class="chatbot-input">
                    <input type="text" id="chatbotInput" placeholder="Escribe tu pregunta aquí...">
                    <button id="chatbotSend">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                
                <div class="chatbot-quick-actions">
                    <button class="quick-action" onclick="chatbot.sendQuickMessage('¿Qué propiedades tienen disponibles?')">
                        Ver Propiedades
                    </button>
                    <button class="quick-action" onclick="chatbot.sendQuickMessage('¿Cuáles son los precios?')">
                        Consultar Precios
                    </button>
                    <button class="quick-action" onclick="chatbot.sendQuickMessage('Quiero agendar una visita')">
                        Agendar Visita
                    </button>
                </div>
            </div>
        `;
    }

    // Attach event listeners
    attachEventListeners() {
        const button = document.getElementById('chatbotButton');
        const closeBtn = document.getElementById('chatbotClose');
        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');

        button.addEventListener('click', () => this.toggleChatbot());
        closeBtn.addEventListener('click', () => this.closeChatbot());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Close chatbot when clicking outside
        document.addEventListener('click', (e) => {
            const chatbotWindow = document.getElementById('chatbotWindow');
            const chatbotButton = document.getElementById('chatbotButton');
            
            if (this.isOpen && !chatbotWindow.contains(e.target) && !chatbotButton.contains(e.target)) {
                this.closeChatbot();
            }
        });
    }

    // Toggle chatbot visibility
    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    // Open chatbot
    openChatbot() {
        const window = document.getElementById('chatbotWindow');
        window.style.display = 'flex';
        this.isOpen = true;
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('chatbotInput').focus();
        }, 100);
    }

    // Close chatbot
    closeChatbot() {
        const window = document.getElementById('chatbotWindow');
        window.style.display = 'none';
        this.isOpen = false;
    }

    // Add welcome message
    addWelcomeMessage() {
        const welcomeMessage = "¡Hola! Soy tu asistente virtual de Terrenos Premium. ¿En qué puedo ayudarte hoy? Puedo ayudarte con información sobre nuestras propiedades, precios, ubicaciones y más.";
        this.addMessage(welcomeMessage, 'bot');
    }

    // Send message
    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            
            // Process message and get response
            setTimeout(() => {
                const response = this.processMessage(message);
                this.addMessage(response, 'bot');
            }, 500);
        }
    }

    // Send quick message
    sendQuickMessage(message) {
        this.addMessage(message, 'user');
        
        setTimeout(() => {
            const response = this.processMessage(message);
            this.addMessage(response, 'bot');
        }, 500);
    }

    // Add message to chat
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">${text}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">${text}</div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store message
        this.messages.push({ text, sender, timestamp: new Date() });
    }

    // Process user message and generate response
    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Property inquiries
        if (lowerMessage.includes('propiedad') || lowerMessage.includes('terreno') || lowerMessage.includes('disponible')) {
            return this.getPropertyInfo(lowerMessage);
        }
        
        // Price inquiries
        if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuanto')) {
            return this.getPriceInfo(lowerMessage);
        }
        
        // Location inquiries
        if (lowerMessage.includes('ubicación') || lowerMessage.includes('donde') || lowerMessage.includes('dirección')) {
            return this.getLocationInfo(lowerMessage);
        }
        
        // Visit scheduling
        if (lowerMessage.includes('visita') || lowerMessage.includes('agendar') || lowerMessage.includes('cita')) {
            return this.getVisitInfo();
        }
        
        // Financing inquiries
        if (lowerMessage.includes('financiamiento') || lowerMessage.includes('crédito') || lowerMessage.includes('pago')) {
            return this.getFinancingInfo();
        }
        
        // Contact information
        if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono') || lowerMessage.includes('email')) {
            return this.getContactInfo();
        }
        
        // Services
        if (lowerMessage.includes('servicio') || lowerMessage.includes('asesoría') || lowerMessage.includes('ayuda')) {
            return this.getServicesInfo();
        }
        
        // Greetings
        if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas')) {
            return "¡Hola! Es un placer ayudarte. ¿Qué información sobre nuestros terrenos te interesa conocer?";
        }
        
        // Thanks
        if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
            return "¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?";
        }
        
        // Default response
        return this.getDefaultResponse();
    }

    // Get property information
    getPropertyInfo(message) {
        if (message.includes('residencial') || message.includes('casa')) {
            return `Tenemos el **Terreno Residencial Las Flores** de 500 m² por $85,000 USD. Está ubicado en Zona Norte con todos los servicios disponibles. ¿Te gustaría más detalles sobre esta propiedad?`;
        }
        
        if (message.includes('comercial') || message.includes('negocio')) {
            return `Nuestro **Terreno Comercial Centro** de 800 m² está disponible por $150,000 USD. Ubicación estratégica con alto tráfico peatonal. ¿Quieres saber más?`;
        }
        
        if (message.includes('industrial')) {
            return `El **Terreno Industrial El Progreso** de 1,200 m² está en $120,000 USD. Perfecto para desarrollo industrial con acceso a carreteras principales.`;
        }
        
        if (message.includes('campestre') || message.includes('rural')) {
            return `Tenemos el **Terreno Campestre Vista Hermosa** de 2,000 m² por $65,000 USD. Ideal para casa de campo con vista panorámica.`;
        }
        
        return `Tenemos 4 excelentes propiedades disponibles:
        
🏠 **Residencial Las Flores** - 500 m² - $85,000 USD
🏢 **Comercial Centro** - 800 m² - $150,000 USD  
🏭 **Industrial El Progreso** - 1,200 m² - $120,000 USD
🌳 **Campestre Vista Hermosa** - 2,000 m² - $65,000 USD

¿Cuál te interesa más?`;
    }

    // Get price information
    getPriceInfo(message) {
        return `Nuestros precios actuales son:

💰 **Terreno Residencial Las Flores**: $85,000 USD (500 m²)
💰 **Terreno Comercial Centro**: $150,000 USD (800 m²)
💰 **Terreno Industrial El Progreso**: $120,000 USD (1,200 m²)
💰 **Terreno Campestre Vista Hermosa**: $65,000 USD (2,000 m²)

Todos los precios incluyen escrituración. ¿Te interesa alguna opción de financiamiento?`;
    }

    // Get location information
    getLocationInfo(message) {
        return `📍 **Ubicaciones de nuestras propiedades:**

🏠 **Residencial Las Flores**: Zona Norte, Ciudad
🏢 **Comercial Centro**: Centro Comercial
🏭 **Industrial El Progreso**: Zona Industrial
🌳 **Campestre Vista Hermosa**: Zona Rural

Nuestra oficina está en Av. Principal 123, Centro. ¿Te gustaría agendar una visita a alguna propiedad?`;
    }

    // Get visit information
    getVisitInfo() {
        return `¡Excelente! Para agendar una visita puedes:

📞 **Llamarnos**: +1 234 567 8900
📱 **WhatsApp**: [Enviar mensaje](https://wa.me/1234567890)
📧 **Email**: info@terrenospremium.com

También puedes llenar nuestro formulario de contacto. ¿Qué propiedad te gustaría visitar?`;
    }

    // Get financing information
    getFinancingInfo() {
        return `💳 **Opciones de Financiamiento:**

✅ Créditos bancarios con tasas preferenciales
✅ Planes de pago directo a 12, 24 o 36 meses
✅ Enganche desde 20%
✅ Asesoría personalizada gratuita

Trabajamos con las mejores instituciones financieras. ¿Te gustaría una cotización personalizada?`;
    }

    // Get contact information
    getContactInfo() {
        return `📞 **Información de Contacto:**

**Teléfono**: +1 234 567 8900
**Email**: info@terrenospremium.com
**Dirección**: Av. Principal 123, Centro, Ciudad
**Horarios**: Lun-Vie 9:00 AM - 6:00 PM, Sáb 9:00 AM - 2:00 PM

**Redes Sociales:**
- Facebook: Terrenos Premium
- Instagram: @terrenospremium
- WhatsApp: +1 234 567 8900`;
    }

    // Get services information
    getServicesInfo() {
        return `🏆 **Nuestros Servicios:**

🔍 **Búsqueda Personalizada**: Te ayudamos a encontrar el terreno perfecto
📋 **Asesoría Legal**: Acompañamiento en trámites y documentación
💰 **Financiamiento**: Opciones flexibles adaptadas a tu presupuesto
📐 **Topografía**: Levantamientos topográficos profesionales
🏗️ **Permisos**: Gestión de permisos de construcción

¿Qué servicio te interesa más?`;
    }

    // Default response
    getDefaultResponse() {
        const responses = [
            "Interesante pregunta. ¿Podrías ser más específico? Puedo ayudarte con información sobre propiedades, precios, ubicaciones, financiamiento o servicios.",
            "No estoy seguro de entender completamente. ¿Te refieres a información sobre nuestros terrenos, precios o servicios?",
            "¡Buena pregunta! Para darte la mejor respuesta, ¿podrías especificar si buscas información sobre propiedades, precios, ubicaciones o servicios?",
            "Me gustaría ayudarte mejor. ¿Estás interesado en conocer sobre nuestras propiedades disponibles, precios, o tal vez agendar una visita?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Initialize knowledge base
    initializeKnowledgeBase() {
        return {
            properties: [
                {
                    id: 'terreno1',
                    name: 'Terreno Residencial Las Flores',
                    price: '$85,000 USD',
                    area: '500 m²',
                    location: 'Zona Norte, Ciudad',
                    type: 'residencial',
                    features: ['Agua potable', 'Electricidad', 'Drenaje', 'Pavimentación', 'Seguridad 24/7']
                },
                {
                    id: 'terreno2',
                    name: 'Terreno Comercial Centro',
                    price: '$150,000 USD',
                    area: '800 m²',
                    location: 'Centro Comercial',
                    type: 'comercial',
                    features: ['Ubicación estratégica', 'Alto tráfico peatonal', 'Transporte público', 'Zonificación comercial']
                },
                {
                    id: 'terreno3',
                    name: 'Terreno Industrial El Progreso',
                    price: '$120,000 USD',
                    area: '1,200 m²',
                    location: 'Zona Industrial',
                    type: 'industrial',
                    features: ['Acceso a carreteras', 'Servicios industriales', 'Zonificación industrial', 'Amplio espacio']
                },
                {
                    id: 'terreno4',
                    name: 'Terreno Campestre Vista Hermosa',
                    price: '$65,000 USD',
                    area: '2,000 m²',
                    location: 'Zona Rural',
                    type: 'campestre',
                    features: ['Vista panorámica', 'Ambiente natural', 'Aire puro', 'Tranquilidad']
                }
            ],
            contact: {
                phone: '+1 234 567 8900',
                email: 'info@terrenospremium.com',
                address: 'Av. Principal 123, Centro, Ciudad',
                hours: 'Lun-Vie 9:00 AM - 6:00 PM, Sáb 9:00 AM - 2:00 PM'
            },
            services: [
                'Búsqueda Personalizada',
                'Asesoría Legal',
                'Financiamiento',
                'Topografía',
                'Gestión de Permisos'
            ]
        };
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.chatbot = new TerrenosChatbot();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TerrenosChatbot;
}
