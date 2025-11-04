# Date App

Prosta i interaktywna aplikacja React, która pozwala użytkownikom wybrać i zapisać specjalną datę. Aplikacja posiada czysty interfejs użytkownika z wyborem daty oraz backend do zapisywania wybranej daty.

## Funkcje

- **Wybierz datę**: Łatwo wybierz datę za pomocą intuicyjnego interfejsu kalendarza.
- **Zapisz swoją datę**: Zapisz wybraną datę jednym kliknięciem.
- **Responsywny design**: Czysty i nowoczesny wygląd, który działa na wszystkich urządzeniach.
- **Backend Express**: Lekki serwer Node.js do obsługi przechowywania dat.

## Użyte technologie

- **Frontend**:
  - [React](https://reactjs.org/)
  - [react-datepicker](https://reactdatepicker.com/) dla komponentu kalendarza
  - [date-fns](https://date-fns.org/) do obsługi dat
- **Backend**:
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
  - [cors](https://www.npmjs.com/package/cors)
  - [body-parser](https://www.npmjs.com/package/body-parser)
- **Development**:
  - [concurrently](https://www.npmjs.com/package/concurrently) do jednoczesnego uruchamiania frontendu i backendu

## Konfiguracja i instalacja

1.  **Sklonuj repozytorium:**
    ```bash
    git clone https://github.com/jkozlowski223/WillYouGoOnADate.git
    cd date_app
    ```

2.  **Zainstaluj zależności dla serwera i klienta:**
    ```bash
    npm install
    ```

3.  **Uruchom aplikację:**
    ```bash
    npm run dev
    ```
    Spowoduje to uruchomienie serwera deweloperskiego React na `http://localhost:3000` oraz backendu Express na `http://localhost:3001`.

## Dostępne skrypty

W katalogu projektu możesz uruchomić:

- `npm start`: Uruchamia aplikację React w trybie deweloperskim.
- `npm run server`: Uruchamia tylko serwer backendowy Express.
- `npm run dev`: Uruchamia jednocześnie klienta i serwer.
- `npm run build`: Buduje aplikację do produkcji do folderu `build`.
- `npm test`: Uruchamia testy w interaktywnym trybie watch.

## Struktura projektu

```
date_app/
├── public/             # Publiczne zasoby i index.html
├── src/                # Kod źródłowy aplikacji React
│   ├── App.js          # Główny komponent aplikacji
│   ├── Date.js         # Komponent z logiką wyboru daty
│   ├── Date.css        # Style dla komponentu Date
│   └── index.js        # Punkt wejściowy aplikacji React
├── server.js           # Serwer backendowy Express
├── date_data.json      # Plik, w którym przechowywana jest wybrana data
├── package.json        # Zależności projektu i skrypty
└── README.md           # Ten plik
```

## API Endpoints

Serwer backendowy udostępnia następujące punkty końcowe:

- `GET /api/health`: Prosty test stanu, aby zweryfikować, czy serwer działa. Zwraca `{ "ok": true }`.
- `POST /api/save-date`: Zapisuje wybraną datę do `date_data.json`.
  - **Ciało żądania**: `{ "date": "YYYY-MM-DDTHH:mm:ss.sssZ" }`
  - **Odpowiedź**: `{ "success": true, "message": "Data saved successfully." }`
