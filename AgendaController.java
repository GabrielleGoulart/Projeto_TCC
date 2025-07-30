package com.example.TaskUpAPI.TaskUpAPI.Controller;

import com.example.TaskUpAPI.TaskUpAPI.Model.AgendaModel;
import com.example.TaskUpAPI.TaskUpAPI.Model.AparelhoModel;
import com.example.TaskUpAPI.TaskUpAPI.Service.AgendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/agendas")
public class AgendaController {

    @Autowired
    private AgendaService agendaService;

    @GetMapping
    public ResponseEntity<List<AgendaModel>> listarAgendas() {
        List<AgendaModel> agendas = agendaService.listar();
        return ResponseEntity.ok(agendas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgendaModel> buscarAgendaPorId(@PathVariable Long id) {
        Optional<AgendaModel> agenda = agendaService.buscarPorId(id);
        return agenda.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AgendaModel> salvarAgenda(@RequestBody AgendaModel agenda) {
        AgendaModel savedAgenda = agendaService.salvar(agenda);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAgenda);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAgenda(@PathVariable Long id) {
        if (agendaService.deletar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // para buscar agendas por aparelho
    @PostMapping("/byAparelho")
    public ResponseEntity<List<AgendaModel>> buscarAgendasPorAparelho(@RequestBody AparelhoModel aparelho) {
        List<AgendaModel> agendas = agendaService.buscarPorAparelho(aparelho);
        if (agendas.isEmpty()) {
            return ResponseEntity.noContent().build(); 
        }
        return ResponseEntity.ok(agendas);
    }

    // para buscar agendas por data e hora exata
    @GetMapping("/byDateTime")
    public ResponseEntity<List<AgendaModel>> buscarAgendasPorDataHoraExata(@RequestParam("dateTime") String dateTimeString) {
        try {
            LocalDateTime dateTime = LocalDateTime.parse(dateTimeString); 
            List<AgendaModel> agendas = agendaService.buscarPorDataAgendada(dateTime);
            if (agendas.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(agendas);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().build();
        }
    }

  
    @GetMapping("/byDate")
    public ResponseEntity<List<AgendaModel>> buscarAgendasPorData(@RequestParam("date") String dateString) {
        try {
            LocalDate date = LocalDate.parse(dateString); 
            List<AgendaModel> agendas = null; 
            if (agendas == null || agendas.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(agendas);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().build();
        }
    }

}