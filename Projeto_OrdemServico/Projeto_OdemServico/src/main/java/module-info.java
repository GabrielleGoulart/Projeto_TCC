module com.projeto_ordemservico.projeto_ordemservico {
    requires javafx.controls;
    requires javafx.fxml;

    requires org.controlsfx.controls;
    requires org.kordamp.bootstrapfx.core;
    requires java.sql;
    requires java.desktop;
    requires itextpdf;
    requires org.apache.commons.io;

    opens com.projeto_ordemservico.projeto_ordemservico to javafx.fxml;
    exports com.projeto_ordemservico.projeto_ordemservico;
    exports DAO;
    opens DAO to javafx.fxml;
    exports Model;
    opens Model to javafx.fxml;
}