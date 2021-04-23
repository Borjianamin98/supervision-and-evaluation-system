package ir.ac.sbu.evaluation.repository;

import ir.ac.sbu.evaluation.model.university.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {

}
