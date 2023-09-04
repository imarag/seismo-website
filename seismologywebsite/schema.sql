CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  fullname TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  last_login TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  registered_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_name TEXT NOT NULL,
    type TEXT NOT NULL,
    template_name TEXT NOT NULL
);