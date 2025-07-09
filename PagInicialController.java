package com.projeto_ordemservico.projeto_ordemservico;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.stage.Stage;

import java.io.IOException;

public class PagInicialController {

    @FXML private Button BtAparelhos;
    @FXML private Button BtCadastrar;
    @FXML private Button BtClientes;
    @FXML private Button BtHistorico;
    @FXML private Button BtVoltar;

    //Codigo para ir para tela cadastrar
    @FXML
    protected void AcessoCadastro () throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("Cadastro.fxml"));
        Parent root = loader.load();
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();

    }

    @FXML
    protected void AcessoAparelhos () throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("Aparelhos.fxml"));
        Parent root = loader.load();
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();

    }
    @FXML
    protected void AcessoClientes () throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("Clientes.fxml"));
        Parent root = loader.load();
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();

    }

    @FXML
    protected void AcessoHistorico () throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("Historico.fxml"));
        Parent root = loader.load();
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();

    }

     @FXML
    protected void AcessoEstoque () throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("Estoque.fxml"));
        Parent root = loader.load();
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();
    }

      @FXML
    protected void AcessoAgenda () throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("Agenda.fxml"));
        Parent root = loader.load();
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();
    }

    @FXML
    protected void VoltarParaTelaAnterior() throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("Login.fxml"));
        Parent root = loader.load();
        NavegacaoTelas.mainStage.setScene(new Scene(root));
        NavegacaoTelas.mainStage.show();
    }

}