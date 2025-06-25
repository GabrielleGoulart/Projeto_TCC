create database Projeto_OSladyService;
use Projeto_OSladyService;

-- tabela de cadastro cliente
CREATE TABLE Cadastro_Cliente(
 id_cliente INT AUTO_INCREMENT PRIMARY KEY,
 nome_cliente VARCHAR(80) NOT NULL,
 cpf VARCHAR(11) UNIQUE,
 cnpj VARCHAR (18) UNIQUE,
 endereco VARCHAR(255),
 cep INT UNIQUE NOT NULL,
 email VARCHAR(100) NOT NULL,
telefone VARCHAR(11) NOT NULL
 );

 
-- tabela de Cadastro de aparelhos
CREATE TABLE Cadastro_Aparelhos(
    id_aparelho INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    nome_aparelho VARCHAR(50) NOT NULL,
    defeito VARCHAR(200) NOT NULL,
    servico_executados VARCHAR(200) NOT NULL,
    pecas_aplicadas varchar(255) NULL,
    nome_tecnico VARCHAR (100) NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Adicionado NOT NULL e DEFAULT
    observacoes VARCHAR(200) NOT NULL,
    valor_total DOUBLE NOT NULL,
    foto_aparelho VARCHAR(255),
    FOREIGN KEY (id_cliente) REFERENCES Cadastro_Cliente(id_cliente)
);

ALTER TABLE Cadastro_Aparelhos ADD COLUMN status VARCHAR(20) DEFAULT 'Em andamento';


-- tabela de Historico
CREATE TABLE Historico (
    id_historico INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_aparelho INT NOT NULL,
    data_entrada DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_saida DATETIME NOT NULL,
    status_servico VARCHAR(20) NOT NULL,
    observacoes VARCHAR(100) NOT NULL,
    nome_tecnico VARCHAR(100) NOT NULL,
    pecas_aplicadas VARCHAR(255) NOT NULL,
    servico_executado VARCHAR(200) NOT NULL,
    defeito VARCHAR(200) NOT NULL,
    valor_total DOUBLE NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cadastro_Cliente(id_cliente),
    FOREIGN KEY (id_aparelho) REFERENCES Cadastro_Aparelhos(id_aparelho)
);

create table Pecas(
id_peca INT auto_increment primary key,
nome varchar(100) not null,
descricao varchar(200),
preco_unitario double not null,
quantidade_estoque int not null,
estoque_minimo int default 0
);

create table pecas_ultilizadas(
id_pecas_ultilizadas int auto_increment primary key,
id_aparelho int not null,
id_peca int not null,
quantidade int not null,
foreign key (id_aparelho) references Cadastro_Aparelho(id_aparelho),
foreign key (id_peca) references Pecas(id_peca)
);

create table agenda(
id_agenda int auto_increment primary key,
id_aparelho int not null,
data_agendada datetime not null,
descricao varchar(200),
foreign key (id_aparelho) references Cadastro_Aparelhos(id_aparelho)
);



-- inserções Cadastro Clientes

INSERT INTO Cadastro_Cliente (nome_cliente, cpf, cnpj, endereco, cep, email, telefone) VALUES
('Lucas Oliveira', '12345678901', NULL, 'Rua Timbiras, 123, Centro', '30140060', 'lucas.oliveira@gmail.com', '31988776655'),
('Ana Paula Souza', '23456789012', NULL, 'Av. Afonso Pena, 1500, Funcionários', '30130004', 'ana.souza@yahoo.com', '31999887766'),
('João Pedro Lima', '34567890123', NULL, 'Rua da Bahia, 900, Lourdes', '30160011', 'joao.lima@outlook.com', '31991112233'),
('Fernanda Gomes', '45678901234', NULL, 'Rua Curitiba, 400, Centro', '30170010', 'fernanda.g@gmail.com', '31994443322'),
('Carlos Henrique Silva', '56789012345', NULL, 'Rua dos Goitacazes, 789, Barro Preto', '30190051', 'carlos.h@bol.com.br', '31996667788'),
('Mariana Castro', '67890123456', NULL, 'Av. Cristóvão Colombo, 100, Savassi', '30110000', 'mariana.castro@hotmail.com', '31993335522'),
('Paulo Ricardo Fonseca', '78901234567', NULL, 'Rua Espírito Santo, 450, Centro', '30120031', 'paulo.fonseca@gmail.com', '31990008877'),
('Juliana Andrade', '89012345678', NULL, 'Av. Amazonas, 2000, Gameleira', '30510060', 'juliana.andrade@terra.com.br', '31995554433'),
('Tech Solutions LTDA', NULL, '12.345.678/0001-90', 'Av. Raja Gabaglia, 2500, Estoril', '30494090', 'contato@techsolutions.com.br', '3121223344'),
('Construtora BH Ltda', NULL, '23.456.789/0001-80', 'Rua dos Inconfidentes, 600, Lourdes', '30140042', 'suporte@construtorabh.com.br', '3122445566'),
('Minas Softwares ME', NULL, '34.567.890/0001-70', 'Av. do Contorno, 3000, Floresta', '30110060', 'atendimento@minassoft.com.br', '3122334455'),
('Delícias Mineiras Alimentos', NULL, '45.678.901/0001-60', 'Rua Padre Pedro Pinto, 1000, Venda Nova', '31510020', 'vendas@deliciasmineiras.com.br', '3133445566'),
('BH Imports e Exportações', NULL, '56.789.012/0001-50', 'Av. Cristiano Machado, 7000, Cidade Nova', '31170090', 'comercial@bhimports.com.br', '3133221100'),
('Clínica Vida Saudável', NULL, '67.890.123/0001-40', 'Rua Gonçalves Dias, 1100, Funcionários', '30140063', 'contato@vidasaudavel.com.br', '3133112200'),
('Grupo Educacional Saber Mais', NULL, '78.901.234/0001-30', 'Rua Professor Moraes, 777, Savassi', '30150030', 'contato@sabermais.com.br', '3133556677');


-- Inserções Cadastr de aparelhos
INSERT INTO Cadastro_Aparelhos (id_cliente, nome_aparelho, defeito, servico_executados, pecas_aplicadas, valor_total, observacoes, nome_tecnico) VALUES
(1, 'Smartphone Samsung Galaxy S21', 'Tela quebrada', 'Substituição de tela', 'Tela AMOLED original Samsung', 1200.50, 'Cliente preferiu modelo de tela original.', 'Carlos Oliveira'),
(2, 'Notebook Dell Inspiron 15', 'Não liga', 'Troca de placa-mãe', 'Placa-mãe compatível Dell', 2200.00, 'A placa-mãe estava danificada e foi substituída por modelo compatível.', 'Fernanda Santos'),
(3, 'iPhone 12', 'Bateria não carrega', 'Substituição da bateria', 'Bateria original Apple', 900.00, 'Substituição da bateria original por uma nova.', 'João Pereira'),
(4, 'Smart TV LG 55"', 'Não liga', 'Reparo na fonte de alimentação', 'Componentes eletrônicos da fonte (capacitores, fusíveis)', 750.00, 'Fonte de alimentação danificada foi reparada.', 'Luciana Lima'),
(5, 'Aparelho de Som Philips', 'Sem som', 'Troca de alto-falante', '2 alto-falantes novos', 350.00, 'Foram trocados dois alto-falantes danificados.', 'Ricardo Souza'),
(6, 'Máquina de Lavar Brastemp', 'Não centrifuga', 'Verificação e reparo no motor', 'Rotor e escovas do motor', 800.00, 'Motor da máquina foi reparado e reprogramado.', 'Tatiane Costa'),
(7, 'Ar Condicionado Springer', 'Não está gelando', 'Limpeza do filtro e recarga de gás', 'Gás R-410A e filtro de ar', 350.00, 'Foi feita limpeza completa e recarga do gás refrigerante.', 'Marcos Alves'),
(8, 'Tablet Samsung Galaxy Tab', 'Tela preta', 'Substituição da tela', 'Tela touch LCD Samsung', 500.00, 'Tela nova instalada, aparelho funcionando perfeitamente.', 'José Santos'),
(9, 'Cafeteira Nespresso', 'Não esquenta', 'Substituição da resistência', 'Resistência nova 220V', 250.00, 'Resistência foi substituída e testada.', 'Ana Beatriz'),
(10, 'Smartphone Motorola Moto G', 'Não liga', 'Troca de placa de circuito', 'Placa lógica compatível Motorola', 450.00, 'Placa de circuito substituída e aparelho testado.', 'Roberto Lima'),
(11, 'Notebook Apple MacBook Pro', 'Teclado com teclas quebradas', 'Substituição do teclado', 'Teclado original Apple com retroiluminação', 1300.00, 'Teclado original foi trocado por um novo.', 'André Costa'),
(12, 'Impressora HP DeskJet', 'Papel atolado', 'Desmontagem e limpeza do mecanismo', 'Sem peças aplicadas', 150.00, 'Foi feito um processo de limpeza e remoção de obstruções.', 'Cláudia Martins'),
(13, 'Geladeira Electrolux', 'Não está gelando', 'Troca do termostato', 'Termostato Electrolux original', 600.00, 'Termostato trocado e o aparelho voltou a funcionar normalmente.', 'José Almeida'),
(14, 'Roteador TP-Link', 'Sinal fraco', 'Reconfiguração do roteador', 'Sem peças aplicadas', 100.00, 'Reconfigurado para otimizar sinal e melhorar alcance.', 'Gabriela Souza'),
(15, 'Console PlayStation 5', 'Desliga sozinho', 'Reparo na fonte de alimentação', 'Fonte de alimentação nova PS5', 1000.00, 'Fonte foi trocada e o problema resolvido.', 'Felipe Nogueira');


-- Inserções Corrigidas na Tabela Historico
INSERT INTO Historico (
 id_cliente, id_aparelho, data_entrada, data_saida,
 status_servico, observacoes, nome_tecnico, pecas_aplicadas,
 servico_executado, defeito, valor_total
)
VALUES
(1, 1, '2025-05-01 09:00:00', '2025-05-01 14:00:00', 'Finalizado', 'Aparelho reparado e testado.', 'Carlos Oliveira', 'Tela AMOLED original Samsung', 'Substituição de tela', 'Tela quebrada', 1200.50),
(2, 3, '2025-05-02 10:30:00', '2025-05-02 15:00:00', 'Em andamento', 'Aguarda peça de reposição.', 'Fernanda Santos', 'Placa-mãe compatível Dell', 'Troca de placa-mãe', 'Não liga', 2200.00),
(3, 5, '2025-05-03 11:00:00', '2025-05-03 11:00:00', 'Em andamento', 'Aparelho em análise.', 'João Pereira', 'Bateria original Apple', 'Substituição da bateria', 'Bateria não carrega', 900.00),
(4, 2, '2025-05-04 13:00:00', '2025-05-05 16:00:00', 'Finalizado', 'Troca de tela realizada.', 'Luciana Lima', 'Tela original LG', 'Reparo na tela', 'Tela quebrada', 750.00),
(5, 4, '2025-05-05 09:00:00', '2025-05-06 18:00:00', 'Finalizado', 'Reparo de software e testes completos.', 'Ricardo Souza', 'Alto-falante novo', 'Troca de alto-falante', 'Sem som', 350.00),
(6, 6, '2025-05-06 08:00:00', '2025-05-06 08:00:00', 'Em andamento', 'Aguardando diagnóstico completo.', 'Tatiane Costa', 'Escovas do motor', 'Reparo no motor', 'Não centrifuga', 800.00),
(7, 7, '2025-05-07 10:00:00', '2025-05-07 14:30:00', 'Finalizado', 'Reparo de hardware concluído.', 'Marcos Alves', 'Gás R-410A e filtro de ar', 'Limpeza do filtro e recarga de gás', 'Não está gelando', 350.00),
(8, 8, '2025-05-08 12:00:00', '2025-05-08 12:00:00', 'Em andamento', 'Aparelho aguardando peça.', 'José Santos', 'Tela touch LCD Samsung', 'Substituição da tela', 'Tela preta', 500.00),
(9, 1, '2025-05-09 09:30:00', '2025-05-09 17:00:00', 'Finalizado', 'Ajuste de sistema completo.', 'Ana Beatriz', 'Resistência nova 220V', 'Substituição da resistência', 'Não esquenta', 250.00),
(10, 3, '2025-05-10 14:00:00', '2025-05-10 16:30:00', 'Finalizado', 'Substituição de peça feita com sucesso.', 'Roberto Lima', 'Placa lógica compatível Motorola', 'Troca de placa de circuito', 'Não liga', 450.00),
(11, 2, '2025-05-11 15:00:00', '2025-05-11 19:00:00', 'Finalizado', 'Atualização de software.', 'André Costa', 'Teclado original Apple com retroiluminação', 'Substituição do teclado', 'Teclado quebrado', 1300.00),
(12, 5, '2025-05-12 10:30:00', '2025-05-12 10:30:00', 'Em andamento', 'Teste em andamento.', 'Cláudia Martins', 'Sem peças aplicadas', 'Desmontagem e limpeza do mecanismo', 'Papel atolado', 150.00),
(13, 6, '2025-05-13 11:00:00', '2025-05-13 16:00:00', 'Finalizado', 'Problema resolvido com a placa.', 'José Almeida', 'Termostato Electrolux original', 'Troca do termostato', 'Não está gelando', 600.00),
(14, 7, '2025-05-14 12:30:00', '2025-05-14 12:30:00', 'Em andamento', 'Aguardando aprovação de orçamento.', 'Gabriela Souza', 'Sem peças aplicadas', 'Reconfiguração do roteador', 'Sinal fraco', 100.00),
(15, 8, '2025-05-15 13:45:00', '2025-05-15 17:30:00', 'Finalizado', 'Instalação de novo sistema operacional.', 'Felipe Nogueira', 'Fonte de alimentação nova PS5', 'Reparo na fonte de alimentação', 'Desliga sozinho', 1000.00);

select * from Cadastro_Cliente;
select * from Cadastro_Aparelhos;

SELECT
    h.id_historico,
    c.nome_cliente,
    a.nome_aparelho,
    h.data_entrada,
    h.data_saida,
    h.status_servico,
    h.observacoes,
    h.nome_tecnico,
    h.pecas_aplicadas,
    h.servico_executado,
    h.defeito,
    h.valor_total
FROM
    Historico h
JOIN Cadastro_Cliente c ON h.id_cliente = c.id_cliente
JOIN Cadastro_Aparelhos a ON h.id_aparelho = a.id_aparelho
WHERE h.status_servico = 'Finalizado'
ORDER BY h.data_entrada DESC
