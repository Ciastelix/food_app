FROM python:3.11.0a1-alpine3.14 
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV DATABASE_URL=sqlite:///./app.db
ENV SECRET_KEY=secret
ENV ACCESS_TOKEN_EXPIRE_MINUTES=30
ENV ALGORITHM=HS256
COPY . .
CMD ["uvicorn", "main:app"]