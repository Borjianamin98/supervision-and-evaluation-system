package ir.ac.sbu.evaluation.repository.university;

import ir.ac.sbu.evaluation.model.university.Faculty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    Page<Faculty> findByUniversityId(Long universityId, Pageable pageable);
}
