package com.example.cinefile.Infra;

import com.example.cinefile.Domain.Obra.Obra;
import com.example.cinefile.Domain.Obra.ObraRepository;
import com.example.cinefile.Domain.Obra.ObraTipo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Insere alguns registros de exemplo em ambiente de desenvolvimento
 * quando a tabela de obras está vazia. Idempotente via count()==0.
 */
@Component
public class DevDataSeeder implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(DevDataSeeder.class);

    private final ObraRepository obraRepository;

    public DevDataSeeder(ObraRepository obraRepository) {
        this.obraRepository = obraRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (obraRepository.count() > 0) {
            return; // já há dados
        }

        try {
            var seed = List.of(
                    build(278L,  "The Shawshank Redemption", ObraTipo.FILME, 1994, "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"),
                    build(238L,  "The Godfather",             ObraTipo.FILME, 1972, "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"),
                    build(155L,  "The Dark Knight",           ObraTipo.FILME, 2008, "/qJ2tW6WMUDux911r6m7haRef0WH.jpg"),
                    build(1396L, "Breaking Bad",              ObraTipo.SERIE, 2008, "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg"),
                    build(1399L, "Game of Thrones",           ObraTipo.SERIE, 2011, "/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg"),
                    build(66732L,"Stranger Things",           ObraTipo.SERIE, 2016, "/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg")
            );
            obraRepository.saveAll(seed);
            log.info("[DevDataSeeder] Inseriu {} obras de exemplo.", seed.size());
        } catch (Exception ex) {
            log.warn("[DevDataSeeder] Falha ao inserir dados de exemplo: {}", ex.getMessage());
        }
    }

    private static Obra build(Long tmdbId, String titulo, ObraTipo tipo, Integer ano, String posterPath) {
        Obra o = new Obra();
        o.setTmdbId(tmdbId);
        o.setTitulo(titulo);
        o.setTipo(tipo);
        o.setAnolancamento(ano);
        o.setPoster_url(posterPath); // caminho TMDB; front resolve URL completa
        o.setDuracao(tipo == ObraTipo.FILME ? 120 : null);
        o.setDescricao(null);
        return o;
    }
}

