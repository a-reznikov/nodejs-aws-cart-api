CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

INSERT INTO products (id, title, description, price) VALUES
    ('071dd684-a247-4c6f-9608-d32da6236bba', 'Jane Eyre', 'A novel by Charlotte Brontë, following the life of an orphaned girl who becomes a governess and falls in love with her employer, Mr. Rochester.', 22.00),
    ('f57cd6a9-ccbb-4dee-bfea-b638b4726462', 'The Lord of the Rings', 'An epic fantasy trilogy by J.R.R. Tolkien, telling the story of the journey to destroy a powerful ring and defeat the Dark Lord Sauron.', 45.00),
    ('625664ab-e8e9-4ed8-93bb-9fbcba40982d', 'The Hobbit', 'A fantasy novel by J.R.R. Tolkien about a hobbit''s journey to recover a treasure guarded by a dragon.', 18.00),
    ('0b0f0e15-d99c-4166-b204-261291939db8', 'Anna Karenina', 'A novel by Leo Tolstoy about a woman''s tragic love affair, set against the backdrop of Russian society.', 40.00),
    ('debc1374-3f2c-43a3-bfa5-f8069a96a936', 'The Divine Comedy', 'An epic poem by Dante Alighieri, describing the journey of the soul through Hell, Purgatory, and Heaven.', 40.00),
    ('12f82315-f4eb-4228-8423-8cf7f8461dec', 'Great Expectations', 'A novel by Charles Dickens, following the life of Pip, an orphan who rises through society through an unexpected benefactor.', 25.00),
    ('5d6043ff-0646-46bf-ae29-45b9fa3d4575', 'Les Misérables', 'A historical novel by Victor Hugo, set in post-revolutionary France, following the lives of several characters, particularly Jean Valjean.', 50.00),
    ('3f63cf1b-800e-4311-b498-3a9ab75df030', 'Catch-22', 'A satirical novel by Joseph Heller about the absurdities and contradictions of war, following a group of World War II bombers.', 28.00),
    ('7e9cab34-7d24-4315-b655-9ddb832ab1dd', 'The Brothers Karamazov', 'A philosophical novel by Fyodor Dostoevsky about the moral dilemmas of three brothers and their relationship with their father.', 35.00),
    ('09fdf625-9616-4a57-894e-f02ba99329c5', 'Don Quixote', 'A novel by Miguel de Cervantes about an elderly man who, inspired by chivalric literature, sets off on an adventure as a knight-errant.', 30.00); 