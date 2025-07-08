package Model;

public class Agenda{
    private Integer id_agenda;
    private Integer id_aparelho;
    private Datetime data_agendada;
    private String descricao;

    public Agenda(Integer id_agenda, Integer id_aparelho, Datetime data_agendada, String descricao){
        this.id_agenda = id_agenda;
        this.id_aparelho = id_aparelho;
        this.data_agendada = data_agendada;
        this.descricao = descricao;
    }

//Getters e Setters
    public Integer getId_agenda() {
        return id_agenda;
    }

    public void setId_agenda(Integer id_agenda) {
        this.id_agenda = id_agenda;
    }

    public Integer getId_aparelho() {
        return id_aparelho;
    }

    public void setId_aparelho(Integer id_aparelho) {
        this.id_aparelho = id_aparelho;
    }

    public Datetime getData_agendada() {
        return data_agendada;
    }

    public void setData_agendada(Datetime data_agendada) {
        this.data_agendada = data_agendada;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}