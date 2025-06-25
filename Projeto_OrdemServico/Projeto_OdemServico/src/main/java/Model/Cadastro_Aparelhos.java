package Model;

import java.time.LocalDateTime; // Importe a classe LocalDateTime

public class Cadastro_Aparelhos {
    private Integer id_aparelho;
    private Integer id_cliente;
    private String nome_aparelho;
    private String defeito;
    private String servico_executados;
    private String pecas_aplicadas;
    private String nome_tecnico;
    private LocalDateTime data_cadastro; // Alterado para LocalDateTime
    private String observacoes;
    private Double valor_total;
    private String status;

    public Cadastro_Aparelhos(Integer id_aparelho, Integer id_cliente, String nome_aparelho, String defeito, String servico_executados, String pecas_aplicadas, String nome_tecnico, LocalDateTime data_cadastro, String observacoes, Double valor_total, String status) {
        this.id_aparelho = id_aparelho;
        this.id_cliente = id_cliente;
        this.nome_aparelho = nome_aparelho;
        this.defeito = defeito;
        this.servico_executados = servico_executados;
        this.pecas_aplicadas = pecas_aplicadas;
        this.nome_tecnico = nome_tecnico;
        this.data_cadastro = data_cadastro;
        this.observacoes = observacoes;
        this.valor_total = valor_total;
        this.status = status;
    }

    public Cadastro_Aparelhos(Integer id_aparelho, Integer id_cliente, String nome_aparelho, String defeito, String servico_executados, String pecas_aplicadas, String nome_tecnico, LocalDateTime data_cadastro, String observacoes, Double valor_total) {
        this(id_aparelho, id_cliente, nome_aparelho, defeito, servico_executados, pecas_aplicadas,
                nome_tecnico, data_cadastro, observacoes, valor_total, "Em Análise");
    }

    // Getters e setters atualizados para LocalDateTime
    public LocalDateTime getData_cadastro() {
        return data_cadastro;
    }

    public void setData_cadastro(LocalDateTime data_cadastro) {
        this.data_cadastro = data_cadastro;
    }

    // ... (mantenha os outros getters e setters) ...

    public Integer getId_aparelho() {
        return id_aparelho;
    }

    public void setId_aparelho(Integer id_aparelho) {
        this.id_aparelho = id_aparelho;
    }

    public Integer getId_cliente() {
        return id_cliente;
    }

    public void setId_cliente(Integer id_cliente) {
        this.id_cliente = id_cliente;
    }

    public String getNome_aparelho() {
        return nome_aparelho;
    }

    public void setNome_aparelho(String nome_aparelho) {
        this.nome_aparelho = nome_aparelho;
    }

    public String getDefeito() {
        return defeito;
    }

    public void setDefeito(String defeito) {
        this.defeito = defeito;
    }

    public String getServico_executados() {
        return servico_executados;
    }

    public void setServico_executados(String servico_executados) {
        this.servico_executados = servico_executados;
    }

    public String getPecas_aplicadas() {
        return pecas_aplicadas;
    }

    public void setPecas_aplicadas(String pecas_aplicadas) {
        this.pecas_aplicadas = pecas_aplicadas;
    }

    public String getNome_tecnico() {
        return nome_tecnico;
    }

    public void setNome_tecnico(String nome_tecnico) {
        this.nome_tecnico = nome_tecnico;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Double getValor_total() {
        return valor_total;
    }

    public void setValor_total(Double valor_total) {
        this.valor_total = valor_total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}