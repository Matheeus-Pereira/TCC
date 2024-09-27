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
id_estoque int default 1,
primary key (id)
);

create table itensEstoque(
id int auto_increment not null,
nmr int default 0,
descricao varchar(250) default "",
quantidade int default 0,
id_estoque int not null,
id_produto int not null,
primary key(id),
foreign key (id_estoque) references estoques(id),
foreign key (id_produto) references produtos(id)
);

insert into estoques(codigo, nome)
values
(2, 'montagem'),
(1, 'deposito geral'),
(10, 'expedição');

insert into produtos(codigo, nome)
values
(03110462, 'chave de fenda'),
(04120532, 'chaveta 12');

insert into itensEstoque(nmr,id_estoque, id_produto)
values 
(03110462,1, 1),
(04120532,2, 2);


/*fazer as movimentações via sql e depois passar para js*/

-- criar item durante movimentação
insert into itensEstoque(nmr,id_estoque, id_produto)
values 
(03110462,1,2);
-- criar item durante movimentação


/*retira um item da tabela depois confere */

update itensEstoque set quantidade=10 where nmr=03110462 and id_estoque=2;
select * from itensEstoque;

/*retira um item da tabela depois confere*/

/*add um item a tabela*/
update itensEstoque set quantidade = quantidade+10 where nmr=03110462 and id_estoque=1;
select * from itensEstoque;
/*add um item a tabela*/


/*pesquisar o item*/
select quantidade from itensestoque where id_estoque=1 and nmr=03110462;
/*pesquisar o item*/

select * from estoques;
select id from produtos where id = (select id_produto from itensEstoque where nmr=03110462);
select * from itensEstoque;

select id_estoque from itensEstoque where nmr=03110462;

select * from  produtos where id= 03110462;


-- simular o processo em sql e o repetir mem js
