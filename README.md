# Portfolio Website

A full-stack portfolio website built with **Python (Flask)** backend and **HTML / CSS / JavaScript** frontend.

## Project Structure

```
portfolio/
├── app.py                  # Flask backend + REST API
├── requirements.txt
├── templates/
│   └── index.html          # Main HTML page
└── static/
    ├── style.css           # All styles (dark theme, animations)
    └── main.js             # Interactivity, API calls, animations
```

## Quick Start

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the server
```bash
python app.py
```

### 3. Open in browser
```
http://localhost:5000
```

## API Endpoints

| Method | Endpoint        | Description                    |
|--------|-----------------|--------------------------------|
| GET    | `/`             | Serve the portfolio page       |
| GET    | `/api/projects` | Return all projects as JSON    |
| GET    | `/api/skills`   | Return all skills as JSON      |
| POST   | `/api/contact`  | Submit a contact form message  |
| GET    | `/api/messages` | List all received messages     |

## Customisation

- **Projects** → Edit the `PROJECTS` list in `app.py`
- **Skills** → Edit the `SKILLS` list in `app.py`
- **Colors** → Edit CSS variables in `static/style.css` (`:root` block)
- **Name / Bio** → Edit `templates/index.html`
- **Email sending** → Replace the `MESSAGES.append(...)` block in `/api/contact` with your SMTP / SendGrid logic
