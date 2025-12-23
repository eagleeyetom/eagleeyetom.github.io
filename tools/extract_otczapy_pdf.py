import re
from pathlib import Path
from pdfminer.high_level import extract_text

pdf_path = Path(r"c:/Users/tomek/Dropbox/masska/Teatr Otczapy zgłoszenie.pdf")
text = extract_text(str(pdf_path))
print("--- RAW TEXT (first 2000 chars) ---")
print(text[:2000])

# Heuristic extraction
fields = {}
patterns = {
    "tytul": r"(?i)tytu[lł]\s*[:\-]\s*(.+)",
    "autor": r"(?i)(autor|reżyser)\s*[:\-]\s*(.+)",
    "czas": r"(?i)(czas trwania|czas)\s*[:\-]\s*([0-9]{1,3}\s*(min|minut|min\.))",
    "miasto": r"(?i)(miasto|miejscowość)\s*[:\-]\s*(.+)",
    "obsada": r"(?i)(obsada|aktorzy)\s*[:\-]\s*(.+)",
}
for key, pat in patterns.items():
    m = re.search(pat, text)
    if m:
        fields[key] = m.group(len(m.groups())) if m.groups() else m.group(1)

print("\n--- EXTRACTED FIELDS ---")
for k,v in fields.items():
    print(f"{k}: {v}")
