from fastapi import HTTPException

def parse_and_validate_amount(input_string: str) -> float:
    if not input_string or not isinstance(input_string, str):
        raise HTTPException(status_code=400, detail="Invalid input: Amount must be a non-empty string")
    if '-' in input_string:
        raise HTTPException(status_code=400, detail="Invalid input: Amount cannot be negative")
    try:
        return float(input_string.strip())
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid input: Amount must be a valid number")
