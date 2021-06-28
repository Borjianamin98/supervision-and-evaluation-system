package ir.ac.sbu.evaluation.model.notification;

import ir.ac.sbu.evaluation.model.Auditable;
import ir.ac.sbu.evaluation.model.user.User;
import java.time.Instant;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "notification")
public class Notification extends Auditable {

    @Column(name = "content", length = 1000, nullable = false, updatable = false)
    private String content;

    @Column(name = "seen", nullable = false)
    private Boolean seen;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Notification() {
    }

    @Builder
    public Notification(Long id,
            String createdBy,
            Instant createdDate,
            String content,
            Boolean seen,
            User user) {
        super(id, createdBy, createdDate);
        this.content = content;
        this.seen = seen;
        this.user = user;
    }
}
