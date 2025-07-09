package com.projeto_ordemservico.projeto_ordemservico;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import Model.Peca;
import Model.pecas_utilizadas; 
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;

public class EstoqueController {

    @FXML private Button BtVoltar;

    @FXML private TableView<Peca> TabelaPeca;
    @FXML private TableColumn<Peca, Integer> id_peca;
    @FXML private TableColumn<Peca, String> nome;
    @FXML private TableColumn<Peca, String> descricao;
    @FXML private TableColumn<Peca, Double> preco_unitario;
    @FXML private TableColumn<Peca, Integer> quantidade_estoque;
    @FXML private TableColumn<Peca, Integer> estoque_minimo;
    private ObservableList<Peca> listaPeca;

    @FXML private TableView<pecas_utilizadas> TabelaPecasUtilizadas;
    @FXML private TableColumn<pecas_utilizadas, Integer> id_pecas_utilizadas;
    @FXML private TableColumn<pecas_utilizadas, Integer> id_aparelho;
    @FXML private TableColumn<pecas_utilizadas, Integer> id_peca_utilizada; // Renomeado para evitar conflito com 'id_peca'
    @FXML private TableColumn<pecas_utilizadas, Integer> quantidade_utilizada; // Renomeado para evitar conflito com 'quantidade_estoque'
    private ObservableList<pecas_utilizadas> listaPecasUtilizadas;

    @FXML
    public void initialize() {

        id_peca.setCellValueFactory(new PropertyValueFactory<>("id_peca"));
        nome.setCellValueFactory(new PropertyValueFactory<>("nome"));
        descricao.setCellValueFactory(new PropertyValueFactory<>("descricao"));
        preco_unitario.setCellValueFactory(new PropertyValueFactory<>("preco_unitario"));
        quantidade_estoque.setCellValueFactory(new PropertyValueFactory<>("quantidade_estoque"));
        estoque_minimo.setCellValueFactory(new PropertyValueFactory<>("estoque_minimo"));
        loadPecasFromDatabase(); 

        id_pecas_utilizadas.setCellValueFactory(new PropertyValueFactory<>("id_pecas_utilizadas"));
        id_aparelho.setCellValueFactory(new PropertyValueFactory<>("id_aparelho"));
        id_peca_utilizada.setCellValueFactory(new PropertyValueFactory<>("id_peca")); 
        quantidade_utilizada.setCellValueFactory(new PropertyValueFactory<>("quantidade")); 
        loadPecasUtilizadasFromDatabase(); 
    }

    private void loadPecasFromDatabase() { // Renomeado
        listaPeca = FXCollections.observableArrayList();
        final String URL = "jdbc:mysql://localhost:3306/Projeto_TCC_gil";
        final String USER = "root";
        final String PASSWORD = "";

        String query = "SELECT * FROM Peca";

        try (
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery()
        ) {
            while (rs.next()) {
                Peca peca = new Peca(
                    rs.getInt("id_peca"),
                    rs.getString("nome"),
                    rs.getString("descricao"),
                    rs.getDouble("preco_unitario"),
                    rs.getInt("quantidade_estoque"),
                    rs.getInt("estoque_minimo")
                );
                listaPeca.add(peca);
            }
            TabelaPeca.setItems(listaPeca);
        } catch (SQLException e) {
            e.printStackTrace();
            System.err.println("Erro ao carregar peças do banco de dados: " + e.getMessage());
        }
    }

    private void loadPecasUtilizadasFromDatabase() {
        listaPecasUtilizadas = FXCollections.observableArrayList();
        final String URL = "jdbc:mysql://localhost:3306/Projeto_TCC_gil";
        final String USER = "root";
        final String PASSWORD = "";


        String query = "SELECT * FROM pecas_utilizadas";

        try (
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery()
        ) {
            while (rs.next()) {
                pecas_utilizadas pecas_utilizadas = new pecas_utilizadas(
                    rs.getInt("id_pecas_utilizadas"),
                    rs.getInt("id_aparelho"),
                    rs.getInt("id_peca"),
                    rs.getInt("quantidade")
                );
                listaPecasUtilizadas.add(pecas_utilizadas);
            }
            TabelaPecasUtilizadas.setItems(listaPecasUtilizadas);
        } catch (SQLException e) {
            e.printStackTrace();
            System.err.println("Erro ao carregar peças utilizadas do banco de dados: " + e.getMessage());
        }
    }

    // volta para a tela inicial
    @FXML
    protected void VoltarParaTelaAnterior() throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("PagInicial.fxml"));
        Parent root = loader.load();
        if (NavegacaoTelas.mainStage != null) {
            NavegacaoTelas.mainStage.setScene(new Scene(root));
            NavegacaoTelas.mainStage.show();
        } else {
            System.err.println("Erro: mainStage não foi inicializado em NavegacaoTelas.");

        }
    }
}