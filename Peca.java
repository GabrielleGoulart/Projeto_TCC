package Model;

public class Peca{
    private Integer id_peca;
    private String nome;
    private String descricao;
    private Double preco_unitario;
    private Integer quantidade_estoque;
    private Integer estoque_minimo;

public Peca(Integer id_peca, String nome, String descricao, Double preco_unitario,Integer quantidade_estoque, Integer estoque_minimo){
   this.id_peca = id_peca;
   this.nome = nome;
   this.descricao = descricao;
   this.preco_unitario = preco_unitario;
   this.quantidade_estoque = quantidade_estoque;
   this.estoque_minimo = estoque_minimo;
}

// Getters
    public Integer getid_peca() {
        return id_peca;
    }

    public String getnome() {
        return nome;
    }

    public String getdescricao() {
        return descricao;
    }

    public Double getpreco_unitario() {
        return preco_unitario;
    }

    public Integer getquantidade_estoque() {
        return quantidade_estoque;
    }

    public Integer getestoque_minimo() {
        return estoque_minimo;
    }

    // Setters
    public void setid_peca(Integer id_peca) {
        this.id_peca = id_peca;
    }

    public void setnome(String nome) {
        this.nome = nome;
    }

    public void setdescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setpreco_unitario(Double preco_unitario) {
        this.preco_unitario = preco_unitario;
    }

    public void setquantidade_estoque(Integer quantidade_estoque) {
        this.quantidade_estoque = quantidade_estoque;
    }

    public void setestoque_minimo(Integer estoque_minimo) {
        this.estoque_minimo = estoque_minimo;
    }
}
