# Atajos de desarrollo -- requiere: docker compose, mvn, npm, python

.PHONY: up down logs db backend ai frontend seed

up:            ## Levanta todo el stack con Docker
	docker compose up --build

down:          ## Detiene y elimina contenedores
	docker compose down

logs:
	docker compose logs -f

db:            ## Solo la base de datos
	docker compose up -d db

backend:       ## Backend en local (perfil dev)
	cd backend && mvn spring-boot:run

ai:            ## Microservicio de IA en local
	cd ai-service && uvicorn app.main:app --reload --port 8001

frontend:      ## Frontend en local
	cd frontend && npm start
