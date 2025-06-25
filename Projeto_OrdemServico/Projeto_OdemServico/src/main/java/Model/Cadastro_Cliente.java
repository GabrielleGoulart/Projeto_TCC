package Model;

public class Cadastro_Cliente {
    private Integer id_cliente;
    private String nome_cliente;
    private String cpf;
    private String cnpj;
    private String endereco;
    private Integer cep;
    private String email;
    private String telefone;

    public Cadastro_Cliente(Integer id_cliente, String nome_cliente, String cpf, String cnpj, String endereco, Integer cep, String email, String telefone) {
        this.id_cliente = id_cliente;
        this.nome_cliente = nome_cliente;
        this.cpf = cpf;
        this.cnpj = cnpj;
        this.endereco = endereco;
        this.cep = cep;
        this.email = email;
        this.telefone = telefone;
    }

    public Integer getId_cliente() {
        return id_cliente;
    }

    public void setId_cliente(Integer id_cliente) {
        this.id_cliente = id_cliente;
    }

    public String getNome_cliente() {
        return nome_cliente;
    }

    public void setNome_cliente(String nome_cliente) {
        this.nome_cliente = nome_cliente;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public Integer getCep() {
        return cep;
    }

    public void setCep(Integer cep) {
        this.cep = cep;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}
