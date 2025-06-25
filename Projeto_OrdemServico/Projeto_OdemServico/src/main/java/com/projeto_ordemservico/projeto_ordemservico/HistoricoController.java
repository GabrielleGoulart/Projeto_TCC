package com.projeto_ordemservico.projeto_ordemservico;

import Model.Historico;
import com.itextpdf.text.*;

import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;

import java.util.Date;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.*;
import java.text.SimpleDateFormat;

public class HistoricoController {

    @FXML private TableView TbHistorico;
    @FXML private Button BtVoltar;
    @FXML private Button BtPDF;

    @FXML private TableView<Historico> TabelaHistorico;

    @FXML private TableColumn<Historico, Integer> id_historico;
    @FXML private TableColumn<Historico, String> nome_cliente;
    @FXML private TableColumn<Historico, String> nome_aparelho;
    @FXML private TableColumn<Historico, Date> data_entrada;
    @FXML private TableColumn<Historico, Date> data_saida;
    @FXML private TableColumn<Historico, String> status_servico;
    @FXML private TableColumn<Historico, String> observacoes;
    private ObservableList<Historico> listaHistorico;

    @FXML
    public void initialize() {
        id_historico.setCellValueFactory(new PropertyValueFactory<>("id_historico"));
        nome_cliente.setCellValueFactory(new PropertyValueFactory<>("nome_cliente"));
        nome_aparelho.setCellValueFactory(new PropertyValueFactory<>("nome_aparelho"));
        data_entrada.setCellValueFactory(new PropertyValueFactory<>("data_entrada"));
        data_saida.setCellValueFactory(new PropertyValueFactory<>("data_saida"));
        status_servico.setCellValueFactory(new PropertyValueFactory<>("status_servico"));
        observacoes.setCellValueFactory(new PropertyValueFactory<>("observacoes"));

        loadFromDatabase();
    }

    private void loadFromDatabase() {
        ObservableList<Historico> historicoList = FXCollections.observableArrayList();

        String query = """
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
""";

        String URL = "jdbc:mysql://localhost:3306/Projeto_OSladyService";
        String USUARIO = "root";
        String SENHA = "";

        try (Connection conn = DriverManager.getConnection(URL, USUARIO, SENHA);
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Historico h = new Historico(
                        rs.getInt("id_historico"),
                        rs.getString("nome_cliente"),
                        rs.getString("nome_aparelho"),
                        rs.getDate("data_entrada"),
                        rs.getDate("data_saida"),
                        rs.getString("status_servico"),
                        rs.getString("observacoes"),
                        rs.getString("nome_tecnico"),
                        rs.getString("pecas_aplicadas"),
                        rs.getString("servico_executado"),
                        rs.getString("defeito"),
                        rs.getDouble("valor_total")
                );
                historicoList.add(h);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        TabelaHistorico.setItems(historicoList);
    }

    // Metodo para voltar à tela anterior
    @FXML
    protected void VoltarParaTelaAnterior() throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("PagInicial.fxml"));
        Parent root = loader.load();

        // Troca a cena na mesma janela
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();
    }

    @FXML
    private void gerarPDF() {
        Historico selecionado = TabelaHistorico.getSelectionModel().getSelectedItem();

        if (selecionado == null) {
            Alert alert = new Alert(Alert.AlertType.WARNING);
            alert.setTitle("Nenhuma seleção");
            alert.setHeaderText(null);
            alert.setContentText("Por favor, selecione um item da tabela para gerar o PDF.");
            alert.showAndWait();
            return;
        }

        String userHome = System.getProperty("user.home");
        String filePath = userHome + "/Downloads/Relatorio_Historico_" + selecionado.getId_historico() + ".pdf";

        try {
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();

            // Fontes
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            Font bodyFont = new Font(Font.FontFamily.HELVETICA, 12);
            Font rodapeFont = new Font(Font.FontFamily.HELVETICA, 10);

            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            // Título
            Paragraph title = new Paragraph("Relatório de Histórico de Serviço - OS Lady Service", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Tabela de dados
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);
            table.setWidths(new float[]{2f, 5f});

            // Campos existentes
            addTableRow(table, "ID Histórico:", String.valueOf(selecionado.getId_historico()), headerFont, bodyFont);
            addTableRow(table, "Nome Cliente:", selecionado.getNome_cliente(), headerFont, bodyFont);
            addTableRow(table, "Nome Aparelho:", selecionado.getNome_aparelho(), headerFont, bodyFont);
            addTableRow(table, "Data Entrada:", selecionado.getData_entrada() != null ? sdf.format(selecionado.getData_entrada()) : "N/A", headerFont, bodyFont);
            addTableRow(table, "Data Saída:", selecionado.getData_saida() != null ? sdf.format(selecionado.getData_saida()) : "N/A", headerFont, bodyFont);
            addTableRow(table, "Status Serviço:", selecionado.getStatus_servico(), headerFont, bodyFont);
            addTableRow(table, "Observações:", selecionado.getObservacoes(), headerFont, bodyFont);

            // Novos campos
            addTableRow(table, "Nome Técnico:", selecionado.getNome_tecnico(), headerFont, bodyFont);
            addTableRow(table, "Peças Aplicadas:", selecionado.getPecas_aplicadas(), headerFont, bodyFont);
            addTableRow(table, "Serviço Executado:", selecionado.getServico_executado(), headerFont, bodyFont);
            addTableRow(table, "Defeito:", selecionado.getDefeito(), headerFont, bodyFont);
            addTableRow(table, "Valor Total:", selecionado.getValor_total() != null ? String.format("%.2f", selecionado.getValor_total()) : "N/A", headerFont, bodyFont);

            // Adicionando a tabela ao documento
            document.add(table);

            // Espaço antes do rodapé
            document.add(new Paragraph("\n\n\n"));

            // Rodapé com data e assinatura
            Paragraph rodape = new Paragraph("Emitido em: " + sdf.format(new Date()), rodapeFont);
            rodape.setAlignment(Element.ALIGN_RIGHT);
            document.add(rodape);

            document.add(new Paragraph("\n\n"));

            Paragraph assinatura = new Paragraph("Assinatura do Responsável: __________________________", rodapeFont);
            assinatura.setAlignment(Element.ALIGN_LEFT);
            document.add(assinatura);

            document.close();

            Alert sucesso = new Alert(Alert.AlertType.INFORMATION);
            sucesso.setTitle("PDF Gerado");
            sucesso.setHeaderText(null);
            sucesso.setContentText("Relatório salvo em: " + filePath);
            sucesso.showAndWait();

        } catch (Exception e) {
            Alert erro = new Alert(Alert.AlertType.ERROR);
            erro.setTitle("Erro ao gerar PDF");
            erro.setHeaderText(null);
            erro.setContentText("Erro: " + e.getMessage());
            erro.showAndWait();
            e.printStackTrace();
        }
    }

    // Metodo auxiliar para adicionar linha formatada à tabela
    private void addTableRow(PdfPTable table, String campo, String valor, Font campoFont, Font valorFont) {
        PdfPCell cell1 = new PdfPCell(new Phrase(campo, campoFont));
        PdfPCell cell2 = new PdfPCell(new Phrase(valor, valorFont));

        cell1.setBorderColor(BaseColor.LIGHT_GRAY);
        cell2.setBorderColor(BaseColor.LIGHT_GRAY);
        cell1.setPadding(8);
        cell2.setPadding(8);

        table.addCell(cell1);
        table.addCell(cell2);
    }
}
