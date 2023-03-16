from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


origins = [
    "http://localhost",
    "http://localhost:3000",
]


app = FastAPI(debug=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
