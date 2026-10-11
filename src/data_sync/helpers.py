import re

from fastapi import HTTPException

# Leading/trailing currency symbols or 3-letter codes, e.g. "$150.00", "USD 100", "100 EUR"
_CURRENCY_RE = re.compile(r"^\s*(?:[A-Za-z]{3}|[$€£¥₹])?\s*(.*?)\s*(?:[A-Za-z]{3})?\s*$")

def parse_and_validate_amount(input_string: str | int | float) -> float:
    if isinstance(input_string, (int, float)) and not isinstance(input_string, bool):
        input_string = str(input_string)
    if not input_string or not isinstance(input_string, str):
        raise HTTPException(status_code=400, detail="Invalid input: Amount must be a non-empty string")
    if '-' in input_string:
        raise HTTPException(status_code=400, detail="Invalid input: Amount cannot be negative")
    amount = _CURRENCY_RE.match(input_string).group(1).replace(",", "")
    try:
        return float(amount)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid input: Amount must be a valid number")
