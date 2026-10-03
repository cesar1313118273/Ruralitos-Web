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
