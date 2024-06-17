start:
	HOST=0.0.0.0 \
	PORT=3000 \
	DATABASE_URL=postgresql://postgres:postgres@localhost:15432/authentication?schema=public \
	node ./dist/src/main.js