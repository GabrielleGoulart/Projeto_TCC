package com.example.TaskUpAPI.TaskUpAPI.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.TaskUpAPI.TaskUpAPI.Model.PecaModel;
import com.example.TaskUpAPI.TaskUpAPI.Service.PecaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@CrossOrigin(origins = "*") 
@RestController
@RequestMapping("/api/peca")
public class PecaController {

  @Autowired
  private PecaService service;
  
  @GetMapping
  public List<PecaModel> listar() {
    return service.listar();
  }

  @PostMapping
  public PecaModel cadastrar(@RequestBody PecaModel peca) {
    return service.salvar(peca);
  }
  
  @GetMapping("/{id_peca}")
  public ResponseEntity<PecaModel> buscarPorId(@PathVariable Long id_peca) {
    return service.buscarPorId(id_peca)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id_peca}")
  public ResponseEntity<Void> deletarPorId(@PathVariable Long id_peca)
    {
        if (service.deletar(id_peca)) {
        return ResponseEntity.noContent().build();
        } else {
        return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/{id_peca}")
  public PecaModel atualizar(@PathVariable Long id_peca, @RequestBody PecaModel novaPeca) {
        novaPeca.setId(id_peca);
        return service.salvar(novaPeca);
    }

    @GetMapping("/buscar")
    public List<PecaModel> buscarPorNome(@RequestParam String nome) {
        return service.buscarPorNome(nome);
    }
}

  
  

