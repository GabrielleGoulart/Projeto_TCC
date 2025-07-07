package Model;

public class pecas_utilizadas{
    private Integer id_pecas_utilizadas;
    private Integer id_aparelho;
    private Integer id_peca;
    private Integer quantidade;

 public pecas_utilizadas(Integer id_pecas_utilizadas, Integer id_aparelho, Integer id_peca, Integer quantidade) {
        this.id_pecas_utilizadas = id_pecas_utilizadas;
        this.id_aparelho = id_aparelho;
        this.id_peca = id_peca;
        this.quantidade = quantidade;
    }


    // Getters
    public Integer getIdPecasUtilizadas() {
        return id_pecas_utilizadas;
    }

    public Integer getIdAparelho() {
        return id_aparelho;
    }

    public Integer getIdPeca() {
        return id_peca;
    }

    public Integer getQuantidade() {
        return quantidade;
    }


    // Setters
    public void setIdPecasUtilizadas(Integer id_pecas_utilizadas) {
        this.id_pecas_utilizadas = id_pecas_utilizadas;
    }

    public void setIdAparelho(Integer id_aparelho) {
        this.id_aparelho = id_aparelho;
    }

    public void setIdPeca(Integer id_peca) {
        this.id_peca = id_peca;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}
