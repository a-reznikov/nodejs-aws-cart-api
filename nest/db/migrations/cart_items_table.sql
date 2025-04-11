CREATE TABLE IF NOT EXISTS cart_items (
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,
    count INTEGER NOT NULL,
    PRIMARY KEY (cart_id, product_id),
    FOREIGN KEY (cart_id) REFERENCES carts(id)
);

INSERT INTO cart_items (cart_id, product_id, count) VALUES
    ('3a984978-be9b-41e7-8d23-e4c78a91e820', 'b2914b76-7b27-4eab-8db0-2ebc21a02d94', 5),
    ('3a984978-be9b-41e7-8d23-e4c78a91e820', '8d82e0f4-1cea-495f-b731-e6c406075a4d', 2),
    ('5788bebe-1b6e-42aa-8e8b-259e2586bafe', '6674ea28-0f3f-4a32-8ca5-5a7eb6fe9f21', 3); 