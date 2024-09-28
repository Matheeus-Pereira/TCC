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
-- necessário rever lógica de tabelas, é necessário ter a id do estoque no produto?

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


-- abastecendo estoques
update itensEstoque set quantidade=10 where nmr=03110462 and in_estoque=1;
update itensEstoque set quantidade=10 where nmr=04120532 and in_estoque=1;

/* retira item */

update itensEstoque set quantidade=10 where nmr=03110462 and id_estoque=2;
select * from itensEstoque;

/*retira um item da tabela depois confere*/

/*add um item a tabela*/
update itensEstoque set quantidade = quantidade+10 where nmr=03110462 and id_estoque=1;
select * from itensEstoque;
/*add um item a tabela*/


/*pesquisar quantidade em estoque*/

select quantidade from itensestoque where id_estoque=1 and nmr=03110462;

/*pesquisar quantidade em estoque*/

-- id do estoque a partir do codigo
select id from estoques where codigo=1;
-- id do estoque a partir do codigo

-- id do produto
select id from produtos ;
-- id do produto
-- criar item durante movimentação
insert into itensEstoque(nmr,id_estoque, id_produto)
values (03110462,2,1);
select*from itensEstoque where id_produto=1;
-- criar item durante movimentação

select * from estoques;
select id from produtos where id = (select id_produto from itensEstoque where nmr=03110462);
select * from itensEstoque;



-- simular o processo em sql e o repetir mem js
