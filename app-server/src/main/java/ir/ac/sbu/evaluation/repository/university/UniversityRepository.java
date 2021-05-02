package ir.ac.sbu.evaluation.repository.university;

import ir.ac.sbu.evaluation.model.university.University;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityRepository extends PagingAndSortingRepository<University, Long> {

    Page<University> findByNameContains(String nameQuery, Pageable pageable);

}
