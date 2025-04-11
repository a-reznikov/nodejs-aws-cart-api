CREATE TYPE cart_status AS ENUM ('OPEN', 'ORDERED');

CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    status cart_status NOT NULL
); 

INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES
    ('3a984978-be9b-41e7-8d23-e4c78a91e820', 'e2350675-2ff8-4d29-b270-3f4569ad56bd', CURRENT_DATE, CURRENT_DATE, 'OPEN'),
    ('5788bebe-1b6e-42aa-8e8b-259e2586bafe', '7602bffc-6a73-4551-8c07-e03f258ccafb', CURRENT_DATE - 3, CURRENT_DATE - 3, 'ORDERED');