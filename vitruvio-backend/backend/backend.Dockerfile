FROM python:3.12-slim

WORKDIR /vitruvioapp

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . ./backend
COPY init.sh .

EXPOSE 8000

CMD ["sh", "init.sh"]