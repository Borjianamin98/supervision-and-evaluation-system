package ir.ac.sbu.evaluation.service.university;

import ir.ac.sbu.evaluation.dto.university.FacultyDto;
import ir.ac.sbu.evaluation.repository.university.FacultyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    public Page<FacultyDto> retrieveUniversityFaculties(long universityId, Pageable pageable) {
        return facultyRepository.findByUniversityId(universityId, pageable).map(FacultyDto::from);
    }

}
