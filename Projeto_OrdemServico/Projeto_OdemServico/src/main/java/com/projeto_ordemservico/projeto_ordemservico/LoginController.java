package com.projeto_ordemservico.projeto_ordemservico;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.control.Alert;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class LoginController implements Initializable {

    @FXML
    private Button btEntrar;
    @FXML
    private TextField txCNPJ;
    @FXML
    private PasswordField PwSenha;

    // Configura o botão "Enter" no campo de senha para chamar o metodo Acesso()
    @Override
    public void initialize(URL location, ResourceBundle resources) {
        PwSenha.setOnAction(event -> Acesso());
    }

    @FXML
    protected void Acesso() {
        String cnpj = txCNPJ.getText();
        String senha = PwSenha.getText();
//12.345.678/0001-12
        if (cnpj.equals("aa") && senha.equals("1234")) {
            try {
                // Carrega o FXML da próxima tela
                FXMLLoader loader = new FXMLLoader(getClass().getResource("PagInicial.fxml"));
                Parent root = loader.load();

                // Pega a janela atual e troca a cena
                Stage stage = (Stage) btEntrar.getScene().getWindow();
                Scene scene = new Scene(root);
                stage.setScene(scene);
                stage.show();
            } catch (IOException e) {
                e.printStackTrace();
                Alert msg = new Alert(Alert.AlertType.ERROR);
                msg.setTitle("Erro");
                msg.setHeaderText("Erro ao carregar a próxima tela");
                msg.setContentText(e.getMessage());
                msg.showAndWait();
            }
        } else {
            Alert msg = new Alert(Alert.AlertType.ERROR);
            msg.setTitle("Erro");
            msg.setHeaderText("Usuário ou senha incorretos");
            msg.setContentText("Tente novamente");
            msg.showAndWait();
        }

        txCNPJ.setText("");
        PwSenha.setText("");
    }
}