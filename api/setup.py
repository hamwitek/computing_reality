import time

import psycopg2


def create_tables():
    commands = (
        """
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price FLOAT NOT NULL,
            is_in_stock BOOLEAN NOT NULL
        )
        """,
    )
    con = psycopg2.connect(
        dbname="testdb",
        user="testuser",
        password="testpassword",
        host="db",
        port="5432",
    )
    with con:
        with con.cursor() as cursor:
            for command in commands:
                cursor.execute(command)
    con.close()


def insert_dummy_data():
    con = psycopg2.connect(
        dbname="testdb",
        user="testuser",
        password="testpassword",
        host="db",
        port="5432",
    )
    with con:
        with con.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM products;")
            count = cursor.fetchone()[0]
            if count == 0:
                cursor.execute(
                    """
                    INSERT INTO products (name, price, is_in_stock) VALUES
                    ('T-Shirt 1', 19.99, TRUE),
                    ('T-Shirt 2', 24.99, FALSE),
                    ('T-Shirt 3', 69.99, TRUE),
                    ('T-Shirt 3', 69.99, TRUE),
                    ('T-Shirt 3', 69.99, TRUE),
                    ('T-Shirt 3', 69.99, TRUE),
                    ('T-Shirt 3', 69.99, TRUE),
                    ('T-Shirt 3', 69.99, TRUE),
                    ('T-Shirt 3', 69.99, TRUE)
                    """
                )
    con.close()


if __name__ == "__main__":
    # Wait for the database to be ready
    time.sleep(10)
    create_tables()
    insert_dummy_data()
