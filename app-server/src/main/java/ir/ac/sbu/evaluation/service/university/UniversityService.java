package ir.ac.sbu.evaluation.service.university;

import ir.ac.sbu.evaluation.dto.university.UniversityDto;
import ir.ac.sbu.evaluation.exception.ResourceNotFoundException;
import ir.ac.sbu.evaluation.model.university.University;
import ir.ac.sbu.evaluation.repository.university.UniversityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UniversityService {

    private final UniversityRepository universityRepository;

    public UniversityService(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
    }

    public Page<UniversityDto> retrieveAll(Pageable pageable) {
        return universityRepository.findAll(pageable).map(UniversityDto::from);
    }

    public UniversityDto register(UniversityDto universityDto) {
        University university = universityDto.toUniversity();
        return UniversityDto.from(universityRepository.save(university));
    }

    public UniversityDto update(long universityId, UniversityDto universityDto) {
        universityRepository.findById(universityId)
                .orElseThrow(() -> new ResourceNotFoundException("University not found: ID = " + universityId));

        University university = universityDto.toUniversity();
        university.setId(universityId);
        return UniversityDto.from(universityRepository.save(university));
    }

    public UniversityDto delete(long universityId) {
        University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new ResourceNotFoundException("University not found: ID = " + universityId));
        universityRepository.delete(university);
        return UniversityDto.from(university, false);
    }
}
