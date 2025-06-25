package com.projeto_ordemservico.projeto_ordemservico;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.control.*;
import javafx.scene.control.Alert.AlertType;

import java.sql.*;


import java.io.IOException;

public class CadastroController {

    @FXML
    private TextField TXData;
    @FXML
    private TextField TxCEP_Cliente;
    @FXML
    private TextField TxCPF_Cliente;
    @FXML
    private TextField TxCNPJ_Cliente;
    @FXML
    private TextField TxDefeito_Aparelho;
    @FXML
    private TextField TxEmailCliente;
    @FXML
    private TextField TxEndereçoCliente;
    @FXML
    private TextField TxModelo_Aparelho;
    @FXML
    private TextField TxNomeCliente;
    @FXML
    private TextField TxNomedoTecnco;
    @FXML
    private TextField TxObservacao_Aparelho;
    @FXML
    private TextField TxPecas_Aparelho;
    @FXML
    private TextField TxServicoExecutado;
    @FXML
    private TextField TxTelefoneCliente;
    @FXML
    private TextField TxValor;
    @FXML
    private Button BtVoltar;
    @FXML
    private Button btCadastrar;


    @FXML
    protected void SalvarCadastro() {
        String data = TXData.getText();
        String cepCliente = TxCEP_Cliente.getText();
        String cpfCliente = TxCPF_Cliente.getText();
        String cnpjCliente = TxCNPJ_Cliente.getText();
        String defeitoAparelho = TxDefeito_Aparelho.getText();
        String emailCliente = TxEmailCliente.getText();
        String enderecoCliente = TxEndereçoCliente.getText();
        String modeloAparelho = TxModelo_Aparelho.getText();
        String nomeCliente = TxNomeCliente.getText();
        String nomeTecnico = TxNomedoTecnco.getText();
        String observacaoAparelho = TxObservacao_Aparelho.getText();
        String pecasAparelhoText = TxPecas_Aparelho.getText();
        String servicoExecutado = TxServicoExecutado.getText();
        String telefoneCliente = TxTelefoneCliente.getText();
        String valorText = TxValor.getText();

        String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
        String USUARIO = "root";
        String SENHA = "";

        String sqlCliente = "INSERT INTO Cadastro_Cliente (nome_cliente, cpf, cnpj, endereco, cep, email, telefone) VALUES (?, ?, ?, ?, ?, ?, ?)";
        String sqlAparelho = "INSERT INTO Cadastro_Aparelhos (id_cliente, nome_aparelho, defeito, servico_executados, pecas_aplicadas, nome_tecnico, data_cadastro, observacoes, valor_total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conexao = DriverManager.getConnection(URL, USUARIO, SENHA)) {
            int idClienteInserido = -1;

            try (PreparedStatement pstmtCliente = conexao.prepareStatement(sqlCliente, Statement.RETURN_GENERATED_KEYS)) {
                pstmtCliente.setString(1, nomeCliente);
                pstmtCliente.setString(2, cpfCliente.isEmpty() ? null : cpfCliente);
                pstmtCliente.setString(3, cnpjCliente.isEmpty() ? null : cnpjCliente);
                pstmtCliente.setString(4, enderecoCliente);
                pstmtCliente.setString(5, cepCliente);
                pstmtCliente.setString(6, emailCliente);
                pstmtCliente.setString(7, telefoneCliente);

                int linhasAfetadas = pstmtCliente.executeUpdate();
                if (linhasAfetadas > 0) {
                    ResultSet generatedKeys = pstmtCliente.getGeneratedKeys();
                    if (generatedKeys.next()) {
                        idClienteInserido = generatedKeys.getInt(1);
                    }
                } else {
                    showAlert(AlertType.ERROR, "Erro", "Não foi possível salvar os dados do cliente.");
                    return;
                }
            }

            try (PreparedStatement pstmtAparelho = conexao.prepareStatement(sqlAparelho)) {
                pstmtAparelho.setInt(1, idClienteInserido);
                pstmtAparelho.setString(2, modeloAparelho);
                pstmtAparelho.setString(3, defeitoAparelho);
                pstmtAparelho.setString(4, servicoExecutado);

                pstmtAparelho.setString(5, pecasAparelhoText); // ✔ Correto, agora é String


                pstmtAparelho.setString(6, nomeTecnico);
                pstmtAparelho.setString(7, data);
                pstmtAparelho.setString(8, observacaoAparelho);

                try {
                    pstmtAparelho.setDouble(9, Double.parseDouble(valorText));
                } catch (NumberFormatException e) {
                    showAlert(AlertType.ERROR, "Erro", "Valor total deve ser um número.");
                    return;
                }

                pstmtAparelho.setString(10, "Em Análise");

                int linhasAfetadas = pstmtAparelho.executeUpdate();
                if (linhasAfetadas > 0) {
                    showAlert(AlertType.INFORMATION, "Sucesso", "Cadastro realizado com sucesso!");
                    limparCampos();
                } else {
                    showAlert(AlertType.ERROR, "Erro", "Erro ao cadastrar o aparelho.");
                }

            } catch (SQLException e) {
                showAlert(AlertType.ERROR, "Erro", "Erro ao salvar o aparelho: " + e.getMessage());
            }

        } catch (SQLException e) {
            showAlert(AlertType.ERROR, "Erro", "Erro na conexão com o banco: " + e.getMessage());
        }
    }

    private void showAlert(AlertType alertType, String title, String content) {
        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(content);
        alert.showAndWait();
    }

    private void limparCampos() {
        TXData.setText("");
        TxCEP_Cliente.setText("");
        TxCPF_Cliente.setText("");
        TxCNPJ_Cliente.setText("");
        TxDefeito_Aparelho.setText("");
        TxEmailCliente.setText("");
        TxEndereçoCliente.setText("");
        TxModelo_Aparelho.setText("");
        TxNomeCliente.setText("");
        TxNomedoTecnco.setText("");
        TxObservacao_Aparelho.setText("");
        TxPecas_Aparelho.setText("");
        TxServicoExecutado.setText("");
        TxTelefoneCliente.setText("");
        TxValor.setText("");
    }

    // Metodo para voltar à tela anterior

    @FXML
    protected void VoltarParaTelaAnterior() throws IOException {
        // Carrega o FXML da tela anterior (exemplo: PagInicial.fxml)
        FXMLLoader loader = new FXMLLoader(getClass().getResource("PagInicial.fxml"));
        Parent root = loader.load();

        // Troca a cena na mesma janela
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();
    }


}