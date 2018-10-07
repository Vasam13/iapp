DROP TABLE IF EXISTS users;
CREATE TABLE users(
	user_id INT(11) primary key auto_increment,
	user_name VARCHAR(100) UNIQUE NOT NULL,
	display_name VARCHAR(100) NOT NULL,
	password_hash  VARCHAR(500) NOT NULL,
	email_address  VARCHAR(200) NOT NULL,
	avatar_url VARCHAR(200) NULL,
	avatar_blob BLOB NULL,
    password_changed VARCHAR(2) NULL,
    deleted VARCHAR(1) NULL,
 	create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL,
    last_login_date datetime NULL,
    last_login_ip VARCHAR(200) NULL
);
ALTER TABLE users AUTO_INCREMENT=1001;
insert into users(user_id, user_name, display_name, password_hash, password_changed, email_address, create_date, create_user_id,
update_date, update_user_id) values(1000, 'admin', 'admin', '$2b$10$ABipm0utDcdrqnRAtDzrIehw0bcN2KhqZxNC7Kvsx/IIpIjNZmReC', 'N', 'test@email.com',  SYSDATE(), 1,  SYSDATE(), 1 );


DROP TABLE IF EXISTS roles;
CREATE TABLE roles(
	role_id INT(11) primary key auto_increment,
	role_name VARCHAR(100) NOT NULL,
    role_code  VARCHAR(100) NOT NULL,
    role_category VARCHAR(100) NOT NULL,
	create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL,
    UNIQUE KEY `role_unique_key` (`role_name`,`role_code`)
);
insert into roles(role_id, role_name, role_code, role_category, create_date, create_user_id,update_date, update_user_id) values
(0, 'Administrator', 'administrator', 'Default', SYSDATE(), 1,  SYSDATE(), 1 );
insert into roles(role_name, role_code, role_category, create_date, create_user_id,update_date, update_user_id) values
('Sales Person', 'salesperson', 'Sales', SYSDATE(), 1,  SYSDATE(), 1 ),
('Sales Manager', 'salesmanager', 'Sales', SYSDATE(), 1,  SYSDATE(), 1 ),
('Estimator', 'estimator', 'Sales', SYSDATE(), 1,  SYSDATE(), 1 ),
('Estimation Manager', 'estimationmanager', 'Sales', SYSDATE(), 1,  SYSDATE(), 1 ),
('Team Member', 'teammember', 'Projects', SYSDATE(), 1,  SYSDATE(), 1 ),
('Team Lead', 'teamlead', 'Projects', SYSDATE(), 1,  SYSDATE(), 1 ),
('Project Manager', 'projectmanager', 'Projects', SYSDATE(), 1,  SYSDATE(), 1 ),
('Developer', 'developer', 'Projects', SYSDATE(), 1,  SYSDATE(), 1 ),
('Checker', 'checker', 'Projects', SYSDATE(), 1,  SYSDATE(), 1 ),
('Management', 'management', 'Sales', SYSDATE(), 1,  SYSDATE(), 1 );

DROP TABLE IF EXISTS user_roles;
CREATE TABLE user_roles(
    id INT(11) primary key auto_increment,
	user_id INT(11)  NOT NULL,
    role_id INT(11)  NOT NULL,
	create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL
);
insert into user_roles(role_id, user_id, create_date, create_user_id,update_date, update_user_id) 
values(0, 1000, SYSDATE(), 1,  SYSDATE(), 1 );

DROP TABLE IF EXISTS role_category;
CREATE TABLE role_category(
	id INT(11) primary key auto_increment,
	category_name VARCHAR(100) UNIQUE NOT NULL,
	create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL
);
insert into role_category(category_name, create_date, create_user_id,update_date, update_user_id) 
values('Sales', SYSDATE(), 1,  SYSDATE(), 1 );
insert into ROLE_CATEGORY(category_name, create_date, create_user_id,update_date, update_user_id) 
values('Projects', SYSDATE(), 1,  SYSDATE(), 1 );
insert into ROLE_CATEGORY(category_name, create_date, create_user_id,update_date, update_user_id) 
values('Default', SYSDATE(), 1,  SYSDATE(), 1 );
