package com.projeto_ordemservico.projeto_ordemservico;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class EditarClientesApplication extends Application  {
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(LoginApplication.class.getResource("EditarClientes.fxml"));
        Scene scene = new Scene(fxmlLoader.load(), 1260, 709);
        stage.setTitle("OS Lady Service - EditarClientes");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch();

    }
}

