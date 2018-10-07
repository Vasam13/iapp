USE `iapp`;

DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
    `project_id` int(11) PRIMARY KEY AUTO_INCREMENT,
    `project_name` varchar(500) DEFAULT NULL,
    `complexity` varchar(100) DEFAULT NULL,
    `po_number` int(11) DEFAULT NULL,
    `sales_id` int(11) NOT NULL,
    `po_date` date DEFAULT NULL,
    `client_hours` int(11) DEFAULT NULL,
    `received_date` date DEFAULT NULL,
    `con_folder_link` varchar(500) DEFAULT NULL,
    `targeted_ofa_date` date DEFAULT NULL,
    `actual_ofa_date` date DEFAULT NULL,
    `bfa_date` date DEFAULT NULL,
    `fabrication_date` date DEFAULT NULL,
    `remarks` varchar(500) DEFAULT NULL,
    `status`  varchar(50) DEFAULT NULL,
    `create_date` datetime NOT NULL,
    `create_user_id` int(11) NOT NULL,
    `update_date` datetime NOT NULL,
    `update_user_id` int(11) NOT NULL
);
ALTER TABLE clients AUTO_INCREMENT=1000;

DROP TABLE IF EXISTS `project_contract_drawings`;
CREATE TABLE `project_contract_drawings` (
    `id` int(11) PRIMARY KEY AUTO_INCREMENT,
    `project_id` int(11) NOT NULL,
    `revision_no` int(11) NOT NULL,
    `received_date` datetime DEFAULT NULL,
    `number_of_sheets` varchar(45) DEFAULT NULL,
    `received_drawing_folder` varchar(500) DEFAULT NULL,
    `remarks` varchar(1024) DEFAULT NULL,
    `create_date` datetime NOT NULL,
    `create_user_id` int(11) NOT NULL,
    `update_date` datetime NOT NULL,
    `update_user_id` int(11) NOT NULL
);

DROP TABLE IF EXISTS `project_rfi_details`;
CREATE TABLE `project_rfi_details` (
    `id` int(11) PRIMARY KEY AUTO_INCREMENT,
    `project_id` int(11) NOT NULL,
    `sent_date` datetime DEFAULT NULL,
    `received_date` datetime DEFAULT NULL,
    `description` varchar(1024) DEFAULT NULL,
    `rfi_email_folder` varchar(500) DEFAULT NULL,
    `status` varchar(10) DEFAULT NULL,
    `remarks` varchar(1024) DEFAULT NULL,
    `create_date` datetime NOT NULL,
    `create_user_id` int(11) NOT NULL,
    `update_date` datetime NOT NULL,
    `update_user_id` int(11) NOT NULL
);

DROP TABLE IF EXISTS `project_cnn_details`;
CREATE TABLE `project_cnn_details` (
    `id` int(11) PRIMARY KEY AUTO_INCREMENT,
    `project_id` int(11) NOT NULL,
    `sent_date` datetime DEFAULT NULL,
    `received_date` datetime DEFAULT NULL,
    `description` varchar(1024) DEFAULT NULL,
    `cnn_hours` INT(11) DEFAULT NULL,
    `status` varchar(10) DEFAULT NULL,
    `remarks` varchar(1024) DEFAULT NULL,
    `create_date` datetime NOT NULL,
    `create_user_id` int(11) NOT NULL,
    `update_date` datetime NOT NULL,
    `update_user_id` int(11) NOT NULL
);

DROP TABLE IF EXISTS `project_bfa_details`;
CREATE TABLE `project_bfa_details` (
    `id` int(11) PRIMARY KEY AUTO_INCREMENT,
    `project_id` int(11) NOT NULL,
    `sub_number`  varchar(100) NOT NULL,
    `description` varchar(1024) DEFAULT NULL,
    `release_date` datetime DEFAULT NULL,
    `received_date` datetime DEFAULT NULL,
    `bfa_status` varchar(100) DEFAULT NULL,
	`link_with_server` varchar(300) DEFAULT NULL,
    `status` varchar(100) DEFAULT NULL,
    `remarks` varchar(1024) DEFAULT NULL,
    `create_date` datetime NOT NULL,
    `create_user_id` int(11) NOT NULL,
    `update_date` datetime NOT NULL,
    `update_user_id` int(11) NOT NULL
);

DROP TABLE IF EXISTS `project_task_details`;
CREATE TABLE `project_task_details` (
    `id` int(11) PRIMARY KEY AUTO_INCREMENT,
    `project_id` int(11) NOT NULL,
    `task_name`  varchar(200) NOT NULL,
    `type`  varchar(100) NOT NULL,
    `description` varchar(1024) DEFAULT NULL,
    `assign_date` datetime DEFAULT NULL,
    `development_hours` int(11) NOT NULL,
    `assigned_to` int(11) NOT NULL,
    `status` varchar(100) DEFAULT NULL,
    `remarks` varchar(1024) DEFAULT NULL,
    `create_date` datetime NOT NULL,
    `create_user_id` int(11) NOT NULL,
    `update_date` datetime NOT NULL,
    `update_user_id` int(11) NOT NULL
);