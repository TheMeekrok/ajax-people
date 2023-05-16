CREATE TABLE users (
    id serial primary key ,
    firstname varchar(50) DEFAULT NULL,
    lastname varchar(50) DEFAULT NULL,
    password varchar(255) DEFAULT NULL,
    age int DEFAULT NULL,
    mail varchar(50) DEFAULT NULL,
    status_user varchar(50) DEFAULT NULL,
    education_level varchar(50) DEFAULT NULL,
    study_program_id int DEFAULT NULL,
    school_id int DEFAULT NULL,
    admission_year timestamp DEFAULT NULL,
    graduation_year timestamp DEFAULT NULL,
    is_visible bool DEFAULT NULL,
    avatar_path varchar(100) DEFAULT NULL,
    is_moderated bool DEFAULT NULL,
    activation_code varchar(10),
    is_admin bool DEFAULT FALSE,
    is_verificated bool DEFAULT FALSE
);

CREATE TABLE "coincidence" (
   id serial primary key ,
   user1_id int DEFAULT NULL,
   user2_id int DEFAULT NULL,
   coincidence_time timestamp NULL DEFAULT NULL
);

CREATE TABLE "dialog" (
  id serial primary key,
  user1_id int DEFAULT NULL,
  user2_id int DEFAULT NULL,
  time_mess timestamp NULL DEFAULT NULL
);

CREATE TABLE "faculty" (
   id serial primary key,
   title varchar(240) DEFAULT NULL
);

CREATE TABLE "post" (
    id serial primary key,
    user_id int DEFAULT NULL,
    text_post text,
    is_moderated bool DEFAULT NULL,
    publication_time timestamp NULL DEFAULT NULL
);

CREATE TABLE "school" (
    id serial primary key,
    title varchar(255) DEFAULT NULL
);

create table interest
(
    id    serial
        primary key,
    title varchar(240) default NULL::character varying,
    color varchar(20) default 'white'::character varying
);

INSERT INTO public.interest (id, title, color)
VALUES (DEFAULT, 'Бег', 'yellow');

INSERT INTO public.interest (id, title, color)
VALUES (DEFAULT, 'История', 'green');

INSERT INTO public.interest (id, title, color)
VALUES (DEFAULT, 'Архитектура', 'purple');

INSERT INTO public.interest (id, title, color)
VALUES (DEFAULT, 'Спортивное программирование', 'blue');

INSERT INTO public.interest (id, title, color)
VALUES (DEFAULT, 'Бас-гитара', 'orange');


CREATE TABLE users_interests
(
    id serial primary key ,
    user_id int not null,
    interest_id int not null
);

alter table post rename column text_post to text;

alter table post alter column text set not null;

alter table post alter column is_moderated set default false;

alter table post alter column publication_time set not null;

alter table post
add constraint post_users_id_fk
    foreign key (user_id) references users;

ALTER TABLE "coincidence" ADD COLUMN request_accepted BOOL DEFAULT FALSE;

ALTER TABLE coincidence RENAME COLUMN user1_id TO sendler_id;
ALTER TABLE coincidence RENAME COLUMN user2_id TO recipient_id;