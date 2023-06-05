FROM python:3.9

WORKDIR /backend

# env variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .

RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY ./entrypoint.sh .

RUN sed -i 's/\r$//g' /backend/entrypoint.sh

RUN chmod +x /backend/entrypoint.sh

COPY . .

# run entrypoint.sh
ENTRYPOINT ["/backend/entrypoint.sh"]