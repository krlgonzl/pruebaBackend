CREATE TABLE areas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )

  CREATE TABLE custodios (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  area_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (area_id) REFERENCES areas(id)
  )

  CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  valor INTEGER,
  category VARCHAR(100),
  custodio_id INTEGER NOT NULL,
  status VARCHAR(20) CHECK (status IN ('activo', 'dado de baja', 'trasladado')) DEFAULT 'activo',
  deleted_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (custodio_id) REFERENCES custodios(id)
)

CREATE TABLE movimientos (
    id SERIAL PRIMARY KEY,
    activo_id INTEGER NOT NULL,
    custodio_anterior_id INTEGER,
    custodio_nuevo_id INTEGER NOT NULL,
    area_anterior_id INTEGER,
    area_nueva_id INTEGER NOT NULL,
    motivo TEXT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activo_id) REFERENCES assets(id),
    FOREIGN KEY (custodio_anterior_id) REFERENCES custodios(id),
    FOREIGN KEY (custodio_nuevo_id) REFERENCES custodios(id),
    FOREIGN KEY (area_anterior_id) REFERENCES areas(id),
    FOREIGN KEY (area_nueva_id) REFERENCES areas(id)
)

