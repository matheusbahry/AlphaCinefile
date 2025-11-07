package com.example.cinefile.Service;

import com.example.cinefile.Domain.Obra.Obra;
import com.example.cinefile.Domain.Usuario.Usuario;
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

    public List<Obra> listar(Usuario usuario) {
        return repo.findAllByUsuario_Username(usuario.getUsername()).stream().map(Watchlist::getObra).toList();
    }

    public void adicionar(Usuario usuario, Long obraid) {
        if (repo.existsByUsuario_UsernameAndObra_Obraid(usuario.getUsername(), obraid)) return;
        Obra obra = obraRepo.findById(obraid).orElseThrow();
        repo.save(new Watchlist(usuario, obra));
    }

    public void remover(Usuario usuario, Long obraid) {
        repo.deleteByUsuario_UsernameAndObra_Obraid(usuario.getUsername(), obraid);
    }
}
