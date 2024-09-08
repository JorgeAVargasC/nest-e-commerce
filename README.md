<p align="center">
  <a 
    href="http://nestjs.com/" 
    target="blank"
  >
    <img 
      src="https://nestjs.com/img/logo-small.svg" width="120" 
      alt="Nest Logo" 
    />
  </a>
</p>

# Get Started

1.  Clone the project from [github](https://github.com/jorgeavargasc/nest-e-commerce)

```bash
git clone https://github.com/jorgeavargasc/nest-e-commerce
```

2. Create `.env` from `.env.template`

```ts
PORT=

DB_USER=
DB_PASS=
DB_NAME=
DB_PORT=
DB_HOST=
```

3. Start the database container

```bash
  docker-compose up -d
```

4. Install dependencies

```bash
  yarn install
```

5. Run the server

```bash
  yarn start:dev
```
