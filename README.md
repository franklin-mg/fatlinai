# ⬡ Fatlin AI — Adventure

**Plataforma educativa gamificada para la Metodología PACIE**  
Desarrollada con Firebase · Claude AI (Anthropic) · PWA nativa

🌐 **Demo en vivo:** [fatlin.web.app](https://fatlin.web.app)  
📜 **Verificar diplomas:** [fatlin.web.app/verify.html](https://fatlin.web.app/verify.html)

---

## 📁 Estructura del Proyecto

```
fatlin/
│
├── index.html              # App principal (HTML limpio ~1.000 líneas)
├── verify.html             # Verificador público de diplomas
├── diploma-simulator.html  # Simulador visual de los 11 tiers
│
├── css/
│   └── styles.css          # Todos los estilos (cacheable, inmutable)
│
├── js/
│   ├── main.js             # Módulo principal (Firebase · Juego · UI)
│   ├── pwa.js              # Service Worker registration & PWA install
│   ├── splash.js           # Selector de idioma · Watchdog auth
│   └── restSystem.js       # Sistema de alertas de descanso (IIFE)
│
├── icons/                  # Iconos PWA (48 → 512px)
│   ├── icon-48.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   └── icon-512.png
│
├── sw.js                   # Service Worker (Network First/Cache First)
├── manifest.json           # PWA manifest
│
├── firebase.json           # Configuración Firebase Hosting
├── firestore.rules         # Reglas de seguridad Firestore
├── firestore.indexes.json  # Índices para ranking y ligas
├── .firebaserc             # Vinculación proyecto Firebase "fatlin"
│
├── .gitignore
└── README.md
```

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | HTML5 · CSS3 · JavaScript ES2022 (sin framework) |
| Autenticación | Firebase Auth (Google + Email) |
| Base de datos | Cloud Firestore (NoSQL) |
| IA Generativa | Claude Sonnet 4 — Anthropic |
| Proxy IA | Cloud Functions for Firebase |
| Hosting | Firebase Hosting (CDN global) |
| PWA | Service Worker + Web App Manifest |

---

## 🎮 Características

- **550 niveles** organizados en 11 tiers de dificultad creciente
- **5 tipos de preguntas** generadas por IA: mc · tf · fw · match · case
- **Sistema anti-repetición** con pool persistente (localStorage)
- **11 diplomas verificables** con QR y hash determinista FNV-32
- **Ranking global** y **liga semanal** en tiempo real (Firestore)
- **Sistema de vidas** con regeneración cada 3 horas
- **Tienda** de escudos y modo GALA (vidas infinitas)
- **Multiidioma**: Español / English
- **PWA instalable** en Android e iOS

---

## 🔧 Deploy a Firebase

```bash
# 1. Instalar Firebase CLI (una sola vez)
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Desde la carpeta del proyecto
firebase deploy

# Solo hosting (sin Firestore rules)
firebase deploy --only hosting

# Solo reglas Firestore
firebase deploy --only firestore:rules
```

> ⚠️ El archivo `sw.js` tiene un `CACHE_VERSION`. **Actualízalo en cada deploy** para forzar que los usuarios reciban la nueva versión (`fatlin-v8` → `fatlin-v9`, etc.).

---

## 📂 Subir a GitHub

```bash
# Desde la carpeta del proyecto
git init
git add .
git commit -m "feat: modularización CSS/JS + SVG sprite + estructura Firebase"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/fatlin-ai.git
git push -u origin main
```

### Integración GitHub → Firebase (CI/CD automático)

Para que cada `git push` haga deploy automático a Firebase Hosting:

1. En Firebase Console → **Hosting** → **GitHub** → conectar repositorio
2. Firebase crea automáticamente `.github/workflows/firebase-hosting-*.yml`
3. Cada push a `main` despliega en producción · PRs despliegan en preview

---

## 🔐 Variables de entorno

La API key de Firebase está incluida en `main.js` (es pública por diseño — Firebase protege mediante reglas de seguridad, no ocultando la key).

La API key de **Anthropic Claude** **NUNCA** debe ir en el código cliente. Vive únicamente en el **Cloud Function proxy** (`claudeProxy`) configurada en Firebase Console → Functions → Environment variables.

---

## 🏢 Alianzas Institucionales

| Organización | Rol |
|---|---|
| [FATLA](https://fatla.org) | Fundación académica rectora · Validación de contenidos |
| [PACIE Education](https://pacie.education/portal) | Fuente metodológica primaria |
| [ASOMTV](https://asomtv.org) | Comunidad virtual y difusión audiovisual |

---

**TecnoTips © 2026 · Tecnología con Propósito**
