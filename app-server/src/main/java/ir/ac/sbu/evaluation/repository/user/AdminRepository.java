package ir.ac.sbu.evaluation.repository.user;

import ir.ac.sbu.evaluation.model.user.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

}
