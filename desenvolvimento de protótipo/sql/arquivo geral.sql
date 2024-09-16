use prototipo;
/*
DROP TABLE `prototipo`.`estoques`;*/


create table estoques(
id int not null,
nome varchar(250) not null,
descricao text,
primary key(id)
);

create table produtos(
id int,
nome varchar(250),
descricao text,
id_estoque int default null,
primary key (id),
foreign key (id_estoque) references estoques(id)
);


insert into estoques(id, nome, descricao)
values
(1, 'deposito geral', 'entrada de itens pelo recebimento'),
(10, 'deposito expedição', 'saida de produto acabado');

insert into produtos(id, nome, descricao, id_estoque)
values
(03110462, 'chave de fenda', 'produto para uso da manutenção', 1),
(04120532, 'chaveta 12', 'produto para montagem', 1);