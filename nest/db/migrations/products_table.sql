CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

INSERT INTO products (id, title, description, price) VALUES
    ('b2914b76-7b27-4eab-8db0-2ebc21a02d94', 'Book 1', 'Description 1', 10.00),
    ('8d82e0f4-1cea-495f-b731-e6c406075a4d', 'Book 2', 'Description 2', 20.00),
    ('6674ea28-0f3f-4a32-8ca5-5a7eb6fe9f21', 'Book 3', 'Description 3', 30.00); 