package com.example.cinefile.Controller;

import com.example.cinefile.Domain.Avaliacao.RequestAvaliacao;
import com.example.cinefile.Domain.Usuario.Usuario;
import com.example.cinefile.DTO.AvaliacaoResponseDTO;
import com.example.cinefile.Service.AvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    // -------- POST: criar avaliação --------
    @PostMapping
    public ResponseEntity<AvaliacaoResponseDTO> createAvaliacao(
            @RequestBody @Valid RequestAvaliacao data,
            @AuthenticationPrincipal Usuario usuarioLogado
    ) {
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        AvaliacaoResponseDTO novaAvaliacao = avaliacaoService.criarAvaliacao(data, usuarioLogado);
        return ResponseEntity.ok(novaAvaliacao);
    }

    // -------- PUT: atualizar avaliação --------
    @PutMapping("/{id}")
    public ResponseEntity<AvaliacaoResponseDTO> updateAvaliacao(
            @PathVariable UUID id,
            @RequestBody @Valid RequestAvaliacao data,
            @AuthenticationPrincipal Usuario usuarioLogado
    ) {
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        AvaliacaoResponseDTO avaliacaoAtualizada = avaliacaoService.atualizarAvaliacao(id, data, usuarioLogado);
        return ResponseEntity.ok(avaliacaoAtualizada);
    }

    // -------- DELETE: deletar avaliação --------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvaliacao(
            @PathVariable UUID id,
            @AuthenticationPrincipal Usuario usuarioLogado
    ) {
        if (usuarioLogado == null) {
            return ResponseEntity.status(401).build();
        }

        avaliacaoService.deletarAvaliacao(id, usuarioLogado);
        return ResponseEntity.noContent().build();
    }

    // -------- GET: minhas últimas avaliações --------
    @GetMapping("/minhas")
    public ResponseEntity<List<AvaliacaoResponseDTO>> minhas(
            @AuthenticationPrincipal Usuario usuarioLogado,
            @RequestParam(name = "limit", defaultValue = "8") int limit
    ) {
        if (usuarioLogado == null) return ResponseEntity.status(401).build();
        var page = PageRequest.of(0, Math.max(1, Math.min(50, limit)));
        var list = avaliacaoService.listarUltimasDoUsuario(usuarioLogado.getUsername(), page);
        return ResponseEntity.ok(list);
    }
}
