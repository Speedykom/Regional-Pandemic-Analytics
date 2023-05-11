FROM python:3.9

WORKDIR /backend

# env variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn","--bind", ":8000", "core.wsgi:application"]