package com.example.cinefile.Domain.Watched;

import com.example.cinefile.Domain.Watched.Watched;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WatchedRepository extends JpaRepository<Watched, Long> {

    List<Watched> findAllByUsuario_Username(String username);
    boolean existsByUsuario_UsernameAndObra_Obraid(String username, Long obraid);
    void deleteByUsuario_UsernameAndObra_Obraid(String username, Long obraid);
}
