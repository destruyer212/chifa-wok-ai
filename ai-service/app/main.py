from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, interpret
from app.core.llm import nombre_modelo

app = FastAPI(
    title="Chifa Wok - Microservicio de IA",
    description="Interpreta la voz del cliente (LangChain + LLM) y arma el borrador del pedido.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(interpret.router)


@app.get("/")
def root():
    return {"servicio": "chifawok-ai", "modelo": nombre_modelo(), "docs": "/docs"}
