# Proyecto Final SysAdmin 2025 – Microservicios Seguros y Alta Disponibilidad

## Contexto y extensión del proyecto

Este proyecto es una **extensión** del repositorio original desarrollado para la **Unidad 2**, montado localmente sin HTTPS ni alta disponibilidad, disponible en:

https://github.com/dsalvador21/ProyectoAdminU2  
Documentación detallada de la versión base en su `README.md`.

En esta versión extendida (Unidad 3), se incorporan:

- Certificados HTTPS válidos (Let’s Encrypt)
- Proxy inverso seguro con Nginx Proxy Manager
- Alta disponibilidad mediante **Docker Swarm**
- Réplicas automáticas y resiliencia frente a fallos
- Mitigaciones frente a ataques DoS

---

## ¿Cómo ejecutar el proyecto?

### 1. Clonar este repositorio
```bash
git clone https://github.com/dsalvador21/ProyectoAdmin.git
cd ProyectoAdmin
```

### 2. Requisitos previos
- Una máquina virtual **con acceso a Internet** y **IP pública**
- Dominio registrado (por ejemplo, desde https://freedns.afraid.org)
- Docker y Docker Swarm instalados
- Acceso por SSH al servidor

### 3. Inicializar Docker Swarm (solo la primera vez)
```bash
docker swarm init
```

### 4. Desplegar la aplicación con alta disponibilidad
```bash
docker stack deploy -c docker-compose.yml proyecto
```

Esto creará:
- Red de microservicios segura
- Réplicas de servicios
- Balanceo automático de carga
- Servicios expuestos a través del proxy

---

## Configuración HTTPS

- Se utilizó **Nginx Proxy Manager (NPM)** como API Gateway con HTTPS.
- El dominio público se configuró para apuntar a la IP de la máquina.
- Certificados TLS fueron obtenidos automáticamente mediante **Let's Encrypt**.
- Todo el tráfico HTTP (puerto 80) es redirigido a HTTPS (puerto 443).

**Guía paso a paso de configuración del proxy, dominio y certificados** disponible en:  
https://github.com/dsalvador21/ProyectoAdmin/blob/main/docs.pdf

---

## Servicios disponibles

- **User Service** → `/api/users`
- **Task Service** → `/api/tasks`
- **Nginx Proxy Manager UI** → `admin.dominio`

---

## Docker Swarm – Comandos útiles

### Ver el estado del stack
```bash
docker stack ls
docker stack ps proyecto
```

### Ver servicios y réplicas
```bash
docker service ls
docker service ps proyecto_user-service
docker service ps proyecto_task-service
```

### Escalar réplicas manualmente
```bash
docker service scale proyecto_user-service=3
```

### Parar una réplica específica
```bash
docker container rm -f <container_id>
```

### Eliminar el stack por completo
```bash
docker stack rm proyecto
```

---

## Evidencias incluidas

- Capturas del dominio corriendo con HTTPS
- Logs de ataques DoS antes/después
- Logs y capturas de resiliencia tras caída de contenedores
- Métricas de rendimiento y uso de recursos

---

## Autor

**Diego Salvador**  
Ingeniería Civil en Computación – Universidad de Talca  
diegosalvador01032003@alumnos.utalca.cl
