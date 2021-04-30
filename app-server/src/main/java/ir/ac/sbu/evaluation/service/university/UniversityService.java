package ir.ac.sbu.evaluation.service.university;

import ir.ac.sbu.evaluation.dto.university.FacultyDto;
import ir.ac.sbu.evaluation.dto.university.UniversityDto;
import ir.ac.sbu.evaluation.model.university.University;
import ir.ac.sbu.evaluation.repository.university.UniversityRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UniversityService {

    private final UniversityRepository universityRepository;

    public UniversityService(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
    }

    public List<UniversityDto> retrieveAll() {
        return universityRepository.findAll().stream().map(UniversityDto::from).collect(Collectors.toList());
    }

    @Transactional
    public List<FacultyDto> retrieveUniversityFaculties(long universityId) {
        return universityRepository.findById(universityId)
                .orElseThrow(() -> new IllegalArgumentException("University not found: ID = " + universityId))
                .getFaculties().stream().map(FacultyDto::from).collect(Collectors.toList());
    }

    public UniversityDto register(UniversityDto universityDto) {
        University university = universityDto.toUniversity();
        return UniversityDto.from(universityRepository.save(university));
    }
}
