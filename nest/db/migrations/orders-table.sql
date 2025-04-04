CREATE TYPE order_status AS ENUM ('OPEN', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED');

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    cart_id UUID NOT NULL REFERENCES carts(id),
    payment JSONB NOT NULL,
    delivery JSONB NOT NULL,
    comments TEXT,
    status order_status NOT NULL DEFAULT 'OPEN',
    total DECIMAL(10,2) NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL
);