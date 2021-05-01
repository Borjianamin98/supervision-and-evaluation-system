package ir.ac.sbu.evaluation.repository.university;

import ir.ac.sbu.evaluation.model.university.University;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityRepository extends PagingAndSortingRepository<University, Long> {

}
