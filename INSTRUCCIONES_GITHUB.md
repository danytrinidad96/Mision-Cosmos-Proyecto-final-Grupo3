# Guía de Despliegue en la Nube - Misión Cosmos (Grupo 3)

Esta guía te explica cómo subir tu proyecto **Misión Cosmos** a GitHub de forma correcta, asegurándote de que se suban todos los archivos (HTML, CSS, JS e imágenes) y que la web funcione en la nube (GitHub Pages) con persistencia de base de datos.

---

## 📌 ¿Por qué antes solo se subía `index.html` o daba pantalla negra?
1. **Error de Carpeta**: Si inicializabas Git en la carpeta raíz vieja (`GRUPO 3`), subías el `index.html` viejo y la carpeta `proyecto final` quedaba como un subdirectorio.
2. **Error de git add**: Si por error ejecutabas `git add index.html`, Git solo registraba ese archivo. Debes usar `git add .` para incluir todas las carpetas (`js/`, `css/`, `images/` y `.github/`).
3. **Paths Absolutos**: Si usabas rutas con barra inicial (ej. `/js/app.js`), GitHub Pages no encontraba el archivo en el subdirectorio del repositorio. Lo corregimos usando rutas relativas puras (ej. `js/app.js`).

---

## 🚀 Paso a Paso para Subir a GitHub

Sigue estos pasos dentro de la carpeta **`proyecto para GitHub`** que está en tu Escritorio:

### Paso 1: Inicializar el repositorio Git
Abre la terminal de comandos (Git Bash, PowerShell o CMD), colócate dentro de la carpeta `proyecto para GitHub` y ejecuta:
```bash
git init
```

### Paso 2: Agregar TODOS los archivos (¡Crucial!)
Para asegurarte de subir el HTML, los scripts de Three.js, estilos e imágenes, ejecuta:
```bash
git add .
```
*(El punto `.` le indica a Git que agregue todos los archivos y subcarpetas del proyecto de forma recursiva).*

### Paso 3: Crear el primer commit
Registra tus cambios localmente:
```bash
git commit -m "Entrega Final Misión Cosmos - Grupo 3"
```

### Paso 4: Vincular con tu repositorio de GitHub
Crea un nuevo repositorio **público** en tu cuenta de GitHub (por ejemplo, llamado `mision-cosmos`) y ejecuta los siguientes comandos para vincularlo y subir el código (reemplaza con tu usuario y nombre de repositorio):
```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mision-cosmos.git
git push -u origin main
```

---

## 🌐 Configurar y Activar GitHub Pages en la Nube

Una vez que hayas subido el proyecto, sigue estos pasos en la web de GitHub para activar el metaverso interactivo:

1. Entra a tu repositorio en GitHub desde el navegador.
2. Ve a la pestaña **Settings** (Configuración) arriba a la derecha.
3. En el menú de la izquierda, haz clic en **Pages**.
4. En la sección **Build and deployment**:
   - En **Source**, selecciona **GitHub Actions** (en lugar de "Deploy from a branch").
5. ¡Listo! El archivo `.github/workflows/deploy.yml` que te preparamos en la carpeta se activará automáticamente y creará la web.
6. En la pestaña **Actions** arriba, verás el progreso del despliegue. Al terminar, te dará el enlace público del metaverso (ej. `https://TU_USUARIO.github.io/mision-cosmos/`).

---

## 💾 Persistencia en la Nube (LocalStorage)
Al cargar la web desde el enlace de GitHub Pages, la aplicación detectará automáticamente que no hay un servidor de Node.js corriendo detrás y **guardará todo el progreso de los estudiantes (XP, registro, misiones completadas) de forma local en el navegador (LocalStorage)**, permitiendo que la plataforma y la consola del maestro funcionen de forma impecable sin arrojar errores.
