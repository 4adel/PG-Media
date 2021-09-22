CREATE TABLE USED_USERNAMES (
    username TEXT NOT NULL UNIQUE
);


CREATE TABLE users (
    username VARCHAR(50) NOT NULL UNIQUE,
    pass TEXT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email TEXT NOT NULL,
    id BIGSERIAL NOT NULL UNIQUE PRIMARY KEY,
    date_of_birth TEXT,
    profile_picture TEXT
);



CREATE TABLE posts (
    content TEXT NOT NULL,
    id BIGSERIAL NOT NULL UNIQUE PRIMARY KEY,
    user_id INT  NOT NULL,
    published BOOLEAN NOT NULL DEFAULT True,
    cat TEXT NOT NULL DEFAULT user
);


CREATE TABLE comments (
    content TEXT NOT NULL,
    id BIGSERIAL NOT NULL UNIQUE PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL
);

CREATE TABLE replys (
    content TEXT NOT NULL,
    id BIGSERIAL NOT NULL UNIQUE PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    comment_id INT NOT NULL
);


CREATE TABLE Chat (
    id TEXT UNIQUE PRIMARY KEY NOT NULL
);


CREATE TABLE messege (
    id BIGSERIAL NOT NULL UNIQUE,
    content TEXT NOT NULL,
    sender TEXT NOT NULL,
    recever TEXT NOT NULL
);