# Proyecto CallCenter App

Este proyecto es una aplicación web diseñada para gestionar llamadas, notificaciones y contactos, enfocada en un entorno empresarial. El proyecto incluye funcionalidades básicas y avanzadas para el manejo de contactos, autenticación, y administración de perfiles de usuarios y empresas.

---

## Changelog

### Versión 0.1.0

**Funcionalidades implementadas:**
- Página de Login: [Login](https://chic-paprenjak-dd0ba7.netlify.app/auth/login)
- Página de recuperar contraseña: [Recuperar contraseña](https://chic-paprenjak-dd0ba7.netlify.app/auth/reset-password)
- Página de registro: [Registro](https://chic-paprenjak-dd0ba7.netlify.app/auth/register)
- Opción de continuar como invitado.
- Opción de Llamar (solo interfaz gráfica): incluye modal expandible.
- Interfaz de llamada en curso.
- Sistema de notificaciones funcional con base de datos.
- Sección de contactos (CRUD), importar y exportar contactos.
- Continuar con el registro (pendiente de corregir).
- Página "Mi Cuenta": permite editar nombre, correo y actualizar foto de perfil.
- Página de perfil de la empresa: [Perfil de la Empresa](https://chic-paprenjak-dd0ba7.netlify.app/company).

**Pendientes por desarrollar:**
- Permitir que la empresa cargue su logo.
- Integración con Stripe.
- Implementación de una billetera con saldo.
- Llamadas directas desde la vista de contacto.

**Errores conocidos:**
- Error inesperado al crear la cuenta.
- Inicio de sesión automático como invitado no funciona correctamente.
- Error al actualizar la foto de perfil.
- Error al actualizar el perfil desde la barra superior.
- El login redirige a la página de completar registro: [Login](https://chic-paprenjak-dd0ba7.netlify.app/auth/login).
- Error al importar contactos.
- El menú para cambiar de empresa no funciona como se espera.

---

## Instrucciones de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/usuario/proyecto-callcenter-app.git
   cd proyecto-callcenter-app
   ```

2. **Instalar dependencias:**
   Asegúrate de tener Node.js instalado. Luego, ejecuta:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   - Renombra el archivo `.env.example` a `.env` y completa los valores requeridos:
     ```env
     VITE_SUPABASE_ANON_KEY=tu_clave
     VITE_SUPABASE_URL=tu_url
     ```

4. **Iniciar la aplicación:**
   ```bash
   npm run dev
   ```

5. **Acceder a la aplicación:**
   - Abre tu navegador y visita: `http://localhost:5173`.

---

## Estructura del Proyecto

```plaintext
/ ─── src
    ├── components     # Componentes reutilizables
    ├── lib            # Lógica compartida y configuración
    ├── pages          # Páginas principales
    ├── styles         # Estilos globales
    └── App.tsx        # Punto de entrada principal
```

---

## Guía de Desarrollo

1. **Ejecución de tests:**
   ```bash
   npm run test
   ```

2. **Compilación para producción:**
   ```bash
   npm run build
   ```

3. **Previsualización del build:**
   ```bash
   npm run preview
   ```

---

## Tecnologías Utilizadas

- **Frontend:** React con TypeScript.
- **Estilos:** Tailwind CSS.
- **Autenticación:** Supabase.
- **Gestión de Estado:** Zustand.
- **Backend:** Supabase (como base de datos y almacenamiento).

---

## Cómo Contribuir

1. Haz un fork del proyecto.
2. Crea una nueva rama:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza los cambios y haz commit:
   ```bash
   git commit -m "Añadida nueva funcionalidad X"
   ```
4. Haz push a tu rama:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Abre un Pull Request en GitHub.

---

## Contacto

Si tienes preguntas o necesitas soporte, contacta a [soporte@callcenterapp.com](mailto:soporte@callcenterapp.com).

---

## Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo `LICENSE`.

