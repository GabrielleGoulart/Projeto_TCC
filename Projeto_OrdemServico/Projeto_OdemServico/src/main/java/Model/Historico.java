package Model;

import java.util.Date;

public class Historico {
    private Integer id_historico;
    private String nome_cliente;
    private String nome_aparelho;
    private Date data_entrada;
    private Date data_saida;
    private String status_servico;
    private String observacoes;
    private String nome_tecnico;        // Novo campo
    private String pecas_aplicadas;     // Novo campo
    private String servico_executado;   // Novo campo
    private String defeito;             // Novo campo
    private Double valor_total;         // Novo campo

    public Historico(Integer id_historico, String nome_cliente, String nome_aparelho, Date data_entrada, Date data_saida, String status_servico, String observacoes, String nome_tecnico, String pecas_aplicadas, String servico_executado, String defeito, Double valor_total) {
        this.id_historico = id_historico;
        this.nome_cliente = nome_cliente;
        this.nome_aparelho = nome_aparelho;
        this.data_entrada = data_entrada;
        this.data_saida = data_saida;
        this.status_servico = status_servico;
        this.observacoes = observacoes;
        this.nome_tecnico = nome_tecnico;
        this.pecas_aplicadas = pecas_aplicadas;
        this.servico_executado = servico_executado;
        this.defeito = defeito;
        this.valor_total = valor_total;
    }

    // Getters e Setters para os novos campos
    public String getNome_tecnico() {
        return nome_tecnico;
    }

    public void setNome_tecnico(String nome_tecnico) {
        this.nome_tecnico = nome_tecnico;
    }

    public String getPecas_aplicadas() {
        return pecas_aplicadas;
    }

    public void setPecas_aplicadas(String pecas_aplicadas) {
        this.pecas_aplicadas = pecas_aplicadas;
    }

    public String getServico_executado() {
        return servico_executado;
    }

    public void setServico_executado(String servico_executado) {
        this.servico_executado = servico_executado;
    }

    public String getDefeito() {
        return defeito;
    }

    public void setDefeito(String defeito) {
        this.defeito = defeito;
    }

    public Double getValor_total() {
        return valor_total;
    }

    public void setValor_total(Double valor_total) {
        this.valor_total = valor_total;
    }

    // Restante dos getters e setters existentes
    public Integer getId_historico() {
        return id_historico;
    }

    public void setId_historico(Integer id_historico) {
        this.id_historico = id_historico;
    }

    public String getNome_cliente() {
        return nome_cliente;
    }

    public void setNome_cliente(String nome_cliente) {
        this.nome_cliente = nome_cliente;
    }

    public String getNome_aparelho() {
        return nome_aparelho;
    }

    public void setNome_aparelho(String nome_aparelho) {
        this.nome_aparelho = nome_aparelho;
    }

    public Date getData_entrada() {
        return data_entrada;
    }

    public void setData_entrada(Date data_entrada) {
        this.data_entrada = data_entrada;
    }

    public Date getData_saida() {
        return data_saida;
    }

    public void setData_saida(Date data_saida) {
        this.data_saida = data_saida;
    }

    public String getStatus_servico() {
        return status_servico;
    }

    public void setStatus_servico(String status_servico) {
        this.status_servico = status_servico;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}
