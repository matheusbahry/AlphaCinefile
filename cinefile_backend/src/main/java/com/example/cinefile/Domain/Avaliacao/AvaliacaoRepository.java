package com.example.cinefile.Domain.Avaliacao;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, UUID> {
    List<Avaliacao> findByUsuario_UsernameOrderByDataCriacaoDesc(String username, Pageable pageable);

    @Query("select avg(a.nota) from Avaliacao a where a.obra.obraid = :obraId")
    Double mediaPorObra(@Param("obraId") Long obraId);

    @Query("select count(a) from Avaliacao a where a.obra.obraid = :obraId")
    Long quantidadePorObra(@Param("obraId") Long obraId);

    Avaliacao findFirstByUsuario_UsernameAndObra_Obraid(String username, Long obraId);
}
