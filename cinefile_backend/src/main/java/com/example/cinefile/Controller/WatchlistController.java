package com.example.cinefile.Controller;

import com.example.cinefile.Domain.Obra.Obra;
import com.example.cinefile.Service.WatchlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public ResponseEntity<List<Obra>> listar() {
        return ResponseEntity.ok(watchlistService.listar());
    }

    @PostMapping("/{obraId}")
    public ResponseEntity<String> adicionar(@PathVariable Long obraId) {
        watchlistService.adicionar(obraId);
        return ResponseEntity.ok("Obra adicionada à Watchlist!");
    }

    @DeleteMapping("/{obraId}")
    public ResponseEntity<String> remover(@PathVariable Long obraId) {
        watchlistService.remover(obraId);
        return ResponseEntity.ok("Removida da Watchlist.");
    }
}
