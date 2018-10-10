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
  pdf_template TEXT, 
  project_status varchar(100) NULL,
  create_date datetime NOT NULL,
  create_user_id int(11) NOT NULL,
  update_date datetime NOT NULL,
  update_user_id int(11) NOT NULL
);
ALTER TABLE sales AUTO_INCREMENT=100;

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
	content text NOT NULL,
    create_date datetime NOT NULL,
    create_user_id int(11) NOT NULL,
    update_date datetime NOT NULL,
    update_user_id int(11) NOT NULL
);
INSERT INTO global_templates(`template_code`,`title`,`content`,`create_date`,`create_user_id`,`update_date`,`update_user_id`) 
VALUES ('pdf_template','PDF Template',
'<h3 class="ql-align-center"><u>PROPOSAL FOR DETAILING</u></h3><h3 class="ql-align-center"><u>${sales.projectName}</u></h3><p class="ql-align-center"><br></p><p class="ql-align-right">Date: {sysdate}</p><p class="ql-align-right">JOB NO: ${jobNumber}</p><p class="ql-align-right"><br></p><p>To</p><p>${client.contactName}</p><p>${client.addressLine1}</p><p>{if_client.addressLine2}</p><p>${client.addressLine2}</p><p>{if_close}</p><p>${client.city}, ${client.state}</p><p>${client.country}{if_client.zip},${client.zip}{if_close}</p><p><br></p><p><br></p><p><strong><u>PURPOSE</u></strong></p><p><br></p><p>This is a proposal from&nbsp;<strong>3S Services Group LLC</strong>. For Detailing &amp; Fabrication Drawing Services to 4G Steel Fabrication LLC. Regarding&nbsp;<strong>${sales.projectName}</strong></p><p><br></p><p><strong><u>SCOPE OF WORK</u></strong></p><p><br></p><p><strong><u>Main Steel</u></strong></p><p>{estimation.mainSteelInclusions}</p><p><strong><u>Misc Steel</u></strong></p><p>{estimation.miscSteelInclusions}</p><p><br></p><p><strong><u>EXCLUSIONS OF WORK</u></strong></p><p><br></p><p><strong><u>Main Steel</u></strong></p><p>{estimation.mainSteelExclusions}</p><p><strong><u>Misc Steel</u></strong></p><p>{estimation.miscSteelExclusions}</p><p><br></p><p><strong><u>REQUIREMENTS FROM THE CLIENT</u></strong></p><p><br></p><ol><li>Detailing Standards</li><li>Released for Construction set</li><li>All Addendums and Bulletins if</li><li>General Contractor name</li><li>Job Number</li><li>Drawing sheet layout and requirements</li><li>Drawing Template</li></ol><p><br></p><p><strong><u>OUR APPROVAL SET ALWAYS COMES WITH</u></strong></p><p><br></p><ol><li>RFI log (If any)</li><li>Contract Drawings log</li><li>RFI (If any)</li><li>RFI log (If any)</li></ol><p><br></p><p><strong><u>DELIVER CHECKS</u></strong></p><p><br></p><ol><li>NC1 Files</li><li>Kiss Files</li><li>PDF</li><li>CNC Files</li><li>EJE Files</li><li>Calculation if required (No Stamping)</li><li>Steel Member cut list</li><li>Field Bolt List</li><li>Shop Bolt list</li><li>Sequencing jobs, sequence list</li><li>DXF files for your plasma</li></ol><p><br></p><p><strong><u>LEADTIME &amp;, MILESTONES</u></strong></p><p><br></p><p class="ql-indent-1">Detailing Schedule</p><p class="ql-indent-1">{schedulesList}</p><p class="ql-indent-1">X = Purchase Order release date and final drawings set confirmation.</p><p><br></p><p><strong><u>DETAILING PRICE</u></strong></p><p><br></p><p class="ql-indent-1"><strong>Main Steel USD: ${quote.mainSteelPrice}</strong></p><p class="ql-indent-1"><strong>Misc. Steel USD: ${quote.miscSteelPrice}</strong></p><p><br></p><p><strong><u>PAYMENT TERMS</u></strong></p><p><br></p><p class="ql-indent-1">1) On Submission of Shop Drawings – 100%</p><p><br></p><p>All Invoices should be paid within 30 Days net after release for final approval.</p><p>All Cheques shall be sent to the below address</p><p><br></p><p>3S Services Group</p><p>733 Telemark Trial</p><p>Frisco, TX 75034.</p><p>Phone: - 630-881-2687</p><p><br></p><p><strong><u>CHANGE ORDERS</u></strong></p><p><br></p><p>Depending on the Job requirement regarding the extra work incurred, additional amount of money would be charged on the extra hour. All these charges would be sent in the form of a&nbsp;<strong>CHANGE ORDER</strong>&nbsp;for approval from client</p><p><br></p><p>Change Order will be $50.00 per Hr. Minor Changes are not Change Orders. Shop Mistakes, field miss fit-ups Solution will be provided at no cost.</p><p><br></p><p><strong><u>CONTACT DETAILS FOR COMMUNICATION</u></strong></p><p><br></p><p class="ql-indent-1"><strong>Naseer</strong></p><p class="ql-indent-1"><strong>Senior Sales Executive</strong></p><p class="ql-indent-1"><strong>3S Services Group LLC</strong></p><p class="ql-indent-1"><strong>733 Telemark Trial,&nbsp;</strong></p><p class="ql-indent-1"><strong>Frisco, TX 75034.</strong></p><p class="ql-indent-1"><strong>Direct: +1.972-370-3067</strong></p><p class="ql-indent-1"><strong>Phone: 972-737-8088, Ext:210</strong></p><p class="ql-indent-1"><strong>Email: naseer@3sservicesgroup.com</strong></p><p class="ql-indent-1"><strong>Website: www.3ssteelservices.com</strong></p><p class="ql-indent-1"><br></p><p>This Proposal is valid for 30Days. added here</p><p><br></p><p><strong><u>ACCEPTED.</u></strong></p><p><br></p><p class="ql-indent-1">sign:-_______________________________</p><p><br></p><p class="ql-indent-1">Title_______________________________</p><p class="ql-indent-1"><br></p><p class="ql-indent-1">Company : __________________________</p><p class="ql-indent-1"><br></p><p class="ql-indent-1">P.O #______________________________</p>',
sysdate(),1,sysdate(),1);

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