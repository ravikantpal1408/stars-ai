from pydantic import BaseModel


class Lookups(BaseModel):
    # Primary Key
    id: int
    name: str
    text: str
