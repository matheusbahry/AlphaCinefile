package com.example.cinefile.Service;

import com.example.cinefile.Domain.Obra.Obra;
import com.example.cinefile.Domain.Usuario.Usuario;
import com.example.cinefile.Domain.Watched.Watched;
import com.example.cinefile.Domain.Obra.ObraRepository;
import com.example.cinefile.Domain.Watched.WatchedRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchedService {

    private final WatchedRepository repo;
    private final ObraRepository obraRepo;

    public WatchedService(WatchedRepository repo, ObraRepository obraRepo) {
        this.repo = repo;
        this.obraRepo = obraRepo;
    }

    public List<Obra> listar(Usuario usuario) {
        return repo.findAllByUsuario_Username(usuario.getUsername()).stream().map(Watched::getObra).toList();
    }

    public void adicionar(Usuario usuario, Long obraid) {
        if (repo.existsByUsuario_UsernameAndObra_Obraid(usuario.getUsername(), obraid)) return;
        Obra obra = obraRepo.findById(obraid).orElseThrow();
        repo.save(new Watched(usuario, obra));
    }

    public void remover(Usuario usuario, Long obraid) {
        repo.deleteByUsuario_UsernameAndObra_Obraid(usuario.getUsername(), obraid);
    }
}
