use prototipo;
DROP TABLE `prototipo`.`estoques`;
DROP TABLE `prototipo`.`produtos`;
DROP TABLE `prototipo`.`itensEstoque`;


create table estoques(
id int auto_increment not null,
codigo int not null,
nome varchar(250) not null,
descricao text,
primary key(id)
);

create table produtos(
id int  auto_increment not null,
codigo int not null,
nome varchar(250),
descricao text,
id_estoque int default null,
primary key (id),
foreign key (id_estoque) references estoques(id)
);

create table itensEstoque(
id int auto_increment not null,
nmr int,
descrcao varchar(250) default "",
quantidade int default 0,
id_estoque int default null,
id_produto int default null,
primary key(id),
foreign key (id_estoque) references estoques(id),
foreign key (id_produto) references produtos(id)
);

insert into estoques(codigo, nome)
values
(2, 'montagem'),
(1, 'deposito geral'),
(10, 'expedição');

insert into produtos(codigo, nome, id_estoque)
values
(03110462, 'chave de fenda', 1),
(04120532, 'chaveta 12', 1);

insert into itensEstoque(nmr,id_estoque, id_produto, quantidade)
values 
(03110462,1, 1,0),
(04120532,2, 2,0);
/*fazer as movimentações via sql e depois passar para js*/

-- criar item durante movimentação
insert into itensEstoque(nmr,id_estoque, id_produto, quantidade)
values 
(03110462,2, 1);


select * from itensEstoque;
-- criar item durante movimentação


/*retira um item da tabela depois confere */

update itensEstoque set quantidade=quantidade-1 where nmr=03110462 and id_estoque=1;
select * from itensEstoque;

/*retira um item da tabela depois confere*/

/*add um item a tabela*/

update itensEstoque set quantidade = quantidade+1 where nmr=03110462 and id_estoque=1;

/*add um item a tabela*/

/*pesquisar o item*/
select quantidade from produtos where id_estoque=2 and id=03110462;
/*pesquisar o item*/

select * from estoques;
select * from produtos;
select * from itensEstoque;

select * from  produtos where id= 03110462;
