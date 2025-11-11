/* Simple Express backend */
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/hello', (_req, res) => res.json({ message: 'Hello from form-fill-backend' }));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
