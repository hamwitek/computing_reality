import os

import psycopg2
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg2.extras import RealDictCursor
from schemas import Product

app = FastAPI()

origins = [
    "http://localhost:3000",  # React app URL
    "http://localhost:8003",  # FastAPI app URL
    "http://localhost:5173",  # FastAPI app URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_connection():
    DATABASE_URL = os.getenv("DATABASE_URL")
    return psycopg2.connect(DATABASE_URL)


@app.get("/products")
def list_products():
    con = get_connection()
    with con:
        with con.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM products;")
            result = cursor.fetchall()
    return result


@app.get("/products/{product_id}")
def get_product(product_id: int):
    con = get_connection()
    with con:
        with con.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT * FROM products WHERE id = %s;", (product_id,))
            result = cursor.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Product not found")
    return result


@app.get("/search/products")
def search_products(query: str):
    con = get_connection()
    with con:
        with con.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                "SELECT * FROM products WHERE name ILIKE %s;", (f"%{query}%",)
            )
            result = cursor.fetchall()
    return result


@app.post("/products")
def create_product(product: Product):
    con = get_connection()
    with con:
        with con.cursor() as cursor:
            cursor.execute(
                "INSERT INTO products (name, price, is_in_stock) VALUES (%s, %s, %s) RETURNING id;",
                (product.name, product.price, product.is_in_stock),
            )
            product_id = cursor.fetchone()[0]
    return {"id": product_id}


@app.put("/products/{product_id}")
def update_product(product_id: int, product: Product):
    con = get_connection()
    with con:
        with con.cursor() as cursor:
            cursor.execute(
                "UPDATE products SET name = %s, price = %s, is_in_stock = %s WHERE id = %s;",
                (product.name, product.price, product.is_in_stock, product_id),
            )
    return {"message": "Product updated successfully"}


@app.delete("/products/{product_id}")
def delete_product(product_id: int):
    con = get_connection()
    with con:
        with con.cursor() as cursor:
            cursor.execute("DELETE FROM products WHERE id = %s;", (product_id,))
    return {"message": "Product deleted successfully"}
