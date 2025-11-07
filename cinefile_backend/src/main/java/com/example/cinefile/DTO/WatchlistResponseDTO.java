package com.example.cinefile.DTO;


import com.example.cinefile.Domain.Watchlist.Watchlist;

import java.time.LocalDateTime;

public record WatchlistResponseDTO(
        Long obraId,
        String obraTitulo
) {
    public WatchlistResponseDTO(Watchlist item) {
        this(
                item.getObra().getObraid(),
                item.getObra().getTitulo()
        );
    }
}