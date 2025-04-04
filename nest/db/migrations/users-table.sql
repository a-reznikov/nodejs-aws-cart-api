CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    email VARCHAR UNIQUE,
    password VARCHAR NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL
); 