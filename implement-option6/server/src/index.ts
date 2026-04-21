import app from "./app.js";
import { migrate } from "./db/migrate.js";

const PORT = parseInt(process.env["PORT"] ?? "3001", 10);

// Run migrations on startup
migrate();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
