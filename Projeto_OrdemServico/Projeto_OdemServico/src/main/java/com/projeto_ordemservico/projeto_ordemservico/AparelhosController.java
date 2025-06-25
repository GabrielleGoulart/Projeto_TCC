package com.projeto_ordemservico.projeto_ordemservico;

import Model.Cadastro_Aparelhos;
import Model.Historico;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.Button;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;

import javafx.stage.Stage;

import java.io.IOException;
import java.sql.*;
import java.time.LocalDateTime;

public class AparelhosController {
    @FXML private Button BtAtualizar_Aparelhos;
    @FXML private Button BtDeletar_Aparelhos;
    @FXML private Button BtEditar_Aparelhos;
    @FXML private Button BtStatus;
    @FXML private Button BtVoltar;

    @FXML private TableView<Cadastro_Aparelhos> TbAparelhos;
    @FXML private ComboBox<String> cbStatus;

    @FXML private TableColumn<Cadastro_Aparelhos, Integer> id_aparelho;
    @FXML private TableColumn<Cadastro_Aparelhos, Integer> id_cliente;
    @FXML private TableColumn<Cadastro_Aparelhos, String> nome_aparelho;
    @FXML private TableColumn<Cadastro_Aparelhos, String> defeito;
    @FXML private TableColumn<Cadastro_Aparelhos, String> servico_executados;
    @FXML private TableColumn<Cadastro_Aparelhos, Integer> pecas_aplicadas;
    @FXML private TableColumn<Cadastro_Aparelhos, String> nome_tecnico;
    @FXML private TableColumn<Cadastro_Aparelhos, LocalDateTime> data_cadastro;
    @FXML private TableColumn<Cadastro_Aparelhos, String> observacoes;
    @FXML private TableColumn<Cadastro_Aparelhos, Double> valor_total;
    @FXML private TableColumn<Cadastro_Aparelhos, String> status;


    private ObservableList<Cadastro_Aparelhos> listaAparelhos;

    @FXML
    public void initialize() {
        id_aparelho.setCellValueFactory(new PropertyValueFactory<>("id_aparelho"));
        id_cliente.setCellValueFactory(new PropertyValueFactory<>("id_cliente"));
        nome_aparelho.setCellValueFactory(new PropertyValueFactory<>("nome_aparelho"));
        defeito.setCellValueFactory(new PropertyValueFactory<>("defeito"));
        servico_executados.setCellValueFactory(new PropertyValueFactory<>("servico_executados"));
        pecas_aplicadas.setCellValueFactory(new PropertyValueFactory<>("pecas_aplicadas"));
        nome_tecnico.setCellValueFactory(new PropertyValueFactory<>("nome_tecnico"));
        data_cadastro.setCellValueFactory(new PropertyValueFactory<>("data_cadastro"));
        observacoes.setCellValueFactory(new PropertyValueFactory<>("observacoes"));
        valor_total.setCellValueFactory(new PropertyValueFactory<>("valor_total"));
        status.setCellValueFactory(new PropertyValueFactory<>("status"));


        cbStatus.getItems().addAll("Em Análise", "Em Andamento", "Finalizado");
        cbStatus.setVisible(false);


        cbStatus.setItems(FXCollections.observableArrayList("Em Análise", "Em Andamento", "Finalizado"));
        cbStatus.setValue("Em Análise");

        TbAparelhos.getSelectionModel().selectedItemProperty().addListener((obs, oldSel, newSel) -> {
            if (newSel != null) {
                cbStatus.setValue(newSel.getStatus());

            }

        });

        loadFromDatabase();
    }


    @FXML
    protected void VoltarParaTelaAnterior() throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("PagInicial.fxml"));
        Parent root = loader.load();
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();
    }

    private void loadFromDatabase() {
        listaAparelhos = FXCollections.observableArrayList();
        final String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
        final String USER = "root";
        final String PASSWORD = "";

        String query = "SELECT * FROM Cadastro_Aparelhos";

        try (
                Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
                PreparedStatement stmt = conn.prepareStatement(query);
                ResultSet rs = stmt.executeQuery()
        ) {
            while (rs.next()) {
                Cadastro_Aparelhos aparelho = new Cadastro_Aparelhos(
                        rs.getInt("id_aparelho"),
                        rs.getInt("id_cliente"),
                        rs.getString("nome_aparelho"),
                        rs.getString("defeito"),
                        rs.getString("servico_executados"),
                        rs.getString("pecas_aplicadas"),
                        rs.getString("nome_tecnico"),
                        rs.getTimestamp("data_cadastro").toLocalDateTime(),
                        rs.getString("observacoes"),
                        rs.getDouble("valor_total"),
                        rs.getString("status")
                );
                listaAparelhos.add(aparelho);
            }

            TbAparelhos.setItems(listaAparelhos);

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @FXML
    protected void deletarAparelhoSelecionado() {
        Cadastro_Aparelhos selecionado = TbAparelhos.getSelectionModel().getSelectedItem();

        if (selecionado != null) {
            // Alerta de confirmação
            Alert alerta = new Alert(Alert.AlertType.CONFIRMATION);
            alerta.setTitle("Confirmação de Exclusão");
            alerta.setHeaderText("Você tem certeza que deseja excluir este aparelho?");
            alerta.setContentText("ID: " + selecionado.getId_aparelho() + "\nNome: " + selecionado.getNome_aparelho());

            // Espera o usuário confirmar
            alerta.showAndWait().ifPresent(resposta -> {
                if (resposta == ButtonType.OK) {
                    final String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
                    final String USER = "root";
                    final String PASSWORD = "";

                    // Primeiro, exclui o histórico relacionado ao aparelho
                    String deleteHistoricoSql = "DELETE FROM Historico WHERE id_aparelho = ?";
                    try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
                         PreparedStatement stmtHistorico = conn.prepareStatement(deleteHistoricoSql)) {
                        stmtHistorico.setInt(1, selecionado.getId_aparelho());
                        stmtHistorico.executeUpdate();
                    } catch (SQLException e) {
                        mostrarErro("Erro ao deletar histórico: " + e.getMessage());
                        return; // Se falhar ao deletar o histórico, não continue com a exclusão do aparelho.
                    }

                    // Agora, exclui o aparelho
                    String deleteAparelhoSql = "DELETE FROM Cadastro_Aparelhos WHERE id_aparelho = ?";
                    try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
                         PreparedStatement stmtAparelho = conn.prepareStatement(deleteAparelhoSql)) {
                        stmtAparelho.setInt(1, selecionado.getId_aparelho());
                        int afetados = stmtAparelho.executeUpdate();

                        if (afetados > 0) {
                            listaAparelhos.remove(selecionado);
                            TbAparelhos.refresh();

                            Alert sucesso = new Alert(Alert.AlertType.INFORMATION);
                            sucesso.setTitle("Sucesso");
                            sucesso.setHeaderText(null);
                            sucesso.setContentText("Aparelho deletado com sucesso.");
                            sucesso.showAndWait();
                        } else {
                            mostrarErro("Nenhum registro foi deletado.");
                        }
                    } catch (SQLException e) {
                        mostrarErro("Erro ao deletar do banco: " + e.getMessage());
                    }
                }
            });
        } else {
            mostrarErro("Selecione um aparelho na tabela para deletar.");
        }
    }


    @FXML
    protected void atualizarTabelaAparelhos() {
        Cadastro_Aparelhos selecionado = TbAparelhos.getSelectionModel().getSelectedItem();

        if (selecionado != null) {
            // Verificar se o ComboBox está visível (ou seja, se o status foi alterado)
            if (cbStatus.isVisible()) {
                String novoStatus = cbStatus.getValue();

                // Atualizar o status apenas se for diferente
                if (novoStatus != null && !novoStatus.equals(selecionado.getStatus())) {
                    selecionado.setStatus(novoStatus);  // Atualiza o status no objeto

                    final String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
                    final String USER = "root";
                    final String PASSWORD = "";

                    // SQL para atualizar o status no banco
                    String sql = "UPDATE Cadastro_Aparelhos SET status = ? WHERE id_aparelho = ?";

                    try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
                         PreparedStatement stmt = conn.prepareStatement(sql)) {

                        stmt.setString(1, novoStatus);
                        stmt.setInt(2, selecionado.getId_aparelho());
                        stmt.executeUpdate();

                        // Se o status for "Finalizado", salva no histórico
                        if ("Finalizado".equalsIgnoreCase(novoStatus)) {
                            salvarHistorico(selecionado);
                        }

                    } catch (SQLException e) {
                        e.printStackTrace();
                        mostrarErro("Erro ao atualizar status no banco: " + e.getMessage());
                    }

                    // Mensagem informando sucesso na atualização do status
                    Alert alerta = new Alert(Alert.AlertType.INFORMATION);
                    alerta.setTitle("Status Atualizado");
                    alerta.setHeaderText(null);
                    alerta.setContentText("Status alterado para: " + novoStatus);
                    alerta.showAndWait();
                }

                // Ocultar o ComboBox após a atualização do status
                cbStatus.setVisible(false);
            }
        }

        // Recarregar a tabela após atualizar
        loadFromDatabase();

        // Mensagem de sucesso para a atualização da tabela
        Alert alerta = new Alert(Alert.AlertType.INFORMATION);
        alerta.setTitle("Tabela Atualizada");
        alerta.setHeaderText(null);
        alerta.setContentText("A tabela foi atualizada com os dados mais recentes.");
        alerta.showAndWait();
    }



    @FXML
    protected void editarAparelhoSelecionado() {
        Cadastro_Aparelhos selecionado = TbAparelhos.getSelectionModel().getSelectedItem();

        if (selecionado != null) {
            try {
                FXMLLoader loader = new FXMLLoader(getClass().getResource("EditarAparelhos.fxml"));
                Parent root = loader.load();

                EditarAparelhosController controller = loader.getController();
                controller.setAparelho(selecionado);

                // Substitui a cena na janela principal
                NavegacaoTelas.mainStage.setScene(new Scene(root));
                NavegacaoTelas.mainStage.show();

            } catch (IOException e) {
                mostrarErro("Erro ao abrir tela de edição: " + e.getMessage());
            }
        } else {
            mostrarErro("Selecione um aparelho para editar.");
        }
    }

    @FXML
    protected void atualizarStatus() {
        Cadastro_Aparelhos selecionado = TbAparelhos.getSelectionModel().getSelectedItem();

        if (selecionado == null) {
            mostrarErro("Selecione um aparelho para alterar o status.");
            return;
        }

        // Se o ComboBox não está visível, exibe-o
        if (!cbStatus.isVisible()) {
            cbStatus.setVisible(true);
            cbStatus.getItems().setAll("Em Análise", "Em Andamento", "Finalizado");
            cbStatus.setValue(selecionado.getStatus()); // Pré-seleciona o status atual
            cbStatus.requestFocus();
        } else {
            // Se o ComboBox está visível, faz a atualização
            String novoStatus = cbStatus.getValue();

            if (novoStatus != null && !novoStatus.equals(selecionado.getStatus())) {
                final String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
                final String USER = "root";
                final String PASSWORD = "";

                String sql = "UPDATE Cadastro_Aparelhos SET status = ? WHERE id_aparelho = ?";

                try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
                     PreparedStatement stmt = conn.prepareStatement(sql)) {

                    stmt.setString(1, novoStatus);
                    stmt.setInt(2, selecionado.getId_aparelho());
                    stmt.executeUpdate();

                    // Se o status for "Finalizado", salva no histórico
                    if ("Finalizado".equalsIgnoreCase(novoStatus)) {
                        salvarHistorico(selecionado);
                    } else {
                        // Se o status não for "Finalizado", remove o histórico
                        removerHistorico(selecionado);
                    }

                    // Atualiza a tabela
                    loadFromDatabase();  // Atualiza a TableView com os novos dados

                    // Mensagem de sucesso
                    Alert alerta = new Alert(Alert.AlertType.INFORMATION);
                    alerta.setTitle("Status Atualizado");
                    alerta.setHeaderText(null);
                    alerta.setContentText("Status alterado com sucesso!");
                    alerta.showAndWait();

                } catch (SQLException e) {
                    mostrarErro("Erro ao atualizar status: " + e.getMessage());
                }

                // Após a atualização, o ComboBox desaparece
                cbStatus.setVisible(false);
            }
        }
    }

    private void removerHistorico(Cadastro_Aparelhos aparelho) {
        final String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
        final String USER = "root";
        final String PASSWORD = "";

        String sql = "DELETE FROM Historico WHERE id_aparelho = ?";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, aparelho.getId_aparelho());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    private void mostrarErro(String mensagem) {
        Alert erro = new Alert(Alert.AlertType.ERROR);
        erro.setTitle("Erro");
        erro.setHeaderText("Ocorreu um problema");
        erro.setContentText(mensagem);
        erro.showAndWait();
    }


    private void salvarHistorico(Cadastro_Aparelhos aparelho) {
        final String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
        final String USER = "root";
        final String PASSWORD = "";

        String sql = "INSERT INTO Historico (id_cliente, id_aparelho, data_entrada, status_servico, observacoes, data_saida, nome_tecnico, pecas_aplicadas, servico_executado, defeito, valor_total) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, aparelho.getId_cliente());
            stmt.setInt(2, aparelho.getId_aparelho());
            stmt.setTimestamp(3, Timestamp.valueOf(LocalDateTime.now())); // data_entrada
            stmt.setString(4, "Finalizado");
            stmt.setString(5, aparelho.getObservacoes());
            stmt.setTimestamp(6, Timestamp.valueOf(LocalDateTime.now())); // data_saida como agora
            stmt.setString(7, aparelho.getNome_tecnico()); // Ou o metodo correspondente
            stmt.setString(8, aparelho.getPecas_aplicadas());
            stmt.setString(9, aparelho.getServico_executados());
            stmt.setString(10,aparelho.getDefeito());
            stmt.setDouble(11,aparelho.getValor_total());
            stmt.executeUpdate();
    } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}