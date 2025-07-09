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
import java.time.LocalDate; 
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class CadastroController {

    @FXML private TextField TXData;
    @FXML private TextField TxCEP_Cliente;
    @FXML private TextField TxCPF_Cliente;
    @FXML private TextField TxCNPJ_Cliente;
    @FXML private TextField TxDefeito_Aparelho;
    @FXML private TextField TxEmailCliente;
    @FXML private TextField TxEndereçoCliente;
    @FXML private TextField TxModelo_Aparelho;
    @FXML private TextField TxNomeCliente;
    @FXML private TextField TxNomedoTecnco;
    @FXML private TextField TxObservacao_Aparelho;
    @FXML private TextField TxPecas_Aparelho;
    @FXML private TextField TxServicoExecutado;
    @FXML private TextField TxTelefoneCliente;
    @FXML private TextField TxValor;

    @FXML private TextField TxBuscaCliente;
    @FXML private Button BtBuscarCliente;

    @FXML private Button BtVoltar;
    @FXML private Button btCadastrar;

    // Variável para armazenar o ID do cliente, se encontrado
    private int clienteExistenteId = -1;

    private final String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
    private final String USUARIO = "root";
    private final String SENHA = "";

    @FXML
    public void initialize() {
        TxCPF_Cliente.textProperty().addListener((observable, oldValue, newValue) -> {
            if (!newValue.matches("\\d*")) {
                TxCPF_Cliente.setText(oldValue);
            }
        });
        TxCNPJ_Cliente.textProperty().addListener((observable, oldValue, newValue) -> {
            if (!newValue.matches("\\d*")) {
                TxCNPJ_Cliente.setText(oldValue);
            }
        });
        TxCEP_Cliente.textProperty().addListener((observable, oldValue, newValue) -> {
            if (!newValue.matches("\\d*")) {
                TxCEP_Cliente.setText(oldValue);
            }
        });
        TxTelefoneCliente.textProperty().addListener((observable, oldValue, newValue) -> {
            if (!newValue.matches("\\d*")) {
                TxTelefoneCliente.setText(oldValue);
            }
        });
        TxValor.textProperty().addListener((observable, oldValue, newValue) -> {
            if (!newValue.matches("\\d*([\\.]\\d*)?")) {
                TxValor.setText(oldValue);
            }
        });
    }
    @FXML
    protected void buscarCliente() {
        String busca = TxBuscaCliente.getText().trim();
        if (busca.isEmpty()) {
            showAlert(AlertType.WARNING, "Busca", "Por favor, digite um CPF ou CNPJ para buscar.");
            return;
        }
        String queryCliente = "SELECT id_cliente, nome_cliente, cpf, cnpj, endereco, cep, email, telefone FROM Cadastro_Cliente WHERE cpf = ? OR cnpj = ?";

//Parte do códgio que faz busca do cliente se ja possui cadastro ou não --
        try (Connection conexao = DriverManager.getConnection(URL, USUARIO, SENHA);
             PreparedStatement pstmt = conexao.prepareStatement(queryCliente)) {

            pstmt.setString(1, busca);
            pstmt.setString(2, busca);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    clienteExistenteId = rs.getInt("id_cliente");
                    TxNomeCliente.setText(rs.getString("nome_cliente"));
                    TxCPF_Cliente.setText(rs.getString("cpf"));
                    TxCNPJ_Cliente.setText(rs.getString("cnpj"));
                    TxEndereçoCliente.setText(rs.getString("endereco"));
                    TxCEP_Cliente.setText(rs.getString("cep"));
                    TxEmailCliente.setText(rs.getString("email"));
                    TxTelefoneCliente.setText(rs.getString("telefone"));

                    setCamposClienteDisabled(true);
                    showAlert(AlertType.INFORMATION, "Busca", "Cliente encontrado. Você pode agora cadastrar um novo aparelho para ele.");
                    limparCamposAparelho(); 
                } else {
                    clienteExistenteId = -1; 
                    showAlert(AlertType.INFORMATION, "Busca", "Cliente não encontrado. Por favor, preencha todos os dados para um novo cadastro.");
                    limparCamposCliente(); 
                    limparCamposAparelho();
                    setCamposClienteDisabled(false);
                }
            }
        } catch (SQLException e) {
            showAlert(AlertType.ERROR, "Erro de Busca", "Erro ao buscar cliente: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void setCamposClienteDisabled(boolean disabled) {
        TxNomeCliente.setDisable(disabled);
        TxCPF_Cliente.setDisable(disabled);
        TxCNPJ_Cliente.setDisable(disabled);
        TxEndereçoCliente.setDisable(disabled);
        TxCEP_Cliente.setDisable(disabled);
        TxEmailCliente.setDisable(disabled);
        TxTelefoneCliente.setDisable(disabled);
    }

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

        if (clienteExistenteId == -1) {
            if (!validarDadosCliente(nomeCliente, cpfCliente, cnpjCliente, emailCliente, telefoneCliente, enderecoCliente, cepCliente)) {
                return; 
            }
        }
        if (!validarDadosAparelho(modeloAparelho, defeitoAparelho, nomeTecnico, data, valorText)) {
            return; 
        }
        try (Connection conexao = DriverManager.getConnection(URL, USUARIO, SENHA)) {
            int idClienteParaUso = clienteExistenteId;
            if (idClienteParaUso == -1) {
                String sqlCliente = "INSERT INTO Cadastro_Cliente (nome_cliente, cpf, cnpj, endereco, cep, email, telefone) VALUES (?, ?, ?, ?, ?, ?, ?)";
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
                            idClienteParaUso = generatedKeys.getInt(1); 
                        }
                    } else {
                        showAlert(AlertType.ERROR, "Erro", "Não foi possível salvar os dados do novo cliente.");
                        return;
                    }
                }
            }

            String sqlAparelho = "INSERT INTO Cadastro_Aparelhos (id_cliente, nome_aparelho, defeito, servico_executados, pecas_aplicadas, nome_tecnico, data_cadastro, observacoes, valor_total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement pstmtAparelho = conexao.prepareStatement(sqlAparelho)) {
                pstmtAparelho.setInt(1, idClienteParaUso);
                pstmtAparelho.setString(2, modeloAparelho);
                pstmtAparelho.setString(3, defeitoAparelho);
                pstmtAparelho.setString(4, servicoExecutado);
                pstmtAparelho.setString(5, pecasAparelhoText);
                pstmtAparelho.setString(6, nomeTecnico);
                pstmtAparelho.setString(7, data); 
                pstmtAparelho.setString(8, observacaoAparelho);
                pstmtAparelho.setDouble(9, Double.parseDouble(valorText)); 
                pstmtAparelho.setString(10, "Em Análise");

                int linhasAfetadas = pstmtAparelho.executeUpdate();
                if (linhasAfetadas > 0) {
                    showAlert(AlertType.INFORMATION, "Sucesso", "Cadastro de aparelho realizado com sucesso!");
                    limparTodosOsCampos(); 
                    setCamposClienteDisabled(false);
                    clienteExistenteId = -1;
                } else {
                    showAlert(AlertType.ERROR, "Erro", "Erro ao cadastrar o aparelho.");
                }

            } catch (SQLException e) {
                showAlert(AlertType.ERROR, "Erro", "Erro ao salvar o aparelho: " + e.getMessage());
                e.printStackTrace();
            }

        } catch (SQLException e) {
            showAlert(AlertType.ERROR, "Erro", "Erro na conexão com o banco de dados: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private boolean validarDadosCliente(String nomeCliente, String cpfCliente, String cnpjCliente, String emailCliente, String telefoneCliente, String enderecoCliente, String cepCliente) {
        if (nomeCliente == null || nomeCliente.trim().isEmpty()) {
            showAlert(AlertType.ERROR, "Erro de Validação", "O campo 'Nome do Cliente' é obrigatório!");
            return false;
        }
        if (enderecoCliente == null || enderecoCliente.trim().isEmpty()) {
            showAlert(AlertType.ERROR, "Erro de Validação", "O campo 'Endereço' é obrigatório!");
            return false;
        }
        if (cepCliente == null || cepCliente.trim().isEmpty()) {
            showAlert(AlertType.ERROR, "Erro de Validação", "O campo 'CEP' é obrigatório!");
            return false;
        }
    
        boolean cpfPreenchido = cpfCliente != null && !cpfCliente.trim().isEmpty();
        boolean cnpjPreenchido = cnpjCliente != null && !cnpjCliente.trim().isEmpty();

        if (!cpfPreenchido && !cnpjPreenchido) {
            showAlert(AlertType.ERROR, "Erro de Validação", "É obrigatório fornecer um 'CPF' ou 'CNPJ'.");
            return false;
        }

        if (cpfPreenchido) {
            if (cpfCliente.trim().length() != 11 || !cpfCliente.trim().matches("\\d+")) {
                showAlert(AlertType.ERROR, "Erro de Validação", "O 'CPF' deve conter exatamente 11 dígitos numéricos.");
                return false;
            }
            if (cnpjPreenchido) { // Não deve preencher ambos
                showAlert(AlertType.ERROR, "Erro de Validação", "Preencha apenas o 'CPF' OU o 'CNPJ', não ambos.");
                return false;
            }
        }

        if (cnpjPreenchido) {
            if (cnpjCliente.trim().length() != 14 || !cnpjCliente.trim().matches("\\d+")) {
                showAlert(AlertType.ERROR, "Erro de Validação", "O 'CNPJ' deve conter exatamente 14 dígitos numéricos.");
                return false;
            }
            if (cpfPreenchido) { // Não deve preencher ambos
                showAlert(AlertType.ERROR, "Erro de Validação", "Preencha apenas o 'CPF' OU o 'CNPJ', não ambos.");
                return false;
            }
        }

    
        if (emailCliente == null || !emailCliente.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
            showAlert(AlertType.ERROR, "Erro de Validação", "O 'Email' inserido não possui um formato válido.");
            return false;
        }


        if (telefoneCliente != null && !telefoneCliente.trim().isEmpty()) {
            if (!telefoneCliente.trim().matches("\\d{10,11}")) {
                showAlert(AlertType.WARNING, "Validação de Telefone", "O 'Telefone' inserido não parece ter um formato válido (apenas números, 10 ou 11 dígitos).");
            
            }
        }
        return true;
    }

    private boolean validarDadosAparelho(String modeloAparelho, String defeitoAparelho, String nomeTecnico, String data, String valorText) {
        if (modeloAparelho.trim().isEmpty()) {
            showAlert(AlertType.ERROR, "Erro de Validação", "O campo 'Modelo do Aparelho' é obrigatório.");
            return false;
        }
        if (defeitoAparelho.trim().isEmpty()) {
            showAlert(AlertType.ERROR, "Erro de Validação", "O campo 'Defeito do Aparelho' é obrigatório.");
            return false;
        }
        if (nomeTecnico.trim().isEmpty()) {
            showAlert(AlertType.ERROR, "Erro de Validação", "O campo 'Nome do Técnico' é obrigatório.");
            return false;
        }
        if (data.trim().isEmpty()) {
            showAlert(AlertType.ERROR, "Erro de Validação", "O campo 'Data' é obrigatório.");
            return false;
        }

        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate.parse(data, formatter);
        } catch (DateTimeParseException e) {
            showAlert(AlertType.ERROR, "Erro de Validação", "O campo 'Data' deve estar no formato DD/MM/AAAA.");
            return false;
        }

        if (valorText.trim().isEmpty()) {
             showAlert(AlertType.ERROR, "Erro de Validação", "O campo 'Valor Total' é obrigatório.");
             return false;
        }
        try {
            Double.parseDouble(valorText);
        } catch (NumberFormatException e) {
            showAlert(AlertType.ERROR, "Erro de Validação", "O 'Valor Total' deve ser um número válido.");
            return false;
        }
        return true;
    }


    private void showAlert (AlertType alertType, String title, String content){
        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(content);
        alert.showAndWait();
    }

    private void limparCamposCliente() {
        TxNomeCliente.setText("");
        TxCPF_Cliente.setText("");
        TxCNPJ_Cliente.setText("");
        TxEndereçoCliente.setText("");
        TxCEP_Cliente.setText("");
        TxEmailCliente.setText("");
        TxTelefoneCliente.setText("");
    }

    private void limparCamposAparelho() {
        TXData.setText("");
        TxDefeito_Aparelho.setText("");
        TxModelo_Aparelho.setText("");
        TxNomedoTecnco.setText("");
        TxObservacao_Aparelho.setText("");
        TxPecas_Aparelho.setText("");
        TxServicoExecutado.setText("");
        TxValor.setText("");
    }

    private void limparTodosOsCampos () {
        TxBuscaCliente.setText(""); // Limpa o campo de busca também
        limparCamposCliente();
        limparCamposAparelho();
    }

    @FXML
    protected void VoltarParaTelaAnterior () throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("PagInicial.fxml"));
        Parent root = loader.load();

        if (NavegacaoTelas.mainStage != null) {
            NavegacaoTelas.mainStage.setScene(new Scene(root));
            NavegacaoTelas.mainStage.show();
        } else {
            System.err.println("Erro: mainStage não foi inicializado em NavegacaoTelas.");
            // Pode adicionar um Alert aqui para o usuário se o stage não estiver disponível
        }
    }
}