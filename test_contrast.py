from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

# Konfiguracja przeglądarki
chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1920,1080")

driver = webdriver.Chrome(options=chrome_options)

try:
    # Otwórz stronę
    driver.get("http://localhost:8000/pl/index.html")
    print("✓ Strona załadowana")
    
    # Poczekaj na załadowanie
    time.sleep(2)
    
    # Znajdź przycisk kontrastu
    contrast_button = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '[data-action="toggle-contrast"]'))
    )
    print("✓ Znaleziono przycisk kontrastu")
    
    # Sprawdź tło przed kliknięciem
    body = driver.find_element(By.TAG_NAME, "body")
    bg_before = driver.execute_script("return window.getComputedStyle(document.body).backgroundColor")
    print(f"Tło body przed: {bg_before}")
    
    # Znajdź sekcję .page-section.alt
    alt_section = driver.find_element(By.CSS_SELECTOR, ".page-section.alt")
    alt_bg_before = driver.execute_script("return window.getComputedStyle(arguments[0]).backgroundColor", alt_section)
    print(f"Tło .page-section.alt przed: {alt_bg_before}")
    
    # Znajdź zwykłą sekcję .page-section (bez .alt)
    normal_section = driver.find_element(By.CSS_SELECTOR, ".page-section:not(.alt)")
    normal_bg_before = driver.execute_script("return window.getComputedStyle(arguments[0]).backgroundColor", normal_section)
    print(f"Tło .page-section przed: {normal_bg_before}")
    
    # Kliknij w przycisk kontrastu
    driver.execute_script("arguments[0].click();", contrast_button)
    print("✓ Kliknięto przycisk kontrastu")
    
    # Poczekaj na zmianę
    time.sleep(1)
    
    # Sprawdź czy body ma klasę high-contrast
    has_class = driver.execute_script("return document.body.classList.contains('high-contrast')")
    print(f"✓ Body ma klasę 'high-contrast': {has_class}")
    
    # Sprawdź tło po kliknięciu
    bg_after = driver.execute_script("return window.getComputedStyle(document.body).backgroundColor")
    print(f"Tło body po: {bg_after}")
    
    alt_bg_after = driver.execute_script("return window.getComputedStyle(arguments[0]).backgroundColor", alt_section)
    print(f"Tło .page-section.alt po: {alt_bg_after}")
    
    normal_bg_after = driver.execute_script("return window.getComputedStyle(arguments[0]).backgroundColor", normal_section)
    print(f"Tło .page-section po: {normal_bg_after}")
    
    # Weryfikacja
    print("\n=== WERYFIKACJA ===")
    if bg_after != alt_bg_after:
        print("✓ Tła body i .page-section.alt są RÓŻNE - OK!")
    else:
        print("✗ Tła body i .page-section.alt są TAKIE SAME - BŁĄD!")
    
    if alt_bg_after != normal_bg_after:
        print("✓ Tła .page-section.alt i .page-section są RÓŻNE - OK!")
    else:
        print("✗ Tła .page-section.alt i .page-section są TAKIE SAME - BŁĄD!")
    
    if normal_bg_after != bg_after:
        print("✓ Tła .page-section i body są RÓŻNE - OK!")
    else:
        print("✗ Tła .page-section i body są TAKIE SAME - BŁĄD!")

finally:
    driver.quit()
