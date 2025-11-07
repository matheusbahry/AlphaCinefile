package com.example.cinefile.Domain.Watchlist;

import com.example.cinefile.Domain.Watchlist.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    boolean existsByObra_Obraid(Long obraid);

    void deleteByObra_Obraid(Long obraid);
}
