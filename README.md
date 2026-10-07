# Ruralitos Web

Plataforma web multiservicios para centros de salud rurales.

## Arquitectura

- `frontend/`: Next.js, TypeScript, Tailwind CSS y Supabase SSR.
- `backend/`: FastAPI, Python, Pandas, OpenPyXL y Supabase Python.
- `supabase/`: configuracion, esquemas, pruebas RLS y migraciones.
- `docs/`: decisiones y documentacion de arquitectura.

## Modulos

1. Consulta externa
2. Emergencia
3. Estadisticas
4. Administracion tecnica

## Consulta externa: atenciones diarias

La ruta `/consulta-externa/atenciones-diarias` muestra el HTML original del
sistema intramural, sin sustituir sus formularios por otros. La correspondencia
de roles, horarios y estados está documentada en
`docs/consulta-externa-atenciones-diarias.md`.

**Estado actual:** la vista es verificable, pero el inicio de sesión, la
colaboración y el guardado permanecen deshabilitados hasta conectar el backend
al almacén acordado. No introduzcas datos reales de pacientes en esta etapa.

## Desarrollo local

### Frontend

```powershell
cd frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

La interfaz estara disponible en `http://localhost:3000`.

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
fastapi dev app/main.py
```

La API estara disponible en `http://localhost:8000` y su documentacion en
`http://localhost:8000/docs`.

## Variables de entorno

Copia `.env.example` y completa la URL y clave publicable del proyecto Supabase.
Nunca guardes claves secretas en Git ni en variables que comiencen con `NEXT_PUBLIC_`.
