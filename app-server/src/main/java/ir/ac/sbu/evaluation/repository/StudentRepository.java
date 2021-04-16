package ir.ac.sbu.evaluation.repository;

import ir.ac.sbu.evaluation.model.user.Master;
import ir.ac.sbu.evaluation.model.user.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

}
