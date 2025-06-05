# 🎬 Videoflix – Angular Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.5.

**Videoflix** is a demo streaming platform inspired by Netflix. The aim of this project is to simulate a simple but functional UI/UX experience for streaming movies and series. Videoflix shows how a modern video streaming service could be structured - from registering new users, logging in verified users, resetting passwords. Saving and restoring the user's progress.

## 🚀 Features

- 🎬 Homepage with featured content (hero banner)
- 📂 Categories (e.g. "Drama", "Action", "Romance", "Documentation")
- 📺 Detail pages for movies with descriptions and preview images
- 💡 Responsive design – optimized for all screen sizes
- 🎨 Clean and modern UI with focus on usability

---

## 🛠️ Tech Stack

- **Frontend:** Angular, HTML, CSS, TypeScript
- **Styling:** Flexbox/Grid, Media Queries, Icons
- **Data source:** Corresponding Videoflix Backend API

## Corresponding Videoflix Backend
  
 You can find the corresponding Django backend application here:
 [Videoflix-Backend](https://github.com/RichardPeda/videoflix-backend)

---
## 🔧 Installation Instructions

### Prerequisites
 Install [Git](https://git-scm.com/)

### Clone project


```bash
git clone https://github.com/RichardPeda/videoflix-frontend
cd videoflix
```

## Start Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Deployment with Docker
If you prefer to run the project using Docker instead of a local development server, follow the steps below:

### Prerequisites
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 🔧 Setup Instructions

2. Build and start the project using `docker-compose`.

```bash
docker-compose up --build
```
---

#### 🧹 Stop Containers
To stop all running containers:

```bash
docker-compose down
```

To stop and remove all volumes:  

```bash
docker-compose down -v
```
---

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
