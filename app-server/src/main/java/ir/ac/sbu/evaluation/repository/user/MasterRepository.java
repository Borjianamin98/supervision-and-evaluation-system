package ir.ac.sbu.evaluation.repository.user;

import ir.ac.sbu.evaluation.model.user.Master;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MasterRepository extends JpaRepository<Master, Long> {

    Optional<Master> findByUsername(String username);

    Page<Master> findByFirstNameContainsOrLastNameContains(String firstnameQuery, String lastnameQuery,
            Pageable pageable);
}
