package com.example.cinefile.Domain.Watchlist;

import com.example.cinefile.Domain.Watchlist.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    List<Watchlist> findAllByUsuario_Username(String username);

    boolean existsByUsuario_UsernameAndObra_Obraid(String username, Long obraid);

    void deleteByUsuario_UsernameAndObra_Obraid(String username, Long obraid);
}
