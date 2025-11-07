package com.example.cinefile.Domain.Watchlist;

import com.example.cinefile.Domain.Obra.Obra;
import com.example.cinefile.Domain.Usuario.Usuario;
import jakarta.persistence.*;

@Entity
@Table(name = "watchlist",
       uniqueConstraints = @UniqueConstraint(name = "uk_watchlist_user_obra", columnNames = {"usuario_id", "obra_id"}))
public class Watchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "obra_id")
    private Obra obra;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Watchlist() {}
    public Watchlist(Usuario usuario, Obra obra) { this.usuario = usuario; this.obra = obra; }

    public Long getId() { return id; }
    public Obra getObra() { return obra; }
    public void setObra(Obra obra) { this.obra = obra; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
