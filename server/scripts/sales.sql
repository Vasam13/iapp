DROP DATABASE IF EXISTS `iapp`;
CREATE DATABASE `iapp`;
USE `iapp`;


DROP TABLE  IF EXISTS clients;
CREATE TABLE clients (
    client_id INT(11) primary key auto_increment,
    client_name varchar(250)  NOT NULL,
    contact_name varchar(250) NOT NULL,
    email_address varchar(250) NOT NULL,
    phone1_country_code varchar(10) DEFAULT NULL,
    phone1_number varchar(20) DEFAULT NULL,
    phone1_ext varchar(10) DEFAULT NULL,
    phone2_country_code varchar(10) DEFAULT NULL,
    phone2_number varchar(20) DEFAULT NULL,
    phone2_ext varchar(10) DEFAULT NULL,
    website varchar(100) DEFAULT NULL,
    address_line1 varchar(100) NOT NULL,
    address_line2 varchar(100) DEFAULT NULL,
    city varchar(100) NOT NULL,
    state varchar(100) NOT NULL,
    country varchar(100) NOT NULL,
    zip varchar(15) NULL,
    create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL
);
ALTER TABLE clients AUTO_INCREMENT=5000;

DROP TABLE  IF EXISTS sales;
CREATE TABLE sales (
  sales_id INT(11) primary key auto_increment,
  client_id INT(11) NOT NULL,
  bid_number varchar(45) NULL,
  project_name varchar(200) NOT NULL,
  project_address_line1 varchar(100) NOT NULL,
  project_address_line2 varchar(100) DEFAULT NULL,
  project_city varchar(100) NOT NULL,
  project_state varchar(100) NOT NULL,
  project_country varchar(100) NOT NULL,
  project_zip varchar(15) DEFAULT NULL,
  project_contact_name varchar(200) DEFAULT NULL,
  project_contact_email varchar(200) DEFAULT NULL,
  project_phone1_country_code varchar(10) DEFAULT NULL,
  project_phone1_number varchar(20) DEFAULT NULL,
  project_phone1_ext varchar(10) DEFAULT NULL,
  project_phone2_country_code varchar(10) DEFAULT NULL,
  project_phone2_number varchar(20) DEFAULT NULL,
  project_phone2_ext varchar(10) DEFAULT NULL, 
  bid_received_date datetime DEFAULT NULL,
  bid_due_date datetime DEFAULT NULL,
  bid_sent_date datetime DEFAULT NULL,
  bid_type varchar(500) DEFAULT NULL,
  document_received varchar(200) DEFAULT NULL,
  document_path varchar(45) DEFAULT NULL,
  executive INT(11) NULL,
  estimate_lead INT(11) NULL,
  estimator INT(11) NULL,
  remarks varchar(2000),
  sales_remarks varchar(2000),
  status varchar(100) NOT NULL,
  pdf blob Default null,
  is_pdf_generated varchar(1),
  project_status varchar(100) NULL,
  create_date datetime NOT NULL,
  create_user_id int(11) NOT NULL,
  update_date datetime NOT NULL,
  update_user_id int(11) NOT NULL
);
ALTER TABLE sales AUTO_INCREMENT=10000;

DROP TABLE IF EXISTS estimations;
CREATE TABLE estimations (
    id  INT(11) primary key auto_increment,
    sales_id INT(11) NOT NULL,
    version_number int(11) NOT NULL,
    main_steel_inclusions varchar(500) NULL,
    main_steel_exclusions varchar(500) NULL,
    misc_steel_inclusions varchar(500) NULL,
    misc_steel_exclusions varchar(500) NULL,
    remarks varchar(1024) NULL,
    sales_remarks varchar(1024) NULL,
    create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL
);

DROP TABLE IF EXISTS estimation_schedule;
CREATE TABLE estimation_schedule (
    id  INT(11) primary key auto_increment,
    estimation_id INT(11),
    schedule_name  varchar(50) NULL,
    schedule_hours varchar(11) NOT NULL,
    schedule_weeks varchar(11) NOT NULL,
    create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL
);

DROP TABLE IF EXISTS quotes;
CREATE TABLE quotes (
    quote_id  INT(11) primary key auto_increment,
    sales_id INT(11) NOT NULL,
    estimate_id INT(11) NOT NULL,
    version_number int(11) NOT NULL,
    currency VARCHAR(5) NULL,
    main_steel_price int(11) NOT NULL,
    misc_steel_price int(11) NOT NULL,
    engineering_price int(11) NULL,
    remarks VARCHAR(1024) NULL,
    sales_remarks varchar(1024) NULL,
    create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL
);

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



DROP TABLE IF EXISTS functions;
CREATE TABLE functions(
	function_id INT(11) primary key auto_increment,
	function_name VARCHAR(100) NOT NULL,
    function_code  VARCHAR(100) NOT NULL,
	create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL,
    UNIQUE KEY `funtion_unique_key` (`function_name`,`function_code`)
);

DROP TABLE IF EXISTS user_functions;
CREATE TABLE user_functions(
    id INT(11) primary key auto_increment,
	user_id INT(11)  NOT NULL,
    function_id INT(11)  NOT NULL,
	create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL
);

DROP TABLE IF EXISTS EMAIL_ACTIONS;
CREATE TABLE EMAIL_ACTIONS(
	id INT(11) PRIMARY KEY auto_increment,
    to_emails varchar(1000) NOT NULL,
    cc_emails varchar(1000) NULL,
    datasource  varchar(100) not NULL,
    event varchar(100) not NULL,
    `condition` varchar(1000) NULL,
    subject varchar(1000) NOT NULL,
	body varchar(2000) NOT NULL,
    active varchar(1) not NULL,
    create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL
);

DROP TABLE IF EXISTS GLOBAL_TEMPLATES;
CREATE TABLE GLOBAL_TEMPLATES(
	id INT(11) PRIMARY KEY auto_increment,
    template_code varchar(100) UNIQUE NOT NULL,
    title varchar(1000) NULL,
	content varchar(2000) NOT NULL,
    create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL
);
INSERT INTO global_templates(`template_code`,`title`,`content`,`create_date`,`create_user_id`,`update_date`,`update_user_id`) VALUES
('pdf_requirements_from_client','REQUIREMENTS FROM THE CLIENT','<ol><li>Detailing Standards</li><li>Released for Construction set</li><li>All Addendums and Bulletins if</li><li>General Contractor name</li><li>Job Number</li><li>Drawing sheet layout and requirements</li><li>Drawing Template</li></ol>',SYSDATE(),1,SYSDATE(),1),
('pdf_approval_set','OUR APPROVAL SET ALWAYS COMES WITH','<ol><li>Submittal log</li><li>Contract Drawings log</li><li>RFI (If any)</li><li>RFI log (If any)</li></ol>',SYSDATE(),1,SYSDATE(),1),
('pdf_deliver_checks','DELIVER CHECKS','<ol><li>NC1 Files,</li><li>Kiss Files,</li><li>PDF,</li><li>CNC Files,</li><li>EJE Files,</li><li>Calculation if required (No Stamping)</li><li>Steel Member cut list</li><li>Field Bolt List</li><li>Shop Bolt list</li><li>Sequencing jobs, sequence list</li><li>DXF files for your plasma</li></ol>',SYSDATE(),1,SYSDATE(),1),
('pdf_lead_time','LEADTIME & MILESTONES','<p><strong>Detailing Schedule </strong></p><p><strong>X + {mainsteelschedule} Weeks (Main Steel for Approval) </strong></p><p><strong>&nbsp,&nbsp,+ {</strong><strong style=''color: rgb(0, 0, 0),''>miscsteelschedule</strong><strong>} Weeks (Misc. Steel for Approval) </strong></p><p><strong>X = Purchase Order release date and final drawings set confirmation.</strong></p>',SYSDATE(),1,SYSDATE(),1),
('pdf_detailing_price','DETAILING PRICE ','<p><strong>Main Steel USD: {mainsteelprice}</strong></p><p><strong> Misc. Steel USD: {miscsteelprice}</strong></p>',SYSDATE(),1,SYSDATE(),1),
('pdf_payment_terms','PAYMENT TERMS','<p>1) On Submission of Shop Drawings – 100%</p><p><br></p><p>All Invoices should be paid within 30 Days net after release for final approval. </p><p><br></p><p>All Cheques shall be sent to the below address </p><p><br></p><p>3S Services Group</p><p>733 Telemark Trial,</p><p>Frisco, TX 75034.</p><p>Phone: - 630-881-2687</p>',SYSDATE(),1,SYSDATE(),1),
('pdf_change_orders','CHANGE ORDERS','<p>Depending on the Job requirement regarding the extra work incurred, additional amount of money would be charged on the extra hour. All these charges would be sent in the form of a <strong>CHANGE ORDER</strong> for approval from client.</p><p><br></p><p>Change Order will be $50.00 per Hr. Minor Changes are not Change Orders. Shop Mistakes, field miss fit-ups, Solution will be provided at no cost.&nbsp,</p>',SYSDATE(),1,SYSDATE(),1),
('pdf_contact_details','CONTACT DETAILS FOR COMMUNICATION','<p>{executive}</p><p> Senior Sales Executive </p><p>3S Services Group LLC </p><p>733 Telemark Trial, </p><p>Frisco, TX 75034. </p><p>Direct: +1.972-370-3067 </p><p>Phone: 972-737-8088, Ext:210</p><p> Email: {email}</p><p>Website: www.3ssteelservices.com</p><p><br></p><p>This Proposal is valid for 30Days.</p>',SYSDATE(),1,SYSDATE(),1),
('pdf_accepted','ACCEPTED','<p>sign:-_______________________________</p><p><br></p><p>Title_______________________________</p><p><br></p><p> </p><p>Company : __________________________</p><p><br></p><p> </p><p>P.O #______________________________</p>',SYSDATE(),1,SYSDATE(),1);



DROP TABLE IF exists exclusions_inclusions;
CREATE TABLE `exclusions_inclusions` (
   `id` int(11) primary key auto_increment,
   `desc` varchar(500) DEFAULT NULL,
   `type` varchar(500) DEFAULT NULL,
   `create_date` datetime NOT NULL,
   `create_user_id` int(11) NOT NULL,
   `update_date` datetime NOT NULL,
   `update_user_id` int(11) NOT NULL
);

INSERT INTO `exclusions_inclusions` (`desc`, `type`, `create_user_id`, `create_date`, `update_date`, `update_user_id`) VALUES
('Connection Design & PE Stamping', 'main_exclusions', 1, SYSDATE(), SYSDATE(), 1),
('Joists', 'main_exclusions', 1, SYSDATE(), SYSDATE(), 1),
('Roof deck', 'main_exclusions', 1, SYSDATE(), SYSDATE(), 1),
('Kickers','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Bent plates','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Door jambs','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Trusses','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Braces','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Misc. channels','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Sag rods','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Purlins','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('RTU Frames', 'main_inclusions',1, SYSDATE(), SYSDATE(), 1),
('Lintels','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Loose angles','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Loose plates','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Embeds','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Columns','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Beams','main_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Connection Design & PE Stamping', 'misc_exclusions', 1, SYSDATE(), SYSDATE(), 1),
('Any items not specifically mentioned above','misc_exclusions', 1, SYSDATE(), SYSDATE(), 1),
('Ladder', 'misc_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Stairs', 'misc_inclusions',1, SYSDATE(), SYSDATE(), 1),
('Hand rails', 'misc_inclusions',1, SYSDATE(), SYSDATE(), 1),
('Wall rails', 'misc_inclusions',1, SYSDATE(), SYSDATE(), 1),
('Guard rails','misc_inclusions', 1, SYSDATE(), SYSDATE(), 1),
('Bollards', 'misc_inclusions',1, SYSDATE(), SYSDATE(), 1),
('Trash gates','misc_inclusions', 1, SYSDATE(), SYSDATE(), 1);


DROP TABLE IF exists sales_comments;
CREATE TABLE `sales_comments` (
   `id` int(11) primary key auto_increment,
   `sales_id` int(11) NOT NULL,
   `comment` varchar(2000) DEFAULT NULL,
   `create_date` datetime NOT NULL,
   `create_user_id` int(11) NOT NULL,
   `update_date` datetime NOT NULL,
   `update_user_id` int(11) NOT NULL
);

DROP TABLE IF exists sales_notes;
CREATE TABLE `sales_notes` (
   `id` int(11) primary key auto_increment,
   `sales_id` int(11) NOT NULL,
   `code` varchar(200) NOT NULL,
   `title` varchar(200) NOT NULL,
   `content` varchar(2000) NOT NULL,
   `position` int(11) NOT NULL,
   `create_date` datetime NOT NULL,
   `create_user_id` int(11) NOT NULL,
   `update_date` datetime NOT NULL,
   `update_user_id` int(11) NOT NULL
);