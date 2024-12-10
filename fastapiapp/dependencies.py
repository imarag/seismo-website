from fastapi import Cookie, Depends
from typing import Annotated

def get_user_id(user_id: Annotated[str | None, Cookie()] = None) -> str | None:
    return user_id
