# Terrenos Premium - Sitio Web Completo

Un sitio web moderno y completo para la venta de terrenos con sistema de chatbot inteligente, páginas de detalle de propiedades y formularios de contacto.

## 🏗️ Estructura del Proyecto

```
terrenosprueba/
├── index.html              # Página principal
├── css/
│   ├── styles.css          # Estilos principales
│   ├── property-detail.css # Estilos para páginas de detalle
│   └── contact.css         # Estilos para página de contacto
├── js/
│   ├── main.js             # JavaScript principal
│   ├── property-detail.js  # Funcionalidad de páginas de detalle
│   └── contact.js          # Funcionalidad de contacto
├── public/
│   ├── terreno1.html       # Detalle Terreno Residencial
│   ├── terreno2.html       # Detalle Terreno Comercial
│   ├── terreno3.html       # Detalle Terreno Industrial
│   ├── terreno4.html       # Detalle Terreno Campestre
│   └── contacto.html       # Página de contacto
├── chatbot/
│   ├── chatbot.js          # Sistema de chatbot frontend
│   └── chatbot.py          # Backend inteligente del chatbot
├── img/
│   └── README.md           # Guía para imágenes
├── requirements.txt        # Dependencias Python
└── README.md              # Este archivo
```

## ✨ Características

### 🏠 Página Principal (index.html)
- **Hero Section** atractivo con llamada a la acción
- **Showcase de Propiedades** con 4 terrenos destacados
- **Sección de Servicios** profesionales
- **Navegación responsive** con menú hamburguesa
- **Footer completo** con información de contacto

### 🏘️ Páginas de Detalle de Propiedades
- **Galería de imágenes** interactiva
- **Información completa** de cada terreno
- **Características detalladas** y servicios incluidos
- **Formularios de contacto** específicos por propiedad
- **Propiedades similares** sugeridas
- **Calculadora de financiamiento**
- **Botones de acción** (contactar, agendar visita, más info)

### 📞 Página de Contacto
- **Formulario completo** con validación
- **Información de contacto** detallada
- **Botones de contacto rápido** (WhatsApp, teléfono, email)
- **Sección de preguntas frecuentes** (FAQ)
- **Mapa de ubicación** de la oficina
- **Redes sociales**

### 🤖 Sistema de Chatbot
- **Botón flotante** disponible en todas las páginas
- **Interfaz conversacional** intuitiva
- **Respuestas inteligentes** sobre propiedades, precios, ubicaciones
- **Acciones rápidas** predefinidas
- **Backend en Python** con procesamiento de lenguaje natural
- **Base de datos** para almacenar conversaciones
- **Sistema de leads** integrado

## 🚀 Instalación y Configuración

### Requisitos Previos
- Navegador web moderno
- Python 3.8+ (para el chatbot backend)
- Servidor web local (opcional)

### Instalación Básica

1. **Clonar o descargar** el proyecto:
```bash
git clone [URL_DEL_REPOSITORIO]
cd terrenosprueba
```

2. **Abrir el sitio web**:
   - Opción 1: Abrir `index.html` directamente en el navegador
   - Opción 2: Usar un servidor local (recomendado)

### Servidor Local (Recomendado)

#### Con Python:
```bash
# Python 3
python -m http.server 8000

# Abrir en navegador: http://localhost:8000
```

#### Con Node.js:
```bash
npx http-server
```

#### Con PHP:
```bash
php -S localhost:8000
```

### Configuración del Chatbot Backend

1. **Instalar dependencias Python**:
```bash
pip install -r requirements.txt
```

2. **Ejecutar el backend del chatbot**:
```bash
cd chatbot
python chatbot.py
```

3. **Configurar API endpoint** (opcional):
   - Editar `chatbot/chatbot.js`
   - Actualizar la URL del backend si es necesario

## 🎨 Personalización

### Colores y Estilos
Los colores principales se definen en `css/styles.css`:
```css
:root {
  --primary-color: #4CAF50;
  --secondary-color: #2c5530;
  --accent-color: #45a049;
}
```

### Propiedades
Para agregar/modificar propiedades:

1. **Frontend**: Editar el array `PropertyManager.properties` en `js/main.js`
2. **Backend**: Actualizar `knowledge_base["properties"]` en `chatbot/chatbot.py`
3. **Crear nueva página**: Duplicar y modificar cualquier archivo `terreno*.html`

### Información de Contacto
Actualizar en múltiples archivos:
- `index.html` (footer)
- `public/contacto.html`
- `chatbot/chatbot.py` (knowledge_base["company_info"])

## 📱 Funcionalidades Principales

### 🏠 Gestión de Propiedades
- 4 tipos de terrenos: Residencial, Comercial, Industrial, Campestre
- Información detallada: precio, área, ubicación, características
- Galería de imágenes por propiedad
- Sistema de filtros y búsqueda

### 💬 Sistema de Chatbot Inteligente
- Procesamiento de lenguaje natural
- Respuestas contextuales sobre propiedades
- Generación automática de leads
- Historial de conversaciones
- Integración con WhatsApp y teléfono

### 📋 Formularios y Contacto
- Validación en tiempo real
- Notificaciones de éxito/error
- Almacenamiento local de envíos
- Integración con sistemas de email

### 📊 Analytics y Seguimiento
- Tracking de interacciones del chatbot
- Almacenamiento de leads potenciales
- Historial de consultas por propiedad

## 🔧 Configuración Avanzada

### Base de Datos del Chatbot
El sistema crea automáticamente una base de datos SQLite en `chatbot/chatbot.db` con:
- Tabla `conversations`: Historial de conversaciones
- Tabla `leads`: Información de clientes potenciales

### Integración con APIs Externas
Para integrar con servicios externos:

1. **Email**: Configurar SMTP en el backend
2. **WhatsApp Business API**: Actualizar enlaces y configuración
3. **Google Maps**: Agregar API key para mapas reales
4. **CRM**: Integrar con sistemas como Salesforce, HubSpot

### Optimización para Producción

1. **Minificar CSS/JS**:
```bash
# Usar herramientas como UglifyJS, CleanCSS
```

2. **Optimizar imágenes**:
   - Convertir a WebP
   - Comprimir para web
   - Implementar lazy loading

3. **CDN y Caching**:
   - Configurar headers de cache
   - Usar CDN para recursos estáticos

## 🌐 Despliegue

### Hosting Estático
- **Netlify**: Arrastrar carpeta del proyecto
- **Vercel**: Conectar repositorio Git
- **GitHub Pages**: Push a repositorio público

### Hosting con Backend
- **Heroku**: Para el chatbot Python
- **DigitalOcean**: VPS completo
- **AWS/Azure**: Servicios en la nube

### Variables de Entorno
Crear archivo `.env` para configuración:
```env
CHATBOT_DB_PATH=chatbot/chatbot.db
COMPANY_PHONE=+1234567890
COMPANY_EMAIL=info@terrenospremium.com
WHATSAPP_NUMBER=1234567890
```

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Chatbot no aparece**:
   - Verificar que `chatbot/chatbot.js` se carga correctamente
   - Revisar consola del navegador para errores

2. **Formularios no funcionan**:
   - Verificar validación JavaScript
   - Comprobar configuración de backend

3. **Imágenes no cargan**:
   - Verificar rutas en HTML
   - Agregar imágenes reales en carpeta `img/`

### Logs y Debugging
- Abrir DevTools del navegador (F12)
- Revisar consola para errores JavaScript
- Verificar Network tab para recursos no encontrados

## 📞 Soporte

Para soporte técnico o preguntas:
- **Email**: soporte@terrenospremium.com
- **Documentación**: Ver archivos README en cada carpeta
- **Issues**: Crear issue en el repositorio

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas:

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

**Terrenos Premium** - Tu mejor opción para invertir en terrenos 🏡
