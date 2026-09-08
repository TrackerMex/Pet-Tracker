# Runbook de demo — hasta #69 (2026-09-08)

Máquina: la Windows donde hiciste hoy el smoke de #69. Esa base de datos y ese
volumen de Docker ya tienen usuario, mascota, collar simulado reclamado y días
de posiciones. **No ejecutes `docker compose down -v`** ni borres volúmenes:
la gráfica semanal se calcula desde las posiciones guardadas y un volumen
nuevo arranca con una sola barra.

Todo se ejecuta en una terminal abierta en la raíz del clon. En la máquina
"Programador" el clon bueno es `C:\dev\pet-tracker`; el de `~/Documents` está
viejo.

---

## 1. Código

```powershell
cd C:\dev\pet-tracker
git branch --show-current
git checkout main
git pull
git log --oneline -1
```

Debe salir `f9163bf` o posterior (merge de PR #114, #69). Si estabas en
`feature/69-mobile-home-stats-strip`, `main` tiene exactamente el mismo código
de la app.

Dependencias solo si `git pull` trajo cambios en algún `package.json` o
lockfile:

```powershell
pnpm -C backend-pet-tracker install
bun install --cwd mobile-pet-tracker
```

## 2. Docker y backend

```powershell
docker compose up -d
docker compose ps
```

Los dos servicios (`pet-tracker-postgres`, `pet-tracker-localstack`) deben estar
`healthy`. Si el backend luego falla con `28P01`, el Postgres nativo de Windows
está en el 5432: `netstat -ano | findstr :5432` muestra dos PID; detén el
servicio de Windows.

Comprueba que al `.env` raíz no le falta ninguna clave (es lo que apagó
features en silencio en #16 y #24):

```powershell
node --input-type=module -e "import fs from 'node:fs';const m=await import('./env-drift.mjs');console.log(m.missingKeys(fs.readFileSync('.env.example','utf8'),fs.readFileSync('.env','utf8')))"
```

Debe imprimir `[]`. Si lista claves, cópialas de `.env.example` a `.env`. Las únicas que pueden faltar sin consecuencia con `EMAIL_ENABLED=false` son `RESEND_API_KEY`, `RESEND_FROM` y `RESET_LINK_HOST`; cualquier `*_ENABLED` ausente apaga una feature entera.

Valores que tienen que estar así en `.env` para la demo:

```
SIM_MODE=true
POLLER_ENABLED=true
ACTIVITY_AGGREGATOR_ENABLED=true
ALERTS_ENGINE_ENABLED=true
NOTIFIER_ENABLED=true
REMINDERS_ENABLED=true
EMAIL_ENABLED=false
PUSH_ENABLED=false
AWS_MODE=local
AWS_ENDPOINT_URL=http://localhost:4566
AWS_PRESIGN_ENDPOINT_URL=http://<IP LAN>:4566
```

`AWS_PRESIGN_ENDPOINT_URL` no está en `.env.example`: añádela a mano si falta.
Sin ella las fotos de mascota no cargan en el teléfono (#57). La IP LAN se
resuelve en el paso 3; vuelve aquí cuando la tengas.

Solo si el volumen de Docker es nuevo (máquina nueva o volumen borrado):

```powershell
$env:DATABASE_URL="postgresql://pet_tracker:pet_tracker@localhost:5432/pet_tracker"
pnpm -C backend-pet-tracker run db:migrate
pnpm -C backend-pet-tracker run provision:local
```

`drizzle-kit` no lee `.env`, por eso la variable va antes. `provision:local`
es idempotente (crea colas, tabla DynamoDB, bucket y bus en LocalStack).

Arranca el backend y déjalo en su propia terminal:

```powershell
pnpm -C backend-pet-tracker run start:dev
```

Verifica desde la misma máquina:

```powershell
curl http://localhost:3000/v1/health
```

## 3. Red: IP LAN

```powershell
ipconfig
```

Toma la IPv4 del adaptador Wi-Fi (o Ethernet) que use la misma red que el
teléfono. Esa IP va en dos sitios:

- `mobile-pet-tracker/.env`: `EXPO_PUBLIC_API_URL=http://<IP LAN>:3000/v1`
- `.env` raíz: `AWS_PRESIGN_ENDPOINT_URL=http://<IP LAN>:4566`

Cambiar cualquiera de las dos exige reiniciar lo que la lee: el backend para
la raíz, Metro con `-c` para la de la app (las variables `EXPO_PUBLIC_*` se
incrustan al arrancar Metro).

Prueba desde el navegador del teléfono antes de abrir la app:
`http://<IP LAN>:3000/v1/health`. Si no responde, es el firewall de Windows:
permite entrada TCP 3000 y 4566 en red privada.

**Red del lugar de la demo.** Si la Wi-Fi del sitio aísla dispositivos entre
sí (común en oficinas y salas), el teléfono no llega al portátil. Plan
recomendado: hotspot del teléfono, el portátil se conecta a él. La IP del
portátil cambia, así que repite este paso. Ensáyalo hoy en casa con el hotspot
para no descubrirlo en la sala.

## 4. App en el teléfono

Metro en su propia terminal:

```powershell
cd mobile-pet-tracker
bunx expo start -c
```

Pulsa `a` con el teléfono conectado (USB, o `adb connect <ip:puerto>` si es
inalámbrico; el mDNS con ` (2)` falla).

El dev build que ya tienes instalado sirve: entre tu último `run:android` y
`main` no cambió nada nativo (#67, #68 y #69 son JS puro). Si el teléfono dice
"No development build installed", entonces sí:

```powershell
bunx expo run:android
```

Para eso: JDK Temurin 21 en `JAVA_HOME`, `ANDROID_HOME`, `adb` en PATH, y
`GOOGLE_MAPS_API_KEY_ANDROID` en `mobile-pet-tracker/.env`. Tarda; hazlo hoy,
no mañana.

Durante la demo Metro tiene que seguir corriendo: portátil enchufado y sin
suspensión.

Para proyectar el teléfono en el portátil: `winget install Genymobile.scrcpy`
y luego `scrcpy` con el teléfono conectado. Opcional, pero vale más que
sostener el teléfono frente a la sala.

## 5. Datos de la demo

Entra con el usuario de los smokes y recorre esto en orden. Cada punto que
falle se prepara hoy, no mañana.

1. **Login** entra sin errores.
2. **Home**: foto de la mascota en el hero (#67), gráfica semanal con varias
   barras (#68), tira de estadísticas con cifras (#69). Si sale "sin collar" o
   la tira no aparece, la mascota no tiene collar con suscripción activa:
   ver abajo.
3. **Map**: última posición y ruta del día del collar simulado, zoom, botón
   de modo perdido.
4. **Health**: al menos una vacuna, dos o tres pesos, un documento.
5. **Food**: perfil nutricional relleno y plan generado.
6. **Reminders**: uno o dos existentes.
7. **Profile**: la mascota, y otra mascota SIN collar si quieres enseñar el
   emparejamiento en vivo con `ACT-002`.

Si la base está vacía (máquina nueva):

```powershell
pnpm -C backend-pet-tracker run seed:devices
pnpm -C backend-pet-tracker run seed:vaccines
```

`seed:devices` crea `SIM-001..003` con códigos `ACT-001..003` y suscripción
activa. El registro de usuario pide un código de verificación: con
`EMAIL_ENABLED=false` sale en el log del backend (línea del logger `ConsoleEmailVerificationSender`),
no en el correo. Empareja con `ACT-001`, espera dos minutos de cron y el mapa
empieza a moverse. La gráfica semanal solo tendrá el día de hoy: las
posiciones nacen al reclamar.

Comprobación directa en la base si algo no cuadra:

```powershell
docker exec -it pet-tracker-postgres psql -U pet_tracker -d pet_tracker -c "select p.name, p.photo_key is not null as foto, d.esn, s.status, s.current_period_end from pets p left join pet_devices pd on pd.pet_id=p.id and pd.released_at is null left join devices d on d.id=pd.device_id left join device_subscriptions s on s.device_id=d.id;"
```

Cada mascota que vaya a salir en la demo debe tener `foto = t`, un `esn` y
`status = active` con `current_period_end` en el futuro.

## 6. Guion: qué enseñar y qué no tocar

Enseñar: registro y login (y olvidé contraseña si hay tiempo: el enlace sale
en el log), Home completa, Map en vivo, Health, Food, Reminders, perfil y
emparejamiento por código, cambio de idioma y de tema.

No tocar en vivo:

- **Crear dos recordatorios seguidos** (#63): el segundo formulario aparece
  con los datos del primero. Crea uno como mucho, o reinicia la app entre uno
  y otro.
- **Mascota sin collar en Home** (#77): no muestra el peso. Enseña la Home
  con la mascota que tiene collar.
- **Explicación IA del plan nutricional** (#18): no existe, solo el plan
  numérico.

No prometer: notificaciones push y centro de alertas (#78/#79 en backlog),
geocercas desde la app (#41), píldora "En línea" (#73), accesos rápidos (#71)
y recordatorios en Home (#70), iOS (#60).

## 7. Mañana, antes de entrar

- `docker compose ps`: los dos `healthy`.
- Backend arriba en su terminal, `curl .../v1/health` responde.
- Metro arriba con `-c`, app abierta en el teléfono y con sesión iniciada.
- `http://<IP LAN>:3000/v1/health` responde desde el navegador del teléfono
  en la red que vas a usar en la sala.
- Portátil enchufado, suspensión desactivada, brillo del teléfono al máximo.
- Un recorrido completo por las cinco pestañas antes de que llegue nadie.
