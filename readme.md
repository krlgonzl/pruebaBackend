Guía de Implementación - API de Gestión de Activos
Esta guía detalla cómo configurar y ejecutar localmente la API de gestión de activos desarrollada con Node.js, Express, Sequelize y PostgreSQL, incluyendo cómo consumir los endpoints con Postman.

📌 Requisitos Previos
Node.js (v18+ recomendado)

PostgreSQL (v15+ recomendado)

Postman (o cualquier cliente HTTP)

Visual Studio Code (o editor de preferencia)

🚀 Configuración Inicial
1. Clonar el Repositorio
bash
git clone https://github.com/krlgonzl/pruebaBackend.git
cd pruebaBackend
2. Instalar Dependencias
bash
npm install
3. Configurar Base de Datos (PostgreSQL)
Crear una base de datos:
sql
CREATE DATABASE prueba;
Configurar variables de entorno:


4. Sincronizar Base de Datos
bash
node sync.js
5. Iniciar el Servidor
bash
npm run dev
Nota: El servidor estará disponible en http://localhost:4000.

🔌 Estructura del Proyecto
pruebaBackend/
├── config/
│   └── database.js       # Configuración de Sequelize
├── controllers/
│   ├── areaController.js
│   ├── assetController.js
│   ├── custodioController.js
│   └── movimientoController.js
├── models/
│   ├── area.js
│   ├── Asset.js
│   ├── custodio.js
│   ├── movimiento.js
│   └── index.js          # Relaciones entre modelos
├── routes/
│   ├── areas.js
│   ├── assets.js
│   ├── custodios.js
│   └── movimientos.js
├── .env                  # Variables de entorno
├── app.js                # Punto de entrada principal
├── package.json
├── package-lock.json
├── postmanQuery.json     # Colección Postman

📡 Endpoints Disponibles
🔹 Activos (Assets)
Método	Endpoint	Descripción
GET	/api/assets	Obtener todos los activos
POST	/api/assets	Crear nuevo activo
PUT	/api/assets/:id	Actualizar activo
DELETE	/api/assets/:id	Baja lógica de activo
Ejemplo POST (Crear Activo):

json
{
  "name": "Laptop Dell",
  "valor": 1500,
  "custodio_id": 1
}
🔹 Movimientos
Método	Endpoint	Descripción
POST	/api/movimientos/trasladar	Registrar traslado
Ejemplo Body para Traslado:

json
{
  "activo_id": 5,
  "custodio_nuevo_id": 3,
  "motivo": "Reubicación de oficina"
}
🔍 Colección Postman
Importa el archivo postmanQuery.json en Postman para:
✅ Pruebas rápidas de todos los endpoints
✅ Ejemplos preconfigurados de requests

Pasos:

Abre Postman

Click en "Import" > Sube el archivo JSON

Ejecuta los requests de prueba

🛠️ Solución de Problemas
1. Error de Conexión a PostgreSQL
bash
# Verificar servicio
sudo service postgresql status

# Revisar credenciales en .env
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña_correcta
2. Sincronización Fallida
bash
# Ejecutar manualmente
node sync.js

# Verificar tablas en psql
\dt
3. Datos no Persisten
Verifica que los modelos tengan timestamps: true

Revisa transacciones en controladores

