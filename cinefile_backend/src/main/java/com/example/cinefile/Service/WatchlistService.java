package com.example.cinefile.Service;

import com.example.cinefile.Domain.Obra.Obra;
import com.example.cinefile.Domain.Watchlist.Watchlist;

import com.example.cinefile.Domain.Obra.ObraRepository;
import com.example.cinefile.Domain.Watchlist.WatchlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistService {

    private final WatchlistRepository repo;
    private final ObraRepository obraRepo;

    public WatchlistService(WatchlistRepository repo, ObraRepository obraRepo) {
        this.repo = repo;
        this.obraRepo = obraRepo;
    }

    public List<Obra> listar() {
        return repo.findAll().stream().map(Watchlist::getObra).toList();
    }

    public void adicionar(Long obraid) {
        if (repo.existsByObra_Obraid(obraid)) return;
        Obra obra = obraRepo.findById(obraid).orElseThrow();
        repo.save(new Watchlist(obra));
    }

    public void remover(Long obraid) {
        repo.deleteByObra_Obraid(obraid);
    }
}
