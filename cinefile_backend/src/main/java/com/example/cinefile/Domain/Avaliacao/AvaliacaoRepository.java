package com.example.cinefile.Domain.Avaliacao;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, UUID> {
    List<Avaliacao> findByUsuario_UsernameOrderByDataCriacaoDesc(String username, Pageable pageable);
}
