package com.example.cinefile.Controller;

import com.example.cinefile.Domain.Obra.Obra;
import com.example.cinefile.Service.WatchedService;
import com.example.cinefile.Domain.Usuario.Usuario;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watched")
public class WatchedController {

    private final WatchedService watchedService;

    public WatchedController(WatchedService watchedService) {
        this.watchedService = watchedService;
    }

    @GetMapping
    public ResponseEntity<List<Obra>> listar(@AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(watchedService.listar(usuario));
    }

    @PostMapping("/{obraId}")
    public ResponseEntity<String> adicionar(@PathVariable Long obraId, @AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) return ResponseEntity.status(401).build();
        watchedService.adicionar(usuario, obraId);
        return ResponseEntity.ok("Obra marcada como assistida!");
    }

    @DeleteMapping("/{obraId}")
    public ResponseEntity<String> remover(@PathVariable Long obraId, @AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) return ResponseEntity.status(401).build();
        watchedService.remover(usuario, obraId);
        return ResponseEntity.ok("Removida dos assistidos.");
    }
}
