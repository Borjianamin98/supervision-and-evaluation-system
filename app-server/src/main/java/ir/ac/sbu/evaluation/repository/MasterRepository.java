package ir.ac.sbu.evaluation.repository;

import ir.ac.sbu.evaluation.model.user.Master;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MasterRepository extends JpaRepository<Master, Long> {

}
