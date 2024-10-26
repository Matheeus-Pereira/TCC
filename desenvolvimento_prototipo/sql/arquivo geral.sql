use prototipo;
DROP TABLE `prototipo`.`itensEstoque`;
DROP TABLE `prototipo`.`produtos`;
DROP TABLE `prototipo`.`estoques`;

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
primary key (id)
);

create table itensEstoque(
id int auto_increment not null,
descricao varchar(250) default "",
quantidade varchar(250) default "",
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

insert into itensEstoque(id_estoque, id_produto)
values 
(2, 1),
(2, 2);


/*fazer as movimentações via sql e depois passar para js*/


-- abastecendo estoques
update itensEstoque set quantidade=10 where id_produto=1 and id_estoque=2;
update itensEstoque set quantidade=10 where id_produto=2 and id_estoque=2;
-- para verificar em que estoque o produto está devo pesquisar pela tabela itens estoque

/*retira um item da tabela depois confere*/

/*add um item a tabela*/
update itensEstoque set quantidade = quantidade+10 where id_produto and id_estoque=1;
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
select * from itensEstoque;
select * from produtos;


select quantidade from itensEstoque where id_produto = 1 and id_estoque = 2;

select id from estoques where codigo =1;
select id from produtos where codigo =03110462;


 select ie.quantidade 
    from itensEstoque ie
    join produtos p on ie.id_produto = p.id
    join estoques e on ie.id_estoque = e.id
    where e.codigo = 2 and p.codigo = 03110462;
