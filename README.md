# 🚀 Final Project Boilerplate

## 🏠 Root

The root of the project is set up with **automatic pre-commit autolinting** for **JavaScript** and **Python** using **Prettier** 🖋️ and **Ruff** 🐍.

## 🌐 Web (`/web`)

### ⚛️ React Template

The front-end uses a **React template from Vite**.
Scaffolding reference: [Vite Docs](https://vite.dev/guide/#scaffolding-your-first-vite-project)

### 📦 Necessary Packages for FE

#### Utilities

- **lodash**: Functional utilities [GitHub](https://github.com/lodash/lodash?tab=readme-ov-file#installation) 🔧
- **react-router**: Routing library [Docs](https://reactrouter.com/start/library/installation) 🛣️

#### Data Fetching

- **axios**: HTTP client [Docs](https://axios-http.com/docs/intro) ⚡
- **react-query**: Server-state management [Docs](https://tanstack.com/query/latest/docs/framework/react/installation) 📡

#### Styling & Components

- **Material-UI**: Modern UI components [Docs](https://mui.com/material-ui/getting-started/installation) 🎨
- **React Bootstrap**: Bootstrap components [Docs](https://react-bootstrap.netlify.app/docs/getting-started/introduction) 🅱️
- **Reactstrap**: Bootstrap 4 components [Docs](https://reactstrap.github.io/?path=/docs/home-installation--page#getting-started) 🖼️
- **Ant Design**: Enterprise UI [Docs](https://ant.design/docs/react/use-with-vite) 🏢
- **Tailwind CSS**: Utility-first CSS [Docs](https://tailwindcss.com/docs/installation/using-vite) 🌬️

## 🖥️ API (`/api`)

### 🐍 Pipenv

Back-end uses **Pipenv** for dependency management.
Installation reference: [Pipenv Docs](https://pipenv.pypa.io/en/latest/installation.html#preferred-installation-of-pipenv)

### 📦 Necessary Packages for BE

- **Flask**: Web framework [Docs](https://flask.palletsprojects.com/en/stable/installation/) 🌐
- **Flask-CORS**: Cross-origin requests [PyPI](https://pypi.org/project/Flask-Cors/) 🌏
- **Flask-Migrate**: DB migrations [Docs](https://flask-migrate.readthedocs.io/en/latest/#installation) 🗄️
- **Flask-SQLAlchemy**: ORM for Flask [Docs](https://flask-sqlalchemy.readthedocs.io/en/stable/quickstart/#installation) 🐘
- **Gunicorn**: WSGI server [Docs](https://gunicorn.org/) 🚀
- **SQLAlchemy**: Database toolkit [Docs](https://docs.sqlalchemy.org/en/20/intro.html#installation) 🛠️

### 🔑 Environment Variables

Make sure your environment variables are correctly set for **development** (Codespaces) and **deployment** (Render).

- `DATABASE_URL` 🌐 → Your external database URL from the DB in the Render project
- `JWT_SECRET_KEY` 🔑 → Your generated secret string

---

💡 **Tip:** Keep this README handy as your **quick-start guide** for both front-end and back-end setup!
