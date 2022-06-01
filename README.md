# ECS 171 Project

## Installation

1. Clone the repository
2. Install packages for client.
```bash
cd client
npm install
```
3. Install packages for server.
```bash
cd server
virtualenv venv
source venv/bin/activate
pip -r requirements.txt
```

## Usage
1. Start the server in a terminal window
```bash
cd server
source venv/bin/activate
export FLASK_APP=main
export FLASK_ENV=development
flask run
```
2. Start the client in another terminal window
```bash
cd client
npm start
```