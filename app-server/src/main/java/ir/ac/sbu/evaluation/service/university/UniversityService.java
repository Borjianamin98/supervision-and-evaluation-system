package ir.ac.sbu.evaluation.service.university;

import ir.ac.sbu.evaluation.dto.university.UniversityDto;
import ir.ac.sbu.evaluation.repository.university.UniversityRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class UniversityService {

    private final UniversityRepository universityRepository;

    public UniversityService(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
    }

    public List<UniversityDto> retrieveAll() {
        return universityRepository.findAll().stream().map(UniversityDto::from).collect(Collectors.toList());
    }
}
