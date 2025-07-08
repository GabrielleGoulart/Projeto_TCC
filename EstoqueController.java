package com.projeto_ordemservico.projeto_ordemservico;

import javafx.fxml.FXML;

public class EstoqueController {
  //Verificar funcionalidades ainda---
  @FXML private TableWiew TbPeca;
  @FXML private Button BtVoltar;

  @FXML private TableWiew<Peca> TabelaPeca;
  @FXML private TableColumn<Peca, Integer> id_peca;
  @FXML private TableColumn<Peca, String> nome;
  @FXML private TableColumn<Peca, String> descricao;
  @FXML private TableColumn<Peca, Double> preco_unitario;
  @FXML private TableColumn<Peca, Integer> quantidade_estoque;
  @FXML private TableColumn<Peca, Integer> estoque_minimo;
  private ObservableList<Peca> listaPeca;

  //nao peronto ---:/
  @FXML
  public void initialize() {
  id_peca.setCellValueFactory(new PropertyValueFactory<>());
  nome.setCellValueFactory(new PropertyValueFactory<>());
  descricao.setCellValueFactory(new PropertyValueFactory<>());
  preco_unitario.setCellValueFactory(new PropertyValueFactory<>());
  quantidade_estoque.setCellValueFactory(new PropertyValueFactory<>());
  estoque_minimo.setCellValueFactory(new PropertyValueFactory<>());




  }
}