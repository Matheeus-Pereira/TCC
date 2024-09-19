use prototipo;
DROP TABLE `prototipo`.`estoques`;
DROP TABLE `prototipo`.`produtos`;


create table estoques(
id int not null,
nome varchar(250) not null,
descricao text,
primary key(id)
);

create table produtos(
id int not null,
nome varchar(250),
descricao text,
quantidade double not null,
id_estoque int default null,
primary key (id),
foreign key (id_estoque) references estoques(id)
);


insert into estoques(id, nome, descricao)
values
(2, 'montagem', 'montagem'),
(1, 'deposito geral', 'entrada de itens'),
(10, 'expedição', 'saida de itens');

insert into produtos(id, nome, quantidade, id_estoque)
values
(03110462, 'chave de fenda', 2, 1),
(04120532, 'chaveta 12', 2, 1);
/*fazer as movimentações via sql e depois passar para js*/

/*retira um item da tabela depois confere */
update produtos set quantidade = quantidade-1 where id = 03110462 and id_estoque=1;
select quantidade,id,  id_estoque from produtos;
/*retira um item da tabela depois confere*/

/*add um item a tabela*/
update produtos set quantidade = quantidade+1 where id = 03110462 and id_estoque=2;
select quantidade,id,  id_estoque from produtos;
/*add um item a tabela*/

/*pesquisar o item*/
select quantidade from produtos where id_estoque=1 and id=03110462;
/*pesquisar o item*/

select * from estoques;
select * from produtos;

select * from  produtos where id= 03110462;