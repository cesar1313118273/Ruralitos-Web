# Arquitectura inicial

Ruralitos Web utiliza tres capas:

1. `frontend/`: Next.js, TypeScript y Tailwind CSS.
2. `backend/`: FastAPI y Python para reglas, calculos, Excel e inteligencia artificial.
3. `supabase/`: esquemas, politicas RLS, pruebas y migraciones de PostgreSQL.

## Modulos funcionales

- Consulta externa
- Emergencia
- Estadisticas
- Administracion tecnica

## Seguridad

- La clave secreta de Supabase solo puede existir en el backend.
- El navegador utiliza exclusivamente la clave publicable.
- Toda tabla expuesta debe habilitar RLS y permisos por operacion.
- Cada registro clinico debe pertenecer a un centro de salud.
- Los accesos y cambios de informacion clinica deben quedar auditados.

```text
Next.js -> FastAPI -> Supabase PostgreSQL / Storage
   |                       ^
   +---- Supabase Auth ----+
```
