drop table if exists `contribute_url`;

create table `contribute_url` (
    `id` int primary key auto_increment,
    `url` varchar(255) not null,
    `email` varchar(100),
    `frequency` tinyint default 7,
    `last_process` datetime default null,
    `created_at` datetime not null,
    unique key (`url`)
) default charset=utf8;
