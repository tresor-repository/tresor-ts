console.log("heey");
console.log("hey tayo....");

import { migrate } from "./db/migration";

migrate({
  url: "localhost",
  port: "5432",
  db: "tresor",
  user: "tresor",
  password: "tresor"
});
