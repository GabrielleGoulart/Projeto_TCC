package com.projeto_ordemservico.projeto_ordemservico;

import Model.Cadastro_Aparelhos;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import java.io.IOException;
import java.sql.*;

public class EditarAparelhosController {

    @FXML private TextField tfNomeAparelho;
    @FXML private TextField tfDefeito;
    @FXML private TextField tfServicoExecutado;
    @FXML private TextField tfPecasAplicadas;
    @FXML private TextField tfData; // Considere renomear para tfNomeTecnico se for esse o uso
    @FXML private TextField tfObservacoes;
    @FXML private TextField tfValorTotal;
    @FXML private Button BtSalvar;
    @FXML private Button BtVoltar;

    private Cadastro_Aparelhos aparelho;

    public void setAparelho(Cadastro_Aparelhos aparelho) {
        this.aparelho = aparelho;
        tfNomeAparelho.setText(aparelho.getNome_aparelho());
        tfDefeito.setText(aparelho.getDefeito());
        tfServicoExecutado.setText(aparelho.getServico_executados());
        tfPecasAplicadas.setText(aparelho.getPecas_aplicadas()); // agora como String
        tfData.setText(aparelho.getNome_tecnico()); // verifique se é realmente o nome do técnico
        tfObservacoes.setText(aparelho.getObservacoes());
        tfValorTotal.setText(String.valueOf(aparelho.getValor_total()));
    }

    @FXML
    protected void salvarEdicao() {
        final String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
        final String USER = "root";
        final String PASSWORD = "";

        String sql = "UPDATE Cadastro_Aparelhos SET nome_aparelho=?, defeito=?, servico_executados=?, pecas_aplicadas=?, nome_tecnico=?, observacoes=?, valor_total=? WHERE id_aparelho=?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            if (tfNomeAparelho.getText().isEmpty() || tfValorTotal.getText().isEmpty()) {
                showAlert(Alert.AlertType.WARNING, "Campos obrigatórios", "Preencha ao menos o nome do aparelho e o valor.");
                return;
            }

            stmt.setString(1, tfNomeAparelho.getText());
            stmt.setString(2, tfDefeito.getText());
            stmt.setString(3, tfServicoExecutado.getText());
            stmt.setString(4, tfPecasAplicadas.getText()); // ✅ corrigido: String
            stmt.setString(5, tfData.getText()); // Se for nome do técnico, renomeie a variável para clareza
            stmt.setString(6, tfObservacoes.getText());

            try {
                stmt.setDouble(7, Double.parseDouble(tfValorTotal.getText()));
            } catch (NumberFormatException e) {
                showAlert(Alert.AlertType.ERROR, "Erro de formato", "Valor total deve ser um número válido (ex: 150.00).");
                return;
            }

            stmt.setInt(8, aparelho.getId_aparelho());

            stmt.executeUpdate();

            showAlert(Alert.AlertType.INFORMATION, "Sucesso", "Aparelho atualizado com sucesso!");
            VoltarParaTelaAnterior();

        } catch (SQLException | IOException e) {
            showAlert(Alert.AlertType.ERROR, "Erro ao salvar", "Erro ao salvar edição: " + e.getMessage());
        }
    }

    @FXML
    protected void VoltarParaTelaAnterior() throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("Aparelhos.fxml"));
        Parent root = loader.load();
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();
    }

    private void showAlert(Alert.AlertType type, String title, String message) {
        Alert alert = new Alert(type);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}