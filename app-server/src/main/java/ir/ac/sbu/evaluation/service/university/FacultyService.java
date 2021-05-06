package ir.ac.sbu.evaluation.service.university;

import ir.ac.sbu.evaluation.dto.university.FacultyDto;
import ir.ac.sbu.evaluation.exception.ResourceNotFoundException;
import ir.ac.sbu.evaluation.model.university.Faculty;
import ir.ac.sbu.evaluation.model.university.University;
import ir.ac.sbu.evaluation.repository.university.FacultyRepository;
import ir.ac.sbu.evaluation.repository.university.UniversityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FacultyService {

    private final UniversityRepository universityRepository;
    private final FacultyRepository facultyRepository;

    public FacultyService(UniversityRepository universityRepository,
            FacultyRepository facultyRepository) {
        this.universityRepository = universityRepository;
        this.facultyRepository = facultyRepository;
    }

    public Page<FacultyDto> retrieveUniversityFaculties(long universityId, String nameQuery, Pageable pageable) {
        return facultyRepository.findByUniversityIdAndNameContains(universityId, nameQuery, pageable)
                .map(FacultyDto::from);
    }

    public FacultyDto register(long universityId, FacultyDto facultyDto) {
        University university = universityRepository.findById(universityId)
                .orElseThrow(() -> new ResourceNotFoundException("University not found: ID = " + universityId));

        Faculty faculty = facultyDto.toFaculty();
        faculty.setUniversity(university);
        return FacultyDto.from(facultyRepository.save(faculty));
    }

    public FacultyDto update(long facultyId, FacultyDto facultyDto) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found: ID = " + facultyId));

        faculty.setName(facultyDto.getName());
        if (facultyDto.getWebAddress() != null) {
            faculty.setWebAddress(facultyDto.getWebAddress());
        }
        return FacultyDto.from(facultyRepository.save(faculty));
    }

    public FacultyDto delete(long facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found: ID = " + facultyId));
        facultyRepository.delete(faculty);
        return FacultyDto.from(faculty, false);
    }
}
