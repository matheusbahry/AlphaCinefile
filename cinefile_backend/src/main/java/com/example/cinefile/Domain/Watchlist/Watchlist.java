package com.example.cinefile.Domain.Watchlist;

import com.example.cinefile.Domain.Obra.Obra;
import jakarta.persistence.*;

@Entity
@Table(name = "watchlist")
public class Watchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "obra_id")
    private Obra obra;

    public Watchlist() {}
    public Watchlist(Obra obra) { this.obra = obra; }

    public Long getId() { return id; }
    public Obra getObra() { return obra; }
    public void setObra(Obra obra) { this.obra = obra; }
}
