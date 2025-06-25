package com.projeto_ordemservico.projeto_ordemservico;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Button;
import javafx.scene.control.Alert; // Still useful for error messages
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import java.io.IOException;
import java.net.URL;
import java.util.ResourceBundle;

public class LoginController implements Initializable {

    @FXML
    private Button btEntrar; // The button to enter the application

    // The initialize method is still needed because of the Initializable interface
    @Override
    public void initialize(URL location, ResourceBundle resources) {
      
    }

    @FXML
    protected void Acesso() {
            try {
                // Carrega o FXML da próxima tela
                FXMLLoader loader = new FXMLLoader(getClass().getResource("PagInicial.fxml"));
                Parent root = loader.load();

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
    }
}