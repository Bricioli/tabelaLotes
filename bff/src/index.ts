import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = Number.parseInt(process.env.PORT ?? '3000', 10) || 3000;

app.listen(port, (): void => {
  // eslint-disable-next-line no-console
  console.log(`BFF rodando em http://localhost:${port}`);
});
