package ir.ac.sbu.evaluation.repository;

import ir.ac.sbu.evaluation.model.university.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {

}
