package com.projeto_ordemservico.projeto_ordemservico;

import Model.Cadastro_Cliente;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;
import java.io.IOException;
import java.sql.*;

public class EditarClientesController {

    @FXML private TextField nomeField;
    @FXML private TextField cpfField;
    @FXML private TextField cnpjField;
    @FXML private TextField enderecoField;
    @FXML private TextField cepField;
    @FXML private TextField emailField;
    @FXML private TextField telefoneField;
    @FXML private Button BtSalvar;
    @FXML private Button BtVoltar;

    private Cadastro_Cliente cliente;

    public void setCliente(Cadastro_Cliente cliente) {
        this.cliente = cliente;
        nomeField.setText(cliente.getNome_cliente());
        cpfField.setText(cliente.getCpf());
        cnpjField.setText(cliente.getCnpj());
        enderecoField.setText(cliente.getEndereco());
        cepField.setText(String.valueOf(cliente.getCep()));
        emailField.setText(cliente.getEmail());
        telefoneField.setText(cliente.getTelefone());
    }

    @FXML
    private void salvarEdicoes() {
        final String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
        final String USER = "root";
        final String PASSWORD = "";

        String query = "UPDATE Cadastro_Cliente SET nome_cliente = ?, cpf = ?, cnpj = ?, endereco = ?, cep = ?, email = ?, telefone = ? WHERE id_cliente = ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, nomeField.getText());
            stmt.setString(2, cpfField.getText());
            stmt.setString(3, cnpjField.getText());
            stmt.setString(4, enderecoField.getText());
            stmt.setInt(5, Integer.parseInt(cepField.getText()));
            stmt.setString(6, emailField.getText());
            stmt.setString(7, telefoneField.getText());
            stmt.setInt(8, cliente.getId_cliente());

            stmt.executeUpdate();

            Alert sucesso = new Alert(Alert.AlertType.INFORMATION);
            sucesso.setTitle("Sucesso");
            sucesso.setHeaderText(null);
            sucesso.setContentText("Cliente atualizado com sucesso!");
            sucesso.showAndWait();

            // Redirecionar para a tela de clientes na mesma janela principal
            FXMLLoader loader = new FXMLLoader(getClass().getResource("Clientes.fxml"));
            Parent root = loader.load();
            NavegacaoTelas.mainStage.setScene(new Scene(root));
            NavegacaoTelas.mainStage.show();

        } catch (SQLException | NumberFormatException | IOException e) {
            Alert erro = new Alert(Alert.AlertType.ERROR);
            erro.setTitle("Erro ao atualizar");
            erro.setHeaderText("Erro ao atualizar o cliente.");
            erro.setContentText(e.getMessage());
            erro.showAndWait();
        }
    }

    @FXML
    protected void VoltarParaTelaAnterior() throws IOException {
        // Carregar a tela de Clientes na mesma janela principal
        FXMLLoader loader = new FXMLLoader(getClass().getResource("Clientes.fxml"));
        Parent root = loader.load();
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();
    }
}