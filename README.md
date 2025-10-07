Proyecto 2: Todo App — HTML + Bootstrap + JavaScript

Este proyecto es una versión mejorada del Todo App utilizando HTML, Bootstrap 5 y JavaScript puro. La aplicación permite crear, listar, editar y eliminar tareas, con una interfaz responsive gracias a Bootstrap.

📁 Estructura del proyecto
proyecto 2/
│
├── public/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
│
├── Dockerfile
├── docker-compose.build.yml
├── docker-compose.run.yml
└── README.md

✅ Requisitos

Navegador moderno (Chrome, Edge, Firefox, etc.)

Docker instalado (si usas contenedores)

Python (opcional para ejecutar sin Docker)

▶️ Ejecutar SIN Docker

Entra a la carpeta public/:

cd "public"


Ejecuta un servidor simple (ejemplo con Python):

python -m http.server 8091


Abre en el navegador:

http://localhost:8091

▶️ Ejecutar CON Docker
✅ 1. Construir imagen
docker compose -f docker-compose.build.yml up -d --build


Esto genera y levanta el contenedor con la imagen:

tatt07/project2-bootstrap:latest

✅ 2. Levantar contenedor manualmente (si ya existe la imagen)
docker compose -f docker-compose.run.yml up -d

✅ 3. Ver en el navegador
http://localhost:8091

📦 Imagen en DockerHub

La imagen está publicada como:

tatt07/project2-bootstrap:latest


Si necesitas subirla manualmente:

docker login
docker push tatt07/project2-bootstrap:latest

📝 Funcionalidades principales

✅ Crear tareas
✅ Editar tareas existentes
✅ Marcar como completadas
✅ Eliminar tareas
✅ Diseño responsive con Bootstrap
✅ Interfaz mejorada respecto al Proyecto 1

👤 Autor

Usuario de DockerHub: tatt07
Proyecto: project2-bootstrapg