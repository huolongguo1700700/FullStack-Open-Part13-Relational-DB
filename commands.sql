CREATE TABLE blogs (
	id SERIAL PRIMARY KEY,
	author text,
	url text NOT NULL,
	title text NOT NULL,
	likes integer NOT NULL DEFAULT 0
);

INSERT INTO blogs (author, url, title)
VALUES ('dev1', 'http://test.com/fullstack/dev1', 'Full Stack');

INSERT INTO blogs (author, url, title)
VALUES ('dev2', 'http://test.com/fullstack/dev2', 'Developing Full Stack');
