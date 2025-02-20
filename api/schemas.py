from pydantic import BaseModel


class Product(BaseModel):
    name: str
    price: float
    is_in_stock: bool
