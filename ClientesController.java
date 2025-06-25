package com.projeto_ordemservico.projeto_ordemservico;

import Model.Cadastro_Cliente;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.stage.Stage;

import java.io.IOException;
import java.sql.*;

public class  ClientesController {

    //controles do fxml
    @FXML private Button BtDeletar;
    @FXML private Button BtVoltar;
    @FXML private Button Btatualizar;
    @FXML private Button Bteditar;

    @FXML private TableView<Cadastro_Cliente> tabelaCadastro_ClientesTableView;

    //colunas da tabela de clientes
    @FXML private TableColumn<Cadastro_Cliente, Integer> id_cliente;
    @FXML private TableColumn<Cadastro_Cliente, String> nome_cliente;
    @FXML private TableColumn<Cadastro_Cliente, String> cpf;
    @FXML private TableColumn<Cadastro_Cliente, String> cnpj;
    @FXML private TableColumn<Cadastro_Cliente, String> endereco;
    @FXML private TableColumn<Cadastro_Cliente, Integer> cep;
    @FXML private TableColumn<Cadastro_Cliente, String> email;
    @FXML private TableColumn<Cadastro_Cliente, String> telefone;
    private ObservableList<Cadastro_Cliente> listaCadastro_Cliente;

    @FXML
    public void initialize() {
        id_cliente.setCellValueFactory(new PropertyValueFactory<>("id_cliente"));
        nome_cliente.setCellValueFactory(new PropertyValueFactory<>("nome_cliente"));
        cpf.setCellValueFactory(new PropertyValueFactory<>("cpf"));
        cnpj.setCellValueFactory(new PropertyValueFactory<>("cnpj"));
        endereco.setCellValueFactory(new PropertyValueFactory<>("endereco"));
        cep.setCellValueFactory(new PropertyValueFactory<>("cep"));
        email.setCellValueFactory(new PropertyValueFactory<>("email"));
        telefone.setCellValueFactory(new PropertyValueFactory<>("telefone"));

        loadFromDatabase();
    }

    //conexao com o banco
    private void loadFromDatabase() {
        listaCadastro_Cliente = FXCollections.observableArrayList();
        final String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
        final String USER = "root";
        final String PASSWORD = "";

        String query = "SELECT * FROM Cadastro_Cliente";

        try (
                Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
                PreparedStatement stmt = conn.prepareStatement(query);
                ResultSet rs = stmt.executeQuery()

        ) {
            while (rs.next()) {
                Cadastro_Cliente cliente = new Cadastro_Cliente(
                        rs.getInt("id_cliente"),
                        rs.getString("nome_cliente"),
                        rs.getString("cpf"),
                        rs.getString("cnpj"),
                        rs.getString("endereco"),
                        rs.getInt("cep"),
                        rs.getString("email"),
                        rs.getString("telefone")
                );
                listaCadastro_Cliente.add(cliente);
            }

            tabelaCadastro_ClientesTableView.setItems(listaCadastro_Cliente);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    //volta para a tela inicial
    @FXML
    protected void VoltarParaTelaAnterior() throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("PagInicial.fxml"));
        Parent root = loader.load();
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();
    }

    //Deleta a linha que voce selecionou
    @FXML
    private void deletarCliente() {
        Cadastro_Cliente clienteSelecionado = tabelaCadastro_ClientesTableView.getSelectionModel().getSelectedItem();

        if (clienteSelecionado != null) {
            // Alerta de confirmação
            Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
            alert.setTitle("Confirmação de Exclusão");
            alert.setHeaderText("Tem certeza que deseja excluir este cliente e todos os seus aparelhos?");
            alert.setContentText("Cliente: " + clienteSelecionado.getNome_cliente());

            alert.showAndWait().ifPresent(resposta -> {
                if (resposta == ButtonType.OK) {
                    final String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
                    final String USER = "root";
                    final String PASSWORD = "";

                    int clienteId = clienteSelecionado.getId_cliente();

                    // Primeiro, deletar os aparelhos associados ao cliente
                    String deleteAparelhosQuery = "DELETE FROM Cadastro_Aparelhos WHERE id_cliente = ?";
                    try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
                         PreparedStatement stmtAparelhos = conn.prepareStatement(deleteAparelhosQuery)) {
                        stmtAparelhos.setInt(1, clienteId);
                        stmtAparelhos.executeUpdate();
                        System.out.println("Aparelhos do cliente " + clienteId + " deletados.");
                    } catch (SQLException e) {
                        e.printStackTrace();
                        System.err.println("Erro ao deletar aparelhos do cliente: " + e.getMessage());
                        mostrarErro("Erro ao deletar aparelhos associados ao cliente.");
                        return; // Interrompe a deleção do cliente se houver erro ao deletar aparelhos
                    }

                    // Agora, deletar o cliente
                    String deleteClienteQuery = "DELETE FROM Cadastro_Cliente WHERE id_cliente = ?";
                    try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
                         PreparedStatement stmtCliente = conn.prepareStatement(deleteClienteQuery)) {
                        stmtCliente.setInt(1, clienteId);
                        int linhasAfetadas = stmtCliente.executeUpdate();

                        if (linhasAfetadas > 0) {
                            listaCadastro_Cliente.remove(clienteSelecionado);

                            Alert sucesso = new Alert(Alert.AlertType.INFORMATION);
                            sucesso.setTitle("Sucesso");
                            sucesso.setHeaderText(null);
                            sucesso.setContentText("Cliente deletado com sucesso!");
                            sucesso.showAndWait();
                        }

                    } catch (SQLException e) {
                        e.printStackTrace();
                        System.err.println("Erro ao deletar cliente: " + e.getMessage());
                        mostrarErro("Erro ao deletar cliente.");
                    }
                }
            });

        } else {
            // Alerta caso nenhum cliente esteja selecionado
            Alert alert = new Alert(Alert.AlertType.WARNING);
            alert.setTitle("Nenhuma Seleção");
            alert.setHeaderText("Nenhum cliente selecionado");
            alert.setContentText("Por favor, selecione um cliente na tabela para deletar.");
            alert.showAndWait();
        }
    }

    private void mostrarErro(String mensagem) {
        Alert erro = new Alert(Alert.AlertType.ERROR);
        erro.setTitle("Erro");
        erro.setHeaderText("Ocorreu um problema");
        erro.setContentText(mensagem);
        erro.showAndWait();
    }

    //atualiza a tabela de clientes
    @FXML
    private void atualizarTabela() throws IOException {
        loadFromDatabase();
        Alert alerta = new Alert(Alert.AlertType.INFORMATION);
        alerta.setTitle("Tabela Atualizada");
        alerta.setHeaderText(null);
        alerta.setContentText("A tabela foi atualizada com os dados mais recentes.");
        alerta.showAndWait();
    }

    //vc seleciona uma linha da tabela e aperta em editar, e vai abrir a tela de EditarClientes.fxml
    @FXML
    private void editarCliente() throws IOException {
        Cadastro_Cliente clienteSelecionado = tabelaCadastro_ClientesTableView.getSelectionModel().getSelectedItem();

        if (clienteSelecionado != null) {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("EditarClientes.fxml"));
            Parent root = loader.load();

            EditarClientesController controller = loader.getController();
            controller.setCliente(clienteSelecionado); // Passa o cliente selecionado para a tela de edição

            // Use o Stage principal para trocar a cena
            NavegacaoTelas.mainStage.setScene(new Scene(root));
            NavegacaoTelas.mainStage.setTitle("Editar Cliente"); // Opcional: mudar o título da janela
            NavegacaoTelas.mainStage.show();
        } else {
            Alert alert = new Alert(Alert.AlertType.WARNING);
            alert.setTitle("Nenhuma Seleção");
            alert.setHeaderText("Nenhum cliente selecionado");
            alert.setContentText("Por favor, selecione um cliente na tabela para editar.");
            alert.showAndWait();
        }
    }
        }












